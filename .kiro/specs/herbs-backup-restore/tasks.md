# Implementation Plan: herbs-backup-restore

## Overview

Implementación del módulo de Backup/Restore para Living Roots. El backend se implementa primero (NestJS) porque el frontend depende de que existan los endpoints. Cada tarea es independiente y ejecutable de forma autónoma, referenciando los archivos exactos a crear/modificar.

---

## Tasks

- [ ] 1. Añadir `exportDatabase()` al servicio backend
  - [x] 1.1 Implementar el método `exportDatabase()` en `herbs-backup-restore.service.ts`
    - Añadir el método `async exportDatabase(): Promise<Buffer>` a la clase `BackupRestoreService`
    - Consultar las tres entidades en paralelo:
      ```typescript
      const [herbs, symptoms, treatments] = await Promise.all([
        this.prisma.herb.findMany(),
        this.prisma.symptom.findMany(),
        this.prisma.herbSymptom.findMany(),
      ])
      ```
    - Si los tres arrays están vacíos, lanzar `BadRequestException("No hay datos para exportar. La base de datos está vacía.")`
    - Mapear plantas con: `cultivator: null → "N/A"`, `important: null → "N/A"`, `description: null → "Sin descripción"` (si aplica), incluyendo columnas `ID Planta`, `Nombre`, `Descripción`, `URL Imagen`, `Cultivador`, `Info Importante`
    - Mapear síntomas con: `description: null → "Sin descripción"`, columnas `ID Síntoma`, `Nombre Síntoma`, `Descripción Síntoma`
    - Mapear tratamientos con: `apply: null → "N/A"`, columnas `ID Planta`, `ID Síntoma`, `Partes Utilizadas`, `Preparación`, `Aplicación`
    - Construir workbook con `XLSX.utils.json_to_sheet` + `XLSX.utils.book_new()` + `XLSX.utils.book_append_sheet` para las tres hojas: `"Plantas Medicinales"`, `"Síntomas"`, `"Tratamientos (Relación)"`
    - Retornar `Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }))`
    - Los imports de `XLSX` e interfaces ya existen en el archivo; no duplicarlos
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.11_

- [x] 2. Proteger endpoints y añadir `GET /herbs/backup` en el controlador
  - [x] 2.1 Modificar `herbs-backup-restore.controller.ts` para añadir guards y el endpoint de exportación
    - Añadir imports necesarios al inicio del archivo:
      - `AuthGuard` desde su ruta relativa en el proyecto (misma que usa `HerbsController`)
      - `RolesGuard` desde su ruta relativa
      - `Role` enum y `Roles` decorator desde sus rutas relativas
      - `Get`, `Res` desde `@nestjs/common`
      - `Response` desde `express`
    - Aplicar decoradores a nivel de clase sobre `@Controller('herbs')`:
      ```typescript
      @UseGuards(AuthGuard, RolesGuard)
      @Roles(Role.Admin)
      ```
    - Añadir el método `exportBackup` con los decoradores `@Get('backup')` y `@HttpCode(HttpStatus.OK)`:
      ```typescript
      @Get('backup')
      async exportBackup(@Res() res: Response) {
        const buffer = await this.backupRestoreService.exportDatabase()
        res.set({
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=living-roots-backup.xlsx',
        })
        res.send(buffer)
      }
      ```
    - El método `restoreDatabase` existente no cambia su lógica; queda protegido automáticamente por los guards de clase
    - _Requisitos: 1.1, 1.9, 1.10, 2.10, 2.11, 5.2, 5.4_

- [x] 3. Actualizar `HerbsBackupRestoreModule` con los providers de guards
  - [ ] 3.1 Modificar `herbs-backup-restore.module.ts` para añadir `AuthGuard`, `RolesGuard` y `Reflector` a providers
    - Añadir imports de `AuthGuard` y `RolesGuard` desde sus rutas relativas en el proyecto
    - Añadir import de `Reflector` desde `@nestjs/core`
    - Añadir los tres al array `providers`:
      ```typescript
      providers: [BackupRestoreService, PrismaService, AuthGuard, RolesGuard, Reflector]
      ```
    - No importar `JwtModule` (ya está registrado con `global: true` en `AuthModule`)
    - _Requisitos: 1.10, 2.11, 5.2, 5.4_

