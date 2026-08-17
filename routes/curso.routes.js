import { Router } from 'express'
import * as controller from '../controllers/curso.controller.js'
import { proteger, soloRol } from '../middlewares/proteger.js'

// ---------------------------------------------------------------------------
// RUTAS — cursos. La mayoría van protegidas y con rol.
// Recuerda: todo lo de aquí exige token. Pon `proteger` (y `soloRol` donde
// corresponda) delante del controller.
// ---------------------------------------------------------------------------
export const cursoRoutes = Router()

// TODO: conecta cada ruta. Ejemplos de la forma (ver enunciado para el detalle):
//
//  ── Profesor ──
// listar todos los cursos 
     cursoRoutes.get(
        '/', 
        proteger,
        soloRol('profesor'),
        controller.listar,
        )

// Crear un curso 
     cursoRoutes.post(
        '/',
        proteger,
        soloRol('profesor'),
        controller.crear,
    )

// Ver los cursos del profesor autenticado
     cursoRoutes.get(
        '/mis-cursos',
         proteger,
         soloRol('profesor'),
         controller.misCursos,
    )





//
//  ── Alumno ──
   cursoRoutes.get(
    '/mis-matriculas',
     proteger,
     soloRol('alumno'),
     controller.misMatriculas,
    )


// Rutas Dinamicas 

// Editar Curso
   cursoRoutes.put(
    '/:id',
     proteger,
     soloRol('profesor'),
     controller.editar,
    )

// Borrar curso

   cursoRoutes.delete(
    '/:id',
     proteger,
     soloRol('profesor'),
     controller.borrar,
    )

// Profesor se asigna un curso
   cursoRoutes.post(
    '/:id/asignarme',
     proteger,
     soloRol('profesor'),
    controller.asignarme,
    )

// Profesor consulta alumnos de su curso

   cursoRoutes.get(
    '/:id/alumnos',
     proteger,
     soloRol('profesor'),
     controller.alumnosDelCurso,
    )

// Alumno se matricula


   cursoRoutes.post(
    '/:id/matricularme',
     proteger,
     soloRol('alumno'),
     controller.matricularme,
    )

// Alumno se desmatricula

   cursoRoutes.delete(
    '/:id/matricularme',
     proteger,
     soloRol('alumno'),
     controller.desmatricularme,
    )
//
// ⚠️ OJO con el orden: las rutas fijas (/mis-cursos) van ANTES que las
//    dinámicas (/:id), o Express interpretará "mis-cursos" como un :id.
