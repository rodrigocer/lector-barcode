/**
 * Apps Script Web App - recibe JSON con acciones:
 * - action: 'initial' -> crea carpeta y guarda foto inicial
 * - action: 'create_folder' -> crea carpeta con nombre del código y guarda foto
 * - action: 'upload_photo' -> guarda foto en la carpeta del código con etiqueta
 *
 * Configurar: PARENT_FOLDER_ID por defecto si no se envía en payload
 */

const PARENT_FOLDER_ID = "1lhyyCwOxzA9Mr6jUFScDTsOrXBLM7RRp"; // carpeta proporcionada

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput("Invalid JSON").setMimeType(ContentService.MimeType.TEXT);
  }

  var action = payload.action || 'upload_photo';
  var code = payload.code || payload.codigo || 'UNKNOWN';
  var parentId = payload.parentFolderId || PARENT_FOLDER_ID;

  // normalize code
  code = String(code).toUpperCase().replace(/[^0-9A-Z]/g, "");

  // ensure folder exists
  var parent = DriveApp.getFolderById(parentId);
  var folder = getOrCreateFolder(parent, code);

  if (action === 'create_folder' || action === 'initial') {
    if (payload.photo) {
      savePhotoDataUrl(folder, payload.photo, code + '_initial.png');
    }
    return ContentService.createTextOutput("folder_created:" + folder.getId());
  } else if (action === 'upload_photo') {
    var tag = payload.tag || 'photo';
    var name = code + "_" + tag + "_" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMddHHmmss") + ".png";
    if (payload.photo) {
      savePhotoDataUrl(folder, payload.photo, name);
      return ContentService.createTextOutput("uploaded:" + name);
    } else {
      return ContentService.createTextOutput("no_photo");
    }
  }

  return ContentService.createTextOutput("ok");
}

function getOrCreateFolder(parent, name) {
  var folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function savePhotoDataUrl(folder, dataUrl, filename) {
  try {
    var matches = dataUrl.match(/^data:(image\/(\w+));base64,(.*)$/);
    if (!matches) {
      var res = UrlFetchApp.fetch(dataUrl);
      folder.createFile(res.getBlob()).setName(filename);
      return;
    }
    var mime = matches[1];
    var b64 = matches[3];
    var blob = Utilities.newBlob(Utilities.base64Decode(b64), mime, filename);
    folder.createFile(blob);
  } catch (e) {
    Logger.log("savePhotoDataUrl error: " + e);
  }
}
