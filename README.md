# Sistema de Gestión de Laboratorios

API RESTful para la gestión de laboratorios, asignaturas, parciales, prácticas y uso de equipos en un entorno académico.

## Características

- Gestión completa de laboratorios
- Administración de asignaturas y docentes
- Control de parciales y prácticas
- Registro de uso de equipos
- Estadísticas de uso
- Autenticación y autorización
- Documentación completa de la API

## Requisitos

- Node.js 18.x o superior
- AWS CLI configurado con credenciales válidas
- Serverless Framework instalado globalmente (`npm install -g serverless`)
- Una base de datos DynamoDB (se crea automáticamente en el despliegue)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [url-del-repositorio]
   cd lab-registro
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar el archivo .env con tus credenciales
   ```

## Despliegue

Para desplegar el proyecto en AWS:

```bash
# Desplegar en desarrollo
npm run deploy:dev

# Desplegar en producción
npm run deploy:prod
```

## Estructura del Proyecto

```
src/
├── controllers/    # Controladores para manejar las peticiones HTTP
├── handlers/       # Manejadores de Lambda
├── libs/           # Utilidades y bibliotecas compartidas
├── models/         # Modelos de datos
├── repositories/   # Capa de acceso a datos
└── services/       # Lógica de negocio
```

## Endpoints de la API

### Laboratorios
- `GET /` - Página de bienvenida
- `POST /laboratorios` - Crear un nuevo laboratorio
- `GET /laboratorios` - Listar todos los laboratorios
- `GET /laboratorios/{id}` - Obtener un laboratorio por ID
- `PUT /laboratorios/{id}` - Actualizar un laboratorio
- `DELETE /laboratorios/{id}` - Eliminar un laboratorio
- `GET /laboratorios/{id}/disponibilidad` - Verificar disponibilidad

### Asignaturas
- `POST /asignaturas` - Crear una nueva asignatura
- `GET /asignaturas` - Listar todas las asignaturas
- `GET /asignaturas/{id}` - Obtener una asignatura por ID
- `PUT /asignaturas/{id}` - Actualizar una asignatura
- `DELETE /asignaturas/{id}` - Eliminar una asignatura
- `GET /docentes/{docenteId}/asignaturas` - Obtener asignaturas por docente
- `GET /asignaturas/{id}/parciales` - Obtener parciales de una asignatura

### Parciales
- `POST /asignaturas/{asignaturaId}/parciales` - Crear un nuevo parcial
- `GET /asignaturas/{asignaturaId}/parciales` - Listar parciales de una asignatura
- `GET /asignaturas/{asignaturaId}/parciales/{id}` - Obtener un parcial
- `PUT /asignaturas/{asignaturaId}/parciales/{id}` - Actualizar un parcial
- `DELETE /asignaturas/{asignaturaId}/parciales/{id}` - Eliminar un parcial
- `GET /parciales/activos` - Listar parciales activos
- `GET /asignaturas/{asignaturaId}/parciales/{id}/practicas` - Obtener prácticas de un parcial

### Prácticas
- `POST /asignaturas/{asignaturaId}/parciales/{parcialId}/practicas` - Crear práctica
- `GET /practicas/{id}` - Obtener una práctica
- `PUT /practicas/{id}` - Actualizar una práctica
- `DELETE /practicas/{id}` - Eliminar una práctica
- `GET /asignaturas/{asignaturaId}/parciales/{parcialId}/practicas` - Listar prácticas de un parcial
- `GET /laboratorios/{laboratorioId}/practicas` - Listar prácticas de un laboratorio
- `GET /practicas/{id}/usos` - Obtener usos de una práctica

### Uso de Equipos
- `POST /uso-equipos` - Registrar uso de equipo
- `PUT /uso-equipos/{id}/finalizar` - Finalizar uso de equipo
- `GET /uso-equipos/{id}` - Obtener un registro de uso
- `GET /estudiantes/{estudianteId}/usos` - Obtener usos por estudiante
- `GET /practicas/{practicaId}/usos` - Obtener usos por práctica
- `GET /laboratorios/{laboratorioId}/usos` - Obtener usos por laboratorio
- `GET /laboratorios/{laboratorioId}/estadisticas` - Obtener estadísticas de uso

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# AWS
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1

# App
NODE_ENV=production
STAGE=prod
DYNAMODB_TABLE=lab-registro-${STAGE}
```

## Scripts de NPM

