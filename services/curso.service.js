import { Curso } from '../models/curso.model.js'

// ---------------------------------------------------------------------------
// SERVICE — cursos. Habla con la base de datos.
// Las REGLAS DE NEGOCIO (validar estado, propiedad, etc.) pueden ir aquí o en
// el controller: tú decides, pero que estén en el servidor, no en el cliente.
// ---------------------------------------------------------------------------

// TODO: implementa las funciones que tus controllers necesiten. Por ejemplo:
//   - listarCursos()            → Curso.find().populate('profesor').populate('alumnos')
//   - crearCurso(datos)
//   - buscarCurso(id)
//   - editarCurso(id, datos)
//   - borrarCurso(id)
//   - cursosDelProfesor(profesorId)
//   - cursosDelAlumno(alumnoId)
//
// Piensa qué necesita cada ruta y crea solo lo que uses.
export const listarCursos = async () => {
  return await Curso.find()
    .populate('profesor', 'nombre email')
    .populate('alumnos', 'nombre email telefono')
}

// Crear Curso
export const crearCurso = async (datos) => {
  return await Curso.create(datos)
}

// Buscar curso
export const buscarCurso = async (id) => {
  return await Curso.findById(id)
    .populate('profesor', 'nombre email')
    .populate('alumnos', 'nombre email telefono')
}

// Editar curso
export const editarCurso = async (id, datos) => {
  return await Curso.findByIdAndUpdate(
    id,
    datos,
    {
      returnDocument: 'after',
      runValidators: true,
    }
  )
    .populate('profesor', 'nombre email')
    .populate('alumnos', 'nombre email telefono')
}

// Borrar curso 
export const borrarCurso = async (id) => {
  return await Curso.findByIdAndDelete(id)
}

// Cursos asignados a un profesor
export const cursosDelProfesor = async (profesorId) => {
  return await Curso.find({
    profesor: profesorId,
  })
    .populate('profesor', 'nombre email')
    .populate('alumnos', 'nombre email telefono')
}

// Cursos donde esta matriculado un alumno
export const cursosDelAlumno = async (alumnoId) => {
  return await Curso.find({
    alumnos: alumnoId,
  })
    .populate('profesor', 'nombre email')
    .populate('alumnos', 'nombre email telefono')
}