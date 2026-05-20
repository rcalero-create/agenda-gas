const HOJA = hoja = SpreadsheetApp.openById('1r55A61lVoehpus_gCA816qCOdsRo3k2_045fTbgeu4s').getActiveSheet();

function doGet() {
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

function doPost(e) {
  try {
    // 1. Llegim els paràmetres usant la "e" oficial de Google
    const nombre = e.parameter.nombre;
    const correo = e.parameter.correo;
    
    // 2. Insertem la fila al Google Sheets
    insertarContacto(nombre, correo);
    
    // 3. RESPONDRE EN JSON (Això és el que obre la tanca de seguretat de l'institut)
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Contacte guardat!" }))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    // Si el Sheets està bloquejat o hi ha un error, responem el motiu en JSON per veure'l a la consola
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}


function obtenerDatosHtml(nombre) {

    return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

function obtenerContactos() {

    

    return HOJA.getDataRange().getDisplayValues();

    // 4. Fem un Logger per veure des de la web de Google si realment llegeix alguna cosa
  Logger.log("Dades llegides del Sheets: " + datos.length + " files trobades.");

}

function insertarContacto(nombre, correo) {
  HOJA.appendRow([nombre, correo]);
} 