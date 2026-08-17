# 🎓 Evaluación Integradora · Plataforma de Cursos

**Diplomado IPS · Módulo 3 — Backend y APIs REST**  
**Instituto Profesional San Sebastián**

API REST desarrollada como Evaluación Integradora del Módulo 3.

El proyecto implementa una plataforma de cursos que permite registrar profesores
y alumnos, autenticarse mediante JWT, administrar cursos, asignar profesores,
matricular alumnos y aplicar reglas de negocio y autorización por roles.

---

## 👨‍💻 Autor

**Deyvis Salas Ron**

GitHub:
https://github.com/DeyvisRon1

Repositorio del proyecto:
https://github.com/DeyvisRon1/IPSS-DIPLOMADO-CURSO3-Evaluacion-Final

---

## 🎥 Video de demostración

En el siguiente video se demuestra el funcionamiento de la API utilizando Postman.

🔗 Video:
https://youtu.be/SfW-1t4R8Fw

En el video se muestran pruebas de:

- Registro y autenticación.
- Generación y uso de JWT.
- Protección de rutas.
- Autorización por roles.
- Creación y administración de cursos.
- Asignación de profesores.
- Matrícula de alumnos.
- Validaciones de reglas de negocio.
- Relaciones entre documentos mediante `populate()`.
- Uso de códigos HTTP.

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- dotenv
- Postman
- Git
- GitHub

---

## 📂 Estructura del proyecto

```text
├── config/
│   ├── db.js
│   └── jwt.js
│
├── controllers/
│   ├── auth.controller.js
│   └── curso.controller.js
│
├── middlewares/
│   └── proteger.js
│
├── models/
│   ├── profesor.model.js
│   ├── alumno.model.js
│   └── curso.model.js
│
├── routes/
│   ├── auth.routes.js
│   └── curso.routes.js
│
├── services/
│   ├── auth.service.js
│   └── curso.service.js
│
├── server.js
├── package.json
└── README.md
```

---

# 📚 Funcionalidades implementadas

## 1. Modelado de datos

Se implementaron tres modelos principales:

### Profesor

Contiene información del profesor como:

- nombre
- email
- password

### Alumno

Contiene:

- nombre
- email
- teléfono
- password

### Curso

Contiene:

- nombre
- fecha de inicio
- fecha de término
- estado
- profesor
- alumnos

Los cursos utilizan referencias `ObjectId` de MongoDB para relacionarse
con profesores y alumnos.

---

## 2. Relaciones con Mongoose

El curso mantiene una referencia al profesor:

```javascript
profesor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Profesor',
  default: null
}
```

También mantiene un arreglo de alumnos:

```javascript
alumnos: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumno'
  }
]
```

Se utiliza `.populate()` para obtener la información relacionada.

---

## 3. Autenticación

El sistema permite:

- Registrar profesores.
- Registrar alumnos.
- Iniciar sesión.
- Generar tokens JWT.

Las contraseñas son protegidas utilizando `bcrypt`.

El JWT contiene información necesaria para identificar al usuario y su rol.

---

## 4. Autorización y seguridad

Se implementó el middleware:

```text
proteger
```

Este middleware verifica el JWT enviado mediante:

```text
Authorization: Bearer TOKEN
```

También se implementó:

```text
soloRol
```

para restringir determinadas operaciones según el usuario sea:

```text
profesor
alumno
```

---

# 📖 Gestión de cursos

La API permite realizar operaciones CRUD sobre los cursos:

- Crear cursos.
- Listar cursos.
- Editar cursos.
- Eliminar cursos.

Además, se implementaron reglas para que los profesores solamente puedan
administrar los cursos que les corresponden.

---

# 👨‍🏫 Asignación de profesores

Un profesor puede asignarse a un curso disponible.

La asignación utiliza la regla:

> El primer profesor que se asigna al curso se convierte en su profesor.

Si otro profesor intenta asignarse posteriormente, la API devuelve:

```text
409 Conflict
```

---

# 👨‍🎓 Matrícula de alumnos

Los alumnos pueden matricularse en cursos cuyo estado sea:

```text
EN_MATRICULA
```

