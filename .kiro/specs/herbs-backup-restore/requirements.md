# Requirements Document

## Introduction

La funcionalidad de Backup/Restore permite a los administradores de **Living Roots** exportar la base de datos de plantas medicinales a un archivo Excel (.xlsx) y restaurarla desde ese mismo archivo. El flujo cubre dos operaciones complementarias: exportación (backup) y restauración (restore). La exportación genera un archivo con tres pestañas — Plantas Medicinales, Síntomas, Tratamientos (Relación) — que puede descargarse desde el frontend. La restauración acepta ese archivo de vuelta, valida su estructura y reemplaza los datos existentes dentro de una transacción ACID.

El backend ya cuenta con el endpoint `POST /herbs/restore` implementado. Falta el endpoint `GET /herbs/backup` (exportación) en el backend, y la interfaz completa de backup/restore en el frontend. Ambos endpoints deben protegerse con el guard de autenticación JWT del proyecto.

---

## Glossary

- **BackupRestoreController**: Controlador NestJS en la ruta `/herbs` que gestiona los endpoints de backup y restore.
- **BackupRestoreService**: Servicio NestJS que contiene la lógica de exportación e importación de datos hacia/desde Excel.
- **BackupRestorePanel**: Componente React integrado como sección dentro de `PlantManagement` en el Dashboard, que expone las acciones de exportar e importar backup al usuario administrador.
- **BackupService**: Capa de servicio en el frontend (hook + función de API) que comunica el `BackupRestorePanel` con los endpoints del backend.
- **Workbook**: Archivo Excel (.xlsx) generado por la librería `xlsx`, compuesto por las hojas `Plantas Medicinales`, `Síntomas` y `Tratamientos (Relación)`.
- **Admin**: Usuario con rol `admin` que tiene acceso a las operaciones de backup y restore.
- **Transaction**: Operación de base de datos ACID ejecutada con `prisma.$transaction` que garantiza atomicidad en la restauración.
- **Dashboard**: Página del frontend accesible únicamente por el `Admin`, donde se ubica el componente `PlantManagement` y dentro de él el `BackupRestorePanel`.
- **JWTGuard**: Mecanismo de autenticación JWT del proyecto (el mismo guard usado por los demás controladores) que protege los endpoints de backup y restore.
- **PlantManagement**: Componente existente del Dashboard donde se integra el `BackupRestorePanel` como nueva sección.
- **apiClient**: Módulo `lib/api-client.ts` del frontend que centraliza las llamadas HTTP al backend.

---

## Requirements

### Requirement 1: Exportar backup de la base de datos (Backend)

**User Story:** Como Admin, quiero exportar todos los datos de plantas medicinales a un archivo Excel, para tener una copia de seguridad que pueda restaurar en el futuro.

#### Acceptance Criteria

1. WHEN el `Admin` realiza una solicitud `GET /herbs/backup`, THE `BackupRestoreController` SHALL responder con un archivo `.xlsx` como descarga (Content-Disposition: attachment).
2. THE `BackupRestoreService` SHALL generar un `Workbook` con exactamente tres hojas nombradas `Plantas Medicinales`, `Síntomas` y `Tratamientos (Relación)`.
3. THE `BackupRestoreService` SHALL incluir en la hoja `Plantas Medicinales` las columnas: `ID Planta`, `Nombre`, `Descripción`, `URL Imagen`, `Cultivador`, `Info Importante`.
4. THE `BackupRestoreService` SHALL incluir en la hoja `Síntomas` las columnas: `ID Síntoma`, `Nombre Síntoma`, `Descripción Síntoma`.
5. THE `BackupRestoreService` SHALL incluir en la hoja `Tratamientos (Relación)` las columnas: `ID Planta`, `ID Síntoma`, `Partes Utilizadas`, `Preparación`, `Aplicación`.
6. WHEN un campo opcional de una planta (`Cultivador` o `Info Importante`) no tiene valor, THE `BackupRestoreService` SHALL escribir el literal `N/A` en la celda correspondiente.
7. WHEN un campo opcional de un síntoma (`Descripción Síntoma`) no tiene valor, THE `BackupRestoreService` SHALL escribir el literal `Sin descripción` en la celda correspondiente.
8. WHEN un campo opcional de un tratamiento (`Aplicación`) no tiene valor, THE `BackupRestoreService` SHALL escribir el literal `N/A` en la celda correspondiente.
9. IF una solicitud `GET /herbs/backup` es realizada por un usuario sin rol `admin`, THEN THE `BackupRestoreController` SHALL responder con código HTTP 401 o 403.
10. THE `BackupRestoreController` SHALL proteger el endpoint `GET /herbs/backup` con el `JWTGuard` del proyecto, de la misma forma que los demás controladores autenticados.
11. IF la base de datos no contiene ningún registro en ninguna de las tres entidades (plantas, síntomas, tratamientos), THEN THE `BackupRestoreController` SHALL responder con código HTTP 400 y el mensaje "No hay datos para exportar. La base de datos está vacía."