- [x] 4. Crear suite de pruebas unitarias y de propiedad para el servicio
  - [x] 4.1 Crear `herbs-backup-restore.service.spec.ts` con las 7 pruebas unitarias
    - Instalar `fast-check` como devDependency si no existe: `npm install --save-dev fast-check`
    - Configurar el módulo de testing NestJS con mocks de `PrismaService`
    - **Prueba 1 — estructura del workbook:** mock de los tres `findMany` con datos fijos; verificar que el buffer es instancia de `Buffer`, que el workbook contiene exactamente 3 hojas, y que los nombres son `"Plantas Medicinales"`, `"Síntomas"` y `"Tratamientos (Relación)"`
    - **Prueba 2 — columnas correctas:** verificar que los encabezados de cada hoja coinciden exactamente con Req 1.3, 1.4, 1.5
    - **Prueba 3 — BD vacía lanza error:** mock de los tres `findMany` retornando `[]`; verificar que lanza `BadRequestException` con el mensaje `"No hay datos para exportar. La base de datos está vacía."`
    - **Prueba 4 — codificación de nulls:** planta con `cultivator: null` e `important: null`; síntoma con `description: null`; tratamiento con `apply: null`; verificar que las celdas contienen `"N/A"` y `"Sin descripción"` respectivamente
    - **Prueba 5 — flujo exitoso de restore:** mock de `prisma.$transaction` que ejecuta el callback; mocks de `$executeRaw`, `herb.createMany`, `symptom.createMany`, `herbSymptom.createMany`; verificar que retorna `{ message, stats }` con los conteos correctos
    - **Prueba 6 — hojas faltantes:** generar workbook sin la hoja `"Síntomas"` y pasar el buffer a `restoreDatabase`; verificar que lanza `BadRequestException` con mensaje descriptivo de estructura inválida
    - **Prueba 7 — error en transacción:** mock de `prisma.$transaction` que lanza `Error("DB error")`; verificar que lanza `InternalServerErrorException` con el motivo en el mensaje
    - _Requisitos: 6.1, 6.2, 6.4, 6.5_

  - [ ]* 4.2 Añadir prueba de propiedad round-trip a `herbs-backup-restore.service.spec.ts`
    - **Propiedad 4: Round-trip backup → restore equivale al estado original**
    - **Valida: Requisitos 2.12, 6.3**
    - Añadir `fc.configureGlobal({ numRuns: 100 })` al inicio del describe block o en `beforeAll`
    - Definir los arbitraries:
      ```typescript
      const herbArbitrary = fc.record({
        herb_id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        description: fc.string(),
        img: fc.webUrl(),
        cultivator: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { freq: 3 }), // ~30% null
        important: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { freq: 3 }),
      })
      const symptomArbitrary = fc.record({
        symptom_id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        description: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { freq: 3 }),
      })
      // treatmentArbitrary referencia herb_id y symptom_id de los arrays generados
      ```
    - Flujo de la prueba: (1) mock `prisma.herb.findMany`, `symptom.findMany`, `herbSymptom.findMany` con los datos generados; (2) llamar `exportDatabase()` → obtener buffer; (3) llamar `restoreDatabase(buffer)` con mock de `$transaction` que ejecuta el callback; (4) capturar los argumentos de `herb.createMany`, `symptom.createMany`, `herbSymptom.createMany`; (5) verificar que los datos restaurados son equivalentes a los originales (mismos IDs, nombres, y que `null` fue preservado correctamente tras el ciclo de codificación/decodificación)

- [x] 5. Crear suite de pruebas de guards para el controlador
  - [x] 5.1 Crear `herbs-backup-restore.controller.spec.ts` con los 5 casos de guards
    - Configurar el módulo de testing con mocks de `BackupRestoreService`, `AuthGuard` y `RolesGuard`
    - **Caso 1 — GET sin token → 401:** sobreescribir `AuthGuard.canActivate` para lanzar `UnauthorizedException`; verificar que `GET /herbs/backup` retorna 401 y que `exportDatabase` nunca se llama
    - **Caso 2 — POST sin token → 401:** mismo patrón que el caso 1 para `POST /herbs/restore`
    - **Caso 3 — GET con rol no-admin → 403:** `AuthGuard` permite, `RolesGuard.canActivate` lanza `ForbiddenException`; verificar que `GET /herbs/backup` retorna 403
    - **Caso 4 — POST con rol no-admin → 403:** mismo patrón que el caso 3 para `POST /herbs/restore`
    - **Caso 5 — GET exitoso con admin → 200 + headers:** ambos guards permiten; mock de `exportDatabase()` retorna un `Buffer` mínimo válido; verificar status 200, que el header `Content-Disposition` contiene `attachment` y `.xlsx`, y que `Content-Type` es el MIME de XLSX
    - _Requisitos: 1.9, 1.10, 2.10, 2.11, 5.2, 5.4, 6.4, 6.5_