El sistema valida que:

- El curso exista.
- El curso esté abierto para matrícula.
- El alumno no esté matriculado previamente.

Si el alumno intenta matricularse dos veces:

```text
409 Conflict
```

Si el curso está:

```text
CERRADO
```

la matrícula también es rechazada.

---

# 🔐 Permisos

Se implementaron restricciones para proteger los recursos.

Ejemplos:

```text
Sin token
→ 401 Unauthorized

Alumno intentando realizar una operación de profesor
→ 403 Forbidden

Profesor intentando modificar el curso de otro profesor
→ 403 Forbidden

Matrícula duplicada
→ 409 Conflict

Matrícula en curso cerrado
→ 409 Conflict
```

---

# 🌐 Principales endpoints

## Autenticación

```text
POST /api/auth/registro/profesor
POST /api/auth/registro/alumno
POST /api/auth/login
```

## Cursos

```text
GET    /api/cursos
POST   /api/cursos
PUT    /api/cursos/:id
DELETE /api/cursos/:id
```

## Operaciones de profesores y alumnos

```text
POST /api/cursos/:id/asignarme
POST /api/cursos/:id/matricularme
GET  /api/cursos/mis-matriculas
GET  /api/cursos/mis-cursos
GET  /api/cursos/:id/alumnos
```

---

# 📡 Códigos HTTP utilizados

La API utiliza los códigos HTTP correspondientes según cada situación:

| Código | Significado |
|---|---|
| `200` | Operación realizada correctamente |
| `201` | Recurso creado correctamente |
| `400` | Datos inválidos |
| `401` | Usuario no autenticado |
| `403` | Usuario sin permisos |
| `404` | Recurso no encontrado |
| `409` | Conflicto con una regla de negocio |

---

# 🚀 Instalación

Clonar el repositorio:

```bash
git clone https://github.com/DeyvisRon1/IPSS-DIPLOMADO-CURSO3-Evaluacion-Final.git
```

Entrar al proyecto:

```bash
cd IPSS-DIPLOMADO-CURSO3-Evaluacion-Final
```

Instalar dependencias:

```bash
npm install
```

---

# ⚙️ Variables de entorno

Por seguridad, las credenciales reales de MongoDB y el secreto JWT
no deben almacenarse en el repositorio público.

Configurar las variables necesarias localmente:

```env
MONGODB_URI=TU_URI_DE_MONGODB
JWT_SECRET=TU_SECRETO_JWT
```

> ⚠️ Nunca publicar las credenciales reales de MongoDB ni el `JWT_SECRET`.

---

# ▶️ Ejecutar el proyecto

```bash
npm run dev
```

Si la conexión funciona correctamente se mostrará:

```text
🍃 conectado a MongoDB → base "plataformaCursos"
✅ API escuchando en http://localhost:3000
```

La API estará disponible en:

```text
http://localhost:3000
```

---

# 🧪 Pruebas

Las pruebas de la API fueron realizadas utilizando Postman.

Entre los casos probados se encuentran:

1. Login y generación de JWT.
2. Acceso a rutas protegidas.
3. Restricción de operaciones según rol.
4. Creación de cursos.
5. Asignación de profesor.
6. Matrícula de alumnos.
7. Prevención de matrículas duplicadas.
8. Bloqueo de matrícula en cursos cerrados.
9. Restricción de modificación de cursos de otros profesores.
10. Relaciones mediante `populate()`.

---

# ✅ Resultado

La API implementa los principales requerimientos solicitados en la
Evaluación Integradora:

- Modelado con MongoDB y Mongoose.
- Relaciones entre Profesor, Alumno y Curso.
- CRUD de cursos.
- Autenticación con JWT.
- Contraseñas protegidas con bcrypt.
- Autorización basada en roles.
- Reglas de negocio para profesores y matrículas.
- Uso de `.populate()`.
- Manejo de códigos HTTP.
- Persistencia en MongoDB Atlas.

---

**Instituto Profesional San Sebastián**  
**Diplomado · Módulo 3 — Backend y APIs REST**

**Desarrollado por Deyvis Salas Ron**