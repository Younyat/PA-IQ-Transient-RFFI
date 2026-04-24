# Backend

Servicio API de RF Fingerprint Platform. Expone las operaciones necesarias para captura, gestion de datasets, entrenamiento, reentrenamiento, validacion e inferencia.

## Arranque recomendado

Desde la raiz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File .\start_backend.ps1 -SkipSshSetup
```

Si necesitas habilitar la conexion para entrenamiento remoto:

```powershell
powershell -ExecutionPolicy Bypass -File .\start_backend.ps1 -RemoteUser "<usuario-remoto>" -RemoteHost "<host-remoto>"
```

## URL local

- API base: `http://127.0.0.1:8000`
- Documentacion interactiva: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

## Capacidades del servicio

- Gestion de capturas RF.
- Consulta y administracion de datasets.
- Lanzamiento de entrenamiento remoto.
- Reentrenamiento del modelo con nuevas muestras.
- Validacion del rendimiento del modelo.
- Inferencia y prediccion sobre capturas nuevas.
- Exposicion de estado y resultados para la interfaz web.

## Requisitos

- Python compatible con las dependencias del proyecto
- Dependencias instaladas desde `requirements.txt`
- Acceso SSH al entorno remoto si se usa entrenamiento remoto

## Alternativa manual

Si prefieres arrancarlo sin el script:

```powershell
cd backend
python -m pip install -r ..\requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