- [x] 6. Checkpoint — Backend completo
  - Asegurarse de que todos los tests de las tareas 4 y 5 pasan (`npm run test` en el directorio del backend).
  - Verificar que el servidor compila sin errores TypeScript.
  - Preguntar al usuario si hay dudas antes de continuar con el frontend.

- [x] 7. Añadir `getBlob()` y `postForm()` a `apiClient`
  - [x] 7.1 Modificar `lib/api-client.ts` para añadir los dos nuevos métodos
    - Añadir la función interna `apiRequestBlob` después de la función `apiRequest` existente:
      ```typescript
      async function apiRequestBlob(
        endpoint: string,
        token?: string,
      ): Promise<Blob> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        })
        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ message: 'Error desconocido' }))
          throw new Error(error.message || 'Error en la petición')
        }
        return response.blob()
      }
      ```
    - Añadir la función interna `apiRequestForm` para POST con `FormData` (sin `Content-Type`, sin `JSON.stringify`):
      ```typescript
      async function apiRequestForm<T>(
        endpoint: string,
        body: FormData,
        token?: string,
      ): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body,
        })
        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ message: 'Error desconocido' }))
          throw new Error(error.message || 'Error en la petición')
        }
        return response.json()
      }
      ```
    - Añadir `getBlob` y `postForm` al objeto `apiClient` exportado:
      ```typescript
      getBlob: (url: string, token?: string) => apiRequestBlob(url, token),
      postForm: <T>(url: string, body: FormData, token?: string) =>
        apiRequestForm<T>(url, body, token),
      ```
    - No modificar los métodos existentes (`get`, `post`, `patch`, `delete`)
    - _Requisitos: 3.2, 3.6, 4.5, 5.3_

- [x] 8. Crear `services/backup-service.ts`
  - [x] 8.1 Crear el archivo `services/backup-service.ts` con las interfaces y las dos funciones de servicio
    - Definir las interfaces al inicio del archivo:
      ```typescript
      export interface RestoreResult {
        message: string
        stats: {
          plantas_restauradas: number
          sintomas_restaurados: number
          relaciones_restauradas: number
        }
      }

      export interface ExportBackupResult {
        blob: Blob
        filename: string // formato: living-roots-backup-YYYY-MM-DD.xlsx
      }
      ```
    - Copiar el patrón de `getToken()` de `services/herbs-service.ts`:
      ```typescript
      async function getToken(): Promise<string | undefined> {
        const session = await getSession()
        if (!session?.accessToken) {
          throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
        }
        return session?.accessToken as string | undefined
      }
      ```
    - Implementar `exportBackup()`:
      - Llamar `getToken()` para obtener el token de sesión
      - Llamar `apiClient.getBlob('/herbs/backup', token)` para obtener el `Blob`
      - Generar el filename con `living-roots-backup-${new Date().toISOString().split('T')[0]}.xlsx`
      - Retornar `{ blob, filename }`
    - Implementar `restoreBackup(file: File)`:
      - Llamar `getToken()` para obtener el token de sesión
      - Crear `const formData = new FormData()` y añadir `formData.append('backup', file)`
      - Llamar `apiClient.postForm<RestoreResult>('/herbs/restore', formData, token)`
      - Retornar el resultado
    - Exportar como `export const backupService = { exportBackup, restoreBackup }`
    - Imports necesarios: `getSession` de `next-auth/react`, `apiClient` de `@/lib/api-client`
    - _Requisitos: 3.2, 3.3, 4.5, 5.3_

- [x] 9. Crear `hooks/mutations/useBackupMutations.ts`
  - [x] 9.1 Crear el hook con las dos mutations de export e import
    - Imports necesarios: `useMutation`, `useQueryClient` de `@tanstack/react-query`; `backupService` y `ExportBackupResult`, `RestoreResult` de `@/services/backup-service`; `QUERY_KEYS` de `@/constants/query-keys`
    - Implementar la mutation de exportación:
      ```typescript
      const exportBackup = useMutation({
        mutationFn: () => backupService.exportBackup(),
        onSuccess: ({ blob, filename }) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        },
      })
      ```
    - Implementar la mutation de restauración:
      ```typescript
      const restoreBackup = useMutation({
        mutationFn: (file: File) => backupService.restoreBackup(file),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.herbs.all })
          queryClient.invalidateQueries({ queryKey: ['symptoms'] })
        },
      })
      ```
    - Retornar `{ exportBackup, restoreBackup }`
    - Exportar como `export function useBackupMutations()`
    - _Requisitos: 3.2, 3.3, 4.5, 4.7_

- [x] 10. Crear `components/herbs/BackupRestorePanel.tsx`
  - [x] 10.1 Crear el componente UI con las secciones de exportación y restauración
    - Añadir `'use client'` al inicio del archivo
    - Imports necesarios: `useState` de `react`; `useBackupMutations` de `@/hooks/mutations/useBackupMutations`; `Button` de `@/components/ui/button`; `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogTrigger` de `@/components/ui/alert-dialog`; `RestoreResult` de `@/services/backup-service`
    - Estado local:
      ```typescript
      const [selectedFile, setSelectedFile] = useState<File | null>(null)
      const [fileError, setFileError] = useState<string | null>(null)
      const [restoreSuccess, setRestoreSuccess] = useState<RestoreResult | null>(null)
      ```
    - Usar `useBackupMutations()` para obtener `exportBackup` y `restoreBackup`
    - **Sección "Exportación de Backup":**
      - Título "Exportación de Backup" y descripción breve
      - Botón "Exportar Backup" que llama `exportBackup.mutate()`
      - Deshabilitar el botón mientras `exportBackup.isPending`
      - Mostrar spinner o texto "Exportando..." durante la carga
      - Si `exportBackup.isError`, mostrar el mensaje de error
    - **Sección "Restaurar desde Backup":**
      - Título "Restaurar desde Backup" y descripción breve
      - Input `type="file"` con `accept=".xlsx"` controlado por `onChange` que valida extensión
      - Validación de extensión en `handleFileChange`: si `!file.name.endsWith('.xlsx')`, setear `fileError` y `setSelectedFile(null)`; si es válido, setear `selectedFile` y limpiar `fileError`
      - Mostrar `fileError` debajo del input si existe
      - `AlertDialog` de shadcn/ui activado por botón "Restaurar" (deshabilitado si `!selectedFile || restoreBackup.isPending`):
        - `AlertDialogTitle`: "¿Confirmar restauración?"
        - `AlertDialogDescription`: "Esta operación reemplazará todos los datos actuales, incluyendo los favoritos de los usuarios."
        - `AlertDialogAction`: llama `restoreBackup.mutate(selectedFile!, { onSuccess: (data) => { setRestoreSuccess(data); setSelectedFile(null) } })`
        - `AlertDialogCancel`: cancela sin acción
      - Mostrar spinner o texto "Restaurando..." mientras `restoreBackup.isPending`
      - Si `restoreBackup.isError`, mostrar el mensaje de error
      - Si `restoreSuccess` tiene valor, mostrar bloque de éxito con las stats:
        - "Restauración exitosa"
        - `plantas_restauradas`: N plantas
        - `sintomas_restaurados`: N síntomas
        - `relaciones_restauradas`: N relaciones
    - _Requisitos: 3.1, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 4.8, 4.9, 5.1_

- [x] 11. Integrar `BackupRestorePanel` en `PlantManagement`
  - [x] 11.1 Modificar `components/herbs/PlantManagement.tsx` para añadir el panel al final del JSX
    - Añadir import al inicio del archivo:
      ```typescript
      import { BackupRestorePanel } from '@/components/herbs/BackupRestorePanel'
      ```
    - Añadir `<BackupRestorePanel />` como último hijo dentro del `<div className='space-y-6'>`, después del componente `<PlantTable .../>`:
      ```tsx
      <PlantTable ... />
      <BackupRestorePanel />
      ```
    - No modificar ningún otro código del componente
    - _Requisitos: 3.1, 4.1, 5.1_

- [x] 12. Checkpoint final — Verificación completa
  - Asegurarse de que todos los tests del backend pasan (`npm run test`).
  - Verificar que el frontend compila sin errores TypeScript (`npm run build` o `tsc --noEmit`).
  - Preguntar al usuario si hay dudas antes de cerrar la tarea.

---

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos que valida para trazabilidad completa
- Las tareas 1–5 son backend puro (NestJS); las tareas 7–11 son frontend puro (Next.js)
- Los checkpoints 6 y 12 garantizan validación incremental antes de continuar
- La prueba de propiedad (4.2) usa `fast-check` con 100 iteraciones para cubrir casos edge automáticamente
- La invalidación de caché tras restore cubre `QUERY_KEYS.herbs.all` y `['symptoms']` según Req 4.7

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["4.1", "5.1"] },
    { "id": 4, "tasks": ["4.2", "7.1"] },
    { "id": 5, "tasks": ["8.1"] },
    { "id": 6, "tasks": ["9.1"] },
    { "id": 7, "tasks": ["10.1"] },
    { "id": 8, "tasks": ["11.1"] }
  ]
}
```