---

### Requirement 2: Restaurar base de datos desde un backup (Backend)

**User Story:** Como Admin, quiero restaurar la base de datos de plantas medicinales desde un archivo Excel, para recuperar el estado de los datos desde una copia de seguridad.

#### Acceptance Criteria

1. WHEN el `Admin` realiza una solicitud `POST /herbs/restore` con un archivo `.xlsx` válido, THE `BackupRestoreController` SHALL responder con código HTTP 200 y un objeto con `message` y `stats` (plantas, síntomas y relaciones restauradas).
2. THE `BackupRestoreService` SHALL ejecutar la restauración dentro de una `Transaction` única que garantiza atomicidad.
3. WHEN la `Transaction` se ejecuta, THE `BackupRestoreService` SHALL vaciar las tablas `tbl_treatment`, `tbl_favorite`, `tbl_symptom` y `tbl_herb` antes de insertar los nuevos datos, eliminando también los favoritos de todos los usuarios.
4. WHEN el archivo `.xlsx` contiene datos válidos, THE `BackupRestoreService` SHALL insertar las plantas, síntomas y tratamientos en ese orden jerárquico para respetar las llaves foráneas.
5. IF el archivo `.xlsx` no contiene las tres hojas requeridas (`Plantas Medicinales`, `Síntomas`, `Tratamientos (Relación)`), THEN THE `BackupRestoreService` SHALL lanzar una excepción `BadRequestException` con un mensaje descriptivo.
6. IF el archivo `.xlsx` contiene las tres hojas requeridas pero todas están vacías (sin filas de datos), THEN THE `BackupRestoreService` SHALL lanzar una excepción `BadRequestException` con el mensaje "El archivo de backup está vacío."
7. IF ocurre un error durante la `Transaction`, THEN THE `BackupRestoreService` SHALL realizar un rollback automático y lanzar una `InternalServerErrorException` con el motivo del fallo.
8. IF el archivo enviado supera 5 MB, THEN THE `BackupRestoreController` SHALL rechazar la solicitud con código HTTP 400.
9. IF el archivo enviado no es de tipo `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, THEN THE `BackupRestoreController` SHALL rechazar la solicitud con código HTTP 400.
10. IF una solicitud `POST /herbs/restore` es realizada por un usuario sin rol `admin`, THEN THE `BackupRestoreController` SHALL responder con código HTTP 401 o 403.
11. THE `BackupRestoreController` SHALL proteger el endpoint `POST /herbs/restore` con el `JWTGuard` del proyecto, de la misma forma que los demás controladores autenticados.
12. FOR ALL archivos `.xlsx` generados por el endpoint `GET /herbs/backup`, THE `BackupRestoreService` SHALL restaurar los datos de forma que el contenido sea equivalente al estado original (propiedad de round-trip: backup → restore → datos equivalentes).

---

### Requirement 3: Interfaz de exportación de backup (Frontend)

**User Story:** Como Admin, quiero un botón para descargar el backup de la base de datos desde el Dashboard, para poder generar copias de seguridad con facilidad.

#### Acceptance Criteria

1. WHILE el usuario tiene rol `admin` y está en el `Dashboard`, THE `BackupRestorePanel` SHALL mostrarse como una sección dentro del componente `PlantManagement` con un botón con la etiqueta "Exportar Backup".
2. WHEN el `Admin` hace clic en "Exportar Backup", THE `BackupService` SHALL realizar una solicitud autenticada a `GET /herbs/backup` usando el método `getBlob(url, token)` del `apiClient` con el token de sesión obtenido mediante `getSession()` de next-auth.
3. WHEN `GET /herbs/backup` responde con el archivo `.xlsx`, THE `BackupRestorePanel` SHALL descargar el archivo en el navegador del usuario con el nombre `living-roots-backup-YYYY-MM-DD.xlsx`, donde la fecha corresponde al día en que se genera el backup.
4. WHILE la solicitud de exportación está en progreso, THE `BackupRestorePanel` SHALL deshabilitar el botón "Exportar Backup" y mostrar un indicador visual de carga.
5. IF `GET /herbs/backup` responde con un error, THEN THE `BackupRestorePanel` SHALL mostrar un mensaje de error descriptivo al usuario.
6. THE `apiClient` SHALL exponer un método `getBlob(url: string, token: string): Promise<Blob>` que realiza una solicitud `GET` autenticada y retorna la respuesta como `Blob` usando `response.blob()` en lugar de `response.json()`.

---

### Requirement 4: Interfaz de restauración desde backup (Frontend)

**User Story:** Como Admin, quiero poder cargar un archivo Excel para restaurar la base de datos de plantas medicinales desde el Dashboard, para recuperar el estado de los datos cuando sea necesario.

#### Acceptance Criteria

1. WHILE el usuario tiene rol `admin` y está en el `Dashboard`, THE `BackupRestorePanel` SHALL mostrar un área de carga de archivos para seleccionar el archivo de backup dentro del componente `PlantManagement`.
2. WHEN el `Admin` selecciona un archivo para restaurar, THE `BackupRestorePanel` SHALL validar que el archivo tenga extensión `.xlsx` antes de enviarlo al backend.
3. IF el archivo seleccionado no tiene extensión `.xlsx`, THEN THE `BackupRestorePanel` SHALL mostrar un mensaje de error indicando que solo se aceptan archivos `.xlsx` sin realizar la solicitud al backend.
4. WHEN el `Admin` confirma la restauración con un archivo `.xlsx` válido, THE `BackupRestorePanel` SHALL mostrar un diálogo de confirmación que advierta explícitamente: "Esta operación reemplazará todos los datos actuales, incluyendo los favoritos de los usuarios."
5. WHEN el `Admin` confirma la acción en el diálogo, THE `BackupService` SHALL realizar una solicitud autenticada a `POST /herbs/restore` con el archivo como `FormData`.
6. WHILE la solicitud de restauración está en progreso, THE `BackupRestorePanel` SHALL deshabilitar los controles de importación y mostrar un indicador visual de carga.
7. WHEN `POST /herbs/restore` responde con éxito, THE `BackupRestorePanel` SHALL mostrar un mensaje de confirmación con las estadísticas de restauración (plantas, síntomas y relaciones restauradas) e invalidar el caché de React Query para todas las entidades afectadas: plantas (`/herbs`), síntomas, y cualquier entidad relacionada.
8. IF `POST /herbs/restore` responde con un error, THEN THE `BackupRestorePanel` SHALL mostrar el mensaje de error recibido del backend al usuario.
9. IF el backend responde con el mensaje "El archivo de backup está vacío.", THEN THE `BackupRestorePanel` SHALL mostrar ese mensaje al usuario sin realizar ninguna acción adicional.

---

### Requirement 5: Control de acceso al panel de backup/restore

**User Story:** Como sistema, quiero que las operaciones de backup y restore solo sean accesibles para el rol `admin`, para proteger la integridad de los datos.

#### Acceptance Criteria

1. THE `BackupRestorePanel` SHALL renderizarse únicamente dentro del componente `PlantManagement`, que es accesible solo para el rol `admin` en el `Dashboard`.
2. WHEN un usuario con rol distinto a `admin` accede directamente a los endpoints `GET /herbs/backup` o `POST /herbs/restore`, THE `BackupRestoreController` SHALL responder con código HTTP 401 o 403 gracias al `JWTGuard`.
3. THE `BackupService` SHALL incluir el token de autenticación JWT en el encabezado `Authorization` de cada solicitud a los endpoints de backup y restore.
4. IF una solicitud a `GET /herbs/backup` o `POST /herbs/restore` no incluye un token JWT válido, THEN THE `BackupRestoreController` SHALL rechazar la solicitud con código HTTP 401 antes de ejecutar cualquier lógica de negocio.

---

### Requirement 6: Pruebas del backend (Backend Tests)

**User Story:** Como desarrollador, quiero una suite de pruebas para el módulo de backup/restore, para garantizar la correctitud de la exportación, la restauración y las guardas de acceso.

#### Acceptance Criteria

1. THE `BackupRestoreService` test suite SHALL incluir una prueba unitaria que verifique que `exportDatabase()` genera un `Workbook` con exactamente tres hojas nombradas `Plantas Medicinales`, `Síntomas` y `Tratamientos (Relación)` con las columnas correctas definidas en los Requisitos 1.3, 1.4 y 1.5.
2. THE `BackupRestoreService` test suite SHALL incluir una prueba unitaria que verifique que `restoreDatabase()` ejecuta la `Transaction`, vacía las tablas y retorna un objeto `stats` con los conteos correctos de plantas, síntomas y relaciones restauradas.
3. FOR ALL `Workbook` generados por `exportDatabase()` a partir de un estado de base de datos no vacío, THE `BackupRestoreService` SHALL restaurar los datos de forma que el estado resultante sea equivalente al estado original (propiedad de round-trip: backup → restore → datos equivalentes). Esta prueba de propiedad se implementa con Jest y datos generados programáticamente.
4. WHEN una solicitud llega a `GET /herbs/backup` o `POST /herbs/restore` sin un token JWT válido, THE `BackupRestoreController` test suite SHALL verificar que el endpoint responde con código HTTP 401 o 403 sin ejecutar ninguna lógica del servicio.
5. THE test suite SHALL ejecutarse con Jest y estar ubicada junto al módulo (`herbs-backup-restore.service.spec.ts`, `herbs-backup-restore.controller.spec.ts`).
