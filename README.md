# Lector Barcode + Drive Uploader (PWA)

Contenido:
- `index.html` — interfaz web que escanea códigos, permite OCR en una zona ajustable, captura fotos y las envía a un Web App de Google Apps Script.
- `Code.gs` — script para pegar en Google Apps Script (proyecto asociado a tu cuenta) que crea carpetas en Google Drive y guarda fotos.
- `logo.png` — logotipo de la empresa.

## Instrucciones rápidas

1. **Configurar Apps Script (Web App)**
   - En Google Drive → Nuevo → Más → Google Apps Script.
   - Crea un archivo `Code.gs` y pega el contenido de `Code.gs` de este paquete.
   - Ajusta `PARENT_FOLDER_ID` si quieres otro folder por defecto.
   - Deploy → New deployment → Tipo: "Web app". Ejecutar como: "Tú". Acceso: "Anyone". Copia la URL del Web App.

2. **Configurar `index.html`**
   - Edita `index.html` y reemplaza `WEBAPP_URL` por la URL del Web App.
   - Opcionalmente cambia `DRIVE_PARENT_ID` (ID de la carpeta donde crear subcarpetas).

3. **Subir a GitHub Pages o servidor**
   - Sube `index.html` y `logo.png` a tu repo o servidor. Abre la página en el móvil y concede permisos de cámara.

4. **Flujo de uso**
   - Apunta la cámara al área del código (usa el cuadro ajustable para enfocar la parte de los números impresos).
   - El sistema realizará lecturas (necesita confirmaciones iguales para aceptar).
   - Puedes usar OCR en la zona para priorizar el texto impreso encima del código.
   - Al confirmar, crea una carpeta con el nombre del código dentro de la carpeta padre y guarda la foto inicial.
   - Luego puedes tomar fotos adicionales y etiquetarlas (Dispositivo, Arnés, etc.) — se guardarán en la misma carpeta.

## Notas técnicas
- OCR usa Tesseract.js (varía en exactitud según iluminación y idioma).
- El script de Apps Script guarda imágenes en Drive desde dataURLs enviados desde el cliente.
- Asegúrate de desplegar el Web App con permisos adecuados.
