import * as service from '../services/curso.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — cursos. Aquí viven las reglas de negocio.
// El id y el rol del usuario que hace la petición vienen en req.usuario
// (lo puso el middleware `proteger` desde el token).
// ---------------------------------------------------------------------------

// GET /api/cursos — todos los cursos (con populate de profesor y alumnos).
export const listar = async (req, res) => {
  try {
    const cursos = await service.listarCursos()
    // TODO: devuelve todos los cursos, con .populate() del profesor y los alumnos.
    res.status(200).json(cursos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos — crea un curso (nace EN_MATRICULA, sin profesor).
export const crear = async (req, res) => {
  try {
    const curso = await service.crearCurso({
      ...req.body,
      estado: 'EN_MATRICULA',
      profesor: null,
      alumnos: [],
    })

    // TODO: crea el curso con los datos del body. Status 201.
    res.status(201).json(curso)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// PUT /api/cursos/:id — edita un curso.
export const editar = async (req, res) => {
  try {
    const curso = await service.editarCurso(req.params.id, req.body)

    if (!curso) {
      return res.status(404).json({
        error: 'Curso no encontrado'
      })
    }
    // TODO: edita el curso. Si no existe → 404.
    res.status(200).json(curso)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id — borra un curso.
export const borrar = async (req, res) => {
  try {
    // TODO: borra el curso. Si no existe → 404.
    const curso = await service.borrarCurso(req.params.id)

    if (!curso) {
      return res.status(404).json({
        error: 'Curso no encontrado',
      })
    }

    res.status(200).json({
      mensaje: 'Curso eliminado correctamente',
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/mis-cursos — los cursos que dicta ESTE profesor.
export const misCursos = async (req, res) => {
  try {
    const curso = await service.cursosDelProfesor(req.usuario.id)
    // TODO: filtra los cursos por profesor = req.usuario.id.

    res.status(200).json(curso)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/asignarme — el profesor se asigna un curso libre.
export const asignarme = async (req, res) => {
  try {
    // TODO — REGLA DE NEGOCIO:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si YA tiene profesor → 409 (nadie se lo quita a otro).
    //   3. Si está libre → asígnale req.usuario.id como profesor. Guarda.
    const curso = await service.buscarCurso(req.params.id)

    if (!curso) {
      return res.status(404).json({
        error: 'Curso no encontrado',
      })
    }

    if (curso.profesor) {
      return res.status(409).json({
        error: 'El curso ya tiene un profesor asignado',
      })
    }

    curso.profesor = req.usuario.id

    await curso.save()

    res.status(200).json({
      mensaje: 'Profesor asignado correctamente',
      curso,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/:id/alumnos — solo el profesor que dicta el curso.
export const alumnosDelCurso = async (req, res) => {
  try {
    // TODO — REGLA DE PROPIEDAD:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si el profesor del curso NO es req.usuario.id → 403.
    //   3. Devuelve la lista de alumnos (con populate).
    const curso = await service.buscarCurso(req.params.id)

    if (!curso) {
      return res.status(404).json({
        error: 'Curso no encontrado'
      })
    }

    if (!curso.profesor) {
      return res.status(403).json({
        error: 'No eres el profesor de este curso',
      })
    }

    const profesorId = curso.profesor._id
    ? curso.profesor._id.toString()
    : curso.profesor.toString()

    if (profesorId !== req.usuario.id) {
      return res.status(403).json({
        error: 'No tienes permiso para ver los alumnos de este curso',
      })
    }

    res.status(200).json(curso.alumnos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/cursos/mis-matriculas — los cursos donde está matriculado ESTE alumno.
export const misMatriculas = async (req, res) => {
  try {
    
    const curso = await service.cursosDelAlumno(req.usuario.id)

    res.status(200).json(curso)
    // TODO: filtra los cursos que tengan a req.usuario.id en su array de alumnos.
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/matricularme — el alumno se matricula a sí mismo.
export const matricularme = async (req, res) => {
  try {
    const curso = await service.buscarCurso(req.params.id)

    if (!curso) {
      return res.status(404).json({
        error: 'Curso no encontrado',
      })
    }

    if (curso.estado !== 'EN_MATRICULA') {
      return res.status(409).json({
        error: 'El curso está cerrado para matrículas',
      })
    }

    const yaMatriculado = curso.alumnos.some((alumno) => {
      const alumnoId = alumno._id
        ? alumno._id.toString()
        : alumno.toString()

      return alumnoId === req.usuario.id
    })

    if (yaMatriculado) {
      return res.status(409).json({
        error: 'Ya estás matriculado en este curso',
      })
    }

    curso.alumnos.push(req.usuario.id)

    await curso.save()

    res.status(200).json({
      mensaje: 'Matrícula realizada correctamente',
      curso,
    })
  } catch (error) {
    res.status(400).json({
      error: error.message,
    })
  }
}

// DELETE /api/cursos/:id/matricularme — el alumno se sale del curso.
export const desmatricularme = async (req, res) => {
  try {
    // TODO:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si NO está EN_MATRICULA → 409.
    //   3. Quita a req.usuario.id del array de alumnos. Guarda.
    const curso = await service.buscarCurso(req.params.id)

    if (!curso) {
      return res.status(404).json({
        error: 'Curso no encontrado',
      })
    }

    if (curso.estado !== 'EN_MATRICULA'){
      return res.status(409).json({
        error: 'El curso esta cerrado para matriculas',
      })
    }


    curso.alumnos = curso.alumnos.filter((alumno) => {
      const alumnoId = alumno._id
        ? alumno._id.toString()
        : alumno.toString()

      return alumnoId !== req.usuario.id

    })

    await curso.save()

    res.status(200).json({
      mensaje: 'Te desmatriculaste correctamente',
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
