import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// MODELO — Alumno.
// ---------------------------------------------------------------------------
// TODO: define el schema del alumno. Campos (ver enunciado):
//   - nombre    (texto, obligatorio)
//   - email     (texto, único, obligatorio)
//   - telefono  (texto)
//   - password  (texto, obligatorio) → HASHEADO con bcrypt

const alumnoSchema = new mongoose.Schema(
  {
    // ...
  },
  { timestamps: true },
)

export const Alumno = mongoose.model('Alumno', alumnoSchema, 'alumnos')
