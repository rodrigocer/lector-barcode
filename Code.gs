const PARENT_FOLDER_ID = "1lhyyCwOxzA9Mr6jUFScDTsOrXBLM7RRp";
const SECRET_TOKEN = "MiTokenUltraSeguro123";

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ok:false,message:"Este endpoint solo acepta POST con JSON"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ ok:false, error:"no_postdata" });
    }
    var payload = JSON.parse(e.postData.contents);
    if (payload.token !== SECRET_TOKEN) {
      return jsonOutput({ ok:false, error:"unauthorized" });
    }
    var code = String(payload.code || "").toUpperCase().replace(/[^0-9A-Z]/g, "");
    if (!code) return jsonOutput({ ok:false, error:"no_code" });
    var parent = DriveApp.getFolderById(PARENT_FOLDER_ID);
    var folder = getOrCreateFolder(parent, code);
    if (payload.action === "create_folder") {
      if (payload.photo) savePhotoDataUrl(folder, payload.photo, "etiqueta.jpg");
      return jsonOutput({ ok:true, status:"folder_created", folderId: folder.getId() });
    }
    if (payload.action === "upload_photo") {
      var filename = payload.filename || getNextSequentialName(folder);
      if (payload.photo) savePhotoDataUrl(folder, payload.photo, filename);
      return jsonOutput({ ok:true, status:"uploaded", filename: filename });
    }
    return jsonOutput({ ok:true, status:"noop" });
  } catch (err) {
    return jsonOutput({ ok:false, error:"exception", detail: err.toString() });
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateFolder(parent, name) {
  var folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function savePhotoDataUrl(folder, dataUrl, filename) {
  var matches = dataUrl.match(/^data:(image\/[^;]+);base64,(.*)$/);
  if (matches) {
    var blob = Utilities.newBlob(Utilities.base64Decode(matches[2]), matches[1], filename);
    folder.createFile(blob);
    return;
  }
  var res = UrlFetchApp.fetch(dataUrl);
  folder.createFile(res.getBlob()).setName(filename);
}

function getNextSequentialName(folder) {
  var files = folder.getFiles();
  var max = 0;
  while (files.hasNext()) {
    var m = files.next().getName().match(/^(\d+)\.jpg$/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return (max + 1) + ".jpg";
}
