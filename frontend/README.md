# Frontend

Interfaz web de RF Fingerprint Platform para operar el flujo completo de captura, entrenamiento, validacion e inferencia.

## Arranque

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

## URL local

- `http://localhost:5173`

## Que ofrece la interfaz

- Panel visual para operar cada fase del flujo.
- Captura de muestras para entrenamiento, validacion o prediccion.
- Consulta del dataset disponible.
- Lanzamiento y seguimiento de entrenamiento y reentrenamiento.
- Validacion del modelo.
- Inferencia y prediccion sobre nuevas capturas.
- Consulta del estado del modelo activo.

## Secciones principales

- `Dashboard`
- `Capture`
- `Dataset`
- `Training`
- `Retraining`
- `Validation`
- `Inference`
- `Models`

## Nota de uso

La interfaz requiere que el backend este levantado para poder consultar datos y ejecutar operaciones.

## Incidencias comunes

### `npm.ps1` bloqueado por politica de PowerShell

Usa siempre:

```powershell
npm.cmd install
npm.cmd run dev
```

### Error de Vite o esbuild

```powershell
cd frontend
npm.cmd rebuild esbuild
npm.cmd run dev
```
