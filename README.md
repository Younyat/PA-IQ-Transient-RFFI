# RF Fingerprint Platform

Plataforma para captura de senales RF, gestion de datasets, entrenamiento remoto, reentrenamiento continuo, validacion e inferencia desde una interfaz web.

## Que permite hacer

- Capturar nuevas muestras RF para entrenamiento, validacion o prediccion.
- Organizar y consultar datasets desde la interfaz.
- Lanzar entrenamiento remoto de modelos.
- Ejecutar reentrenamiento continuo con seguimiento del proceso.
- Validar el rendimiento del modelo con datos separados.
- Realizar inferencia y prediccion sobre nuevas capturas.

## Enfoque de IA utilizado

El sistema utiliza un modelo supervisado de huella RF implementado en PyTorch para clasificacion de emisores a partir de muestras IQ complejas.

Caracteristicas principales del enfoque:

- La senal IQ se segmenta en ventanas temporales de longitud fija.
- Cada ventana se normaliza en media y potencia antes del entrenamiento.
- La entrada del modelo se representa en dos canales: componente en fase (`I`) y componente en cuadratura (`Q`).
- El extractor de caracteristicas es una red neuronal convolucional 1D sobre secuencias IQ.
- La red genera un embedding normalizado por ventana y, a partir de ese embedding, una capa final realiza clasificacion multiclase por emisor.
- Durante el entrenamiento se combina perdida de clasificacion con un termino de compactacion intra-clase para mejorar separabilidad entre emisores.

Desde el punto de vista metodologico, el proyecto no se limita a una clasificacion cerrada tradicional. Ademas construye perfiles de enrolamiento por emisor a partir de centroides en el espacio de embeddings y define umbrales de aceptacion por dispositivo. Esto permite trabajar no solo en modo de clasificacion, sino tambien en modo de verificacion y analisis de pertenencia del emisor al modelo aprendido.

## Elementos de rigor cientifico

El proyecto incorpora decisiones de diseno orientadas a mantener trazabilidad experimental y evaluacion reproducible:

- Separacion explicita entre dataset de entrenamiento, validacion y prediccion.
- Validacion sobre conjunto independiente del entrenamiento.
- Particionado por sesiones, no solo por ventanas, para reducir fuga de informacion entre train y test.
- Control de consistencia fisica del dataset: el entrenamiento exige una unica frecuencia central y una unica tasa de muestreo por experimento.
- Requisito minimo de al menos dos emisores para entrenamiento supervisado.
- Aviso cuando un emisor tiene pocas sesiones, ya que eso debilita el rigor estadistico de la evaluacion.
- Fijacion de semilla para favorecer reproducibilidad experimental.
- Registro del historial de entrenamiento por epoca.
- Versionado y snapshot de modelos para preservar trazabilidad entre estados previos y posteriores al reentrenamiento.
- Persistencia del manifiesto del dataset usado en cada entrenamiento.
- Persistencia de la configuracion de entrenamiento y de los artefactos del modelo resultante.

## Metodologia de entrenamiento y evaluacion

El flujo metodologico del proyecto sigue una estructura util para un contexto tecnico o cientifico:

1. Adquisicion de capturas RF etiquetadas por emisor y sesion.
2. Construccion del dataset con metadatos fisicos y operativos.
3. Segmentacion de cada captura en ventanas IQ.
4. Entrenamiento supervisado del modelo sobre ventanas de entrenamiento.
5. Evaluacion interna sobre particion de test derivada por sesiones.
6. Construccion de perfiles de enrolamiento por emisor en el espacio de embeddings.
7. Validacion externa sobre un dataset independiente (`val`).
8. Inferencia o prediccion sobre capturas no usadas en entrenamiento.

## Metricas y criterios de evaluacion

El proyecto expone medidas que una persona con perfil profesional o cientifico puede interpretar con sentido metodologico:

- `train_acc` y `test_acc` por epoca para observar aprendizaje y posible sobreajuste.
- `train_loss` y `test_loss` para analizar convergencia.
- `window_level_closed_set_accuracy` para rendimiento por ventana.
- `record_level_closed_set_accuracy` para rendimiento por captura completa.
- Distancia entre embedding medio de la captura y el perfil real del emisor.
- Umbral de aceptacion por emisor derivado de la dispersion intra-clase.
- Distancia al perfil mas cercano y margen frente al segundo perfil mas cercano.
- Tasa de aceptacion y tasa de casos sospechosos en validacion.
- Historial de versiones y numero de reentrenamientos del modelo operativo.

## Valor metodologico del reentrenamiento

El reentrenamiento no se plantea como una simple sobreescritura del modelo. El sistema conserva snapshots anteriores y posteriores a cada actualizacion, lo que permite:

- mantener trazabilidad de la evolucion del modelo,
- comparar estados antes y despues de incorporar nuevos datos,
- documentar el dataset efectivo usado en cada iteracion,
- analizar si la actualizacion mejora o degrada el rendimiento.

Esto da al proyecto una base mas cercana a un flujo de experimentacion continua con control de versiones del modelo que a un pipeline opaco de entrenamiento.

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