- `npm run deploy:dev` - Desplegar en entorno de desarrollo
- `npm run deploy:prod` - Desplegar en producción
- `npm run remove:dev` - Eliminar despliegue de desarrollo
- `npm run remove:prod` - Eliminar despliegue de producción
- `npm run test` - Ejecutar pruebas
- `npm run lint` - Ejecutar linter

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/awesome-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some awesome feature'`)
4. Haz push a la rama (`git push origin feature/awesome-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. de Registro de Laboratorios

API RESTful para el registro de uso de laboratorios, desarrollada con Node.js, AWS Lambda, API Gateway y DynamoDB utilizando el framework Serverless.

## Características

- Gestión de laboratorios
- Gestión de asignaturas y parciales
- Registro de prácticas
- Control de uso de equipos
- API RESTful con autenticación
- Base de datos NoSQL con DynamoDB
- Despliegue serverless

## Requisitos

- Node.js 16.x o superior
- npm o yarn
- Cuenta de AWS configurada
- Serverless Framework instalado globalmente

## Configuración del Entorno

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
4. Configura las variables de entorno en el archivo `.env`

## Estructura del Proyecto

```
.
├── src/
│   ├── handlers/         # Controladores de las funciones Lambda
│   │   ├── asignaturas.js
│   │   ├── laboratorios.js
│   │   ├── parciales.js
│   │   ├── practicas.js
│   │   └── usoEquipos.js
│   ├── libs/             # Utilidades y bibliotecas compartidas
│   │   └── dynamo.js
│   └── models/           # Modelos de datos
├── .env.example          # Ejemplo de variables de entorno
├── serverless.yml        # Configuración de Serverless Framework
└── package.json          # Dependencias y scripts
```

## Despliegue

Para desplegar en desarrollo:

```bash
npm run deploy
```

Para producción:

```bash
npm run deploy:prod
```

## Desarrollo Local

Para desarrollo local con Serverless Offline:

```bash
npm start
```

## API Endpoints

### Laboratorios
- `POST /laboratorios` - Crear un nuevo laboratorio
- `GET /laboratorios` - Listar todos los laboratorios
- `GET /laboratorios/{id}` - Obtener un laboratorio por ID
- `PUT /laboratorios/{id}` - Actualizar un laboratorio
- `DELETE /laboratorios/{id}` - Eliminar un laboratorio

### Asignaturas
- `POST /asignaturas` - Crear una nueva asignatura
- `GET /asignaturas` - Listar todas las asignaturas
- `GET /asignaturas/{id}` - Obtener una asignatura por ID

### Parciales
- `POST /asignaturas/{asignaturaId}/parciales` - Crear un nuevo parcial
- `GET /asignaturas/{asignaturaId}/parciales` - Listar parciales de una asignatura

### Prácticas
- `POST /practicas` - Crear una nueva práctica
- `GET /practicas` - Listar todas las prácticas

### Uso de Equipos
- `POST /uso-equipos` - Registrar uso de un equipo
- `PUT /uso-equipos/{id}/finalizar` - Finalizar uso de un equipo
- `GET /uso-equipos` - Listar todos los usos de equipos

## Estructura de Datos

### Laboratorio
```json
{
  "PK": "LAB#<id>",
  "SK": "META",
  "tipo": "Laboratorio",
  "nombre": "Nombre del laboratorio",
  "ubicacion": "Edificio X, Piso Y",
  "equiposDisponibles": ["PC01", "PC02"],
  "fechaCreacion": "2023-01-01T00:00:00.000Z"
}
```

### Asignatura
```json
{
  "PK": "ASG#<codigo>",
  "SK": "META",
  "tipo": "Asignatura",
  "nombre": "Nombre de la asignatura",
  "codigo": "COD123",
  "docenteId": "DOC#123",
  "fechaCreacion": "2023-01-01T00:00:00.000Z"
}
```

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

Which should result in response similar to:

```json
{ "message": "Go Serverless v4! Your function executed successfully!" }
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.

## 👥 Integrantes del Equipo y Responsabilidades

###  EDISON ALEXANDER ARAMBULO ROJAS
**Responsable de:**
-  Actividad 1: Configuración del Entorno Backend  
   - Instalar Node.js, Framework Serverless y configurar credenciales de AWS  
   - Crear el proyecto inicial con `serverless create`  
   - Instalar dependencias necesarias (`aws-sdk`, `joi`, etc.)
-  Actividad 3 (parte): Implementar CRUD para `/laboratorios` y `/asignaturas`
-  Colaborar en documentación técnica de backend (README.md sección: Tecnologías utilizadas, Configuración del entorno)

---

###  ADRIANA PAMELA GONZALEZ ORELLANA
**Responsable de:**
-  Actividad 2: Diseño de la Base de Datos en DynamoDB  
   - Modelar todas las entidades según el patrón de Single Table Design  
   - Crear esquema lógico y definir claves de partición y sort key
-  Actividad 3 (parte): Implementar CRUD para `/parciales` y `/practicas`
-  Contribuir con diagramas o representaciones del modelo en el README.md

---

###  JHON STEEVEN GUAMAN TOBAR
**Responsable de:**
-  Actividad 3 (parte):  
   - Implementar endpoints RESTful para `/uso-equipos`  
   - Finalizar configuración del `serverless.yml` para todas las funciones Lambda y recursos
-  Actividad 4: Arquitectura limpia del backend  
   - Separar el código por capas (controladores, servicios, repositorios)  
   - Garantizar buenas prácticas de organización
-  Documentar la estructura del backend y los endpoints en el README.md

---

###  STEFANNY MISHEL HERNANDEZ BUENAÑO
**Responsable de:**
-  Actividad 5: Desarrollo de la Aplicación Web Frontend  
   - Diseñar la interfaz general usando React (u otro framework)  
   - Implementar:  
      - Inicio de sesión simulado  
      - Panel del docente y estudiante
-  Documentar el uso de la aplicación web y capturas de pantalla

---

###  JUAN CARLOS YASIG MONTENEGRO
**Responsable de:**
-  Actividad 5 (parte):  
   - Panel del encargado: ver reporte de uso por semana/mes  
   - Conexión completa del frontend con los endpoints API
-  Actividad 6 y 7: Documentación final y entrega  
   - Redactar README.md completo (introducción, objetivos, pasos de ejecución)  
   - Organizar carpeta del repositorio (`backend/`, `frontend/`, `screenshots/`, etc.)