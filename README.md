# RF Fingerprint Platform

Plataforma para captura de senales RF, gestion de datasets, entrenamiento remoto, reentrenamiento continuo, validacion e inferencia desde una interfaz web.

## Que permite hacer

- Capturar nuevas muestras RF para entrenamiento, validacion o prediccion.
- Organizar y consultar datasets desde la interfaz.
- Lanzar entrenamiento remoto de modelos.
- Ejecutar reentrenamiento continuo con seguimiento del proceso.
- Validar el rendimiento del modelo con datos separados.
- Realizar inferencia y prediccion sobre nuevas capturas.

## Arranque rapido

### 1) Iniciar el backend

Desde la raiz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File .\start_backend.ps1 -SkipSshSetup
```

Si necesitas preparar la conexion SSH para entrenamiento remoto, usa:

```powershell
powershell -ExecutionPolicy Bypass -File .\start_backend.ps1 -RemoteUser "<usuario-remoto>" -RemoteHost "<host-remoto>"
```

### 2) Iniciar el frontend

En otra terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

## Acceso

- Frontend: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000`
- Documentacion interactiva del backend: `http://127.0.0.1:8000/docs`

## Flujo recomendado de uso

1. Captura datos en `train`, `val` o `predict`.
2. Revisa el dataset disponible.
3. Ejecuta un entrenamiento inicial remoto.
4. Usa reentrenamiento para incorporar nuevas muestras.
5. Valida el modelo antes de pasar a inferencia.
6. Lanza predicciones sobre nuevas capturas.

## Modulos principales

- `Capture`: adquisicion de nuevas muestras RF.
- `Dataset`: consulta y gestion de datos disponibles.
- `Training`: entrenamiento inicial del modelo.
- `Retraining`: actualizacion iterativa del modelo.
- `Validation`: evaluacion del rendimiento.
- `Inference`: clasificacion o verificacion sobre nuevas senales.
- `Models`: consulta del modelo activo y sus versiones.

## Requisitos generales

- Windows PowerShell
- Python disponible para el backend
- Node.js y npm para el frontend
- Acceso SSH al entorno remoto si vas a usar entrenamiento remoto

## Incidencias comunes

### PowerShell bloquea `npm`

Usa `npm.cmd` en lugar de `npm`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Vite o esbuild no arrancan correctamente

```powershell
cd frontend
npm.cmd rebuild esbuild
npm.cmd run dev
```
