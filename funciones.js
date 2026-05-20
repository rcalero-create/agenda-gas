const HOJA = hoja = SpreadsheetApp.openById('1r55A61lVoehpus_gCA816qCOdsRo3k2_045fTbgeu4s').getActiveSheet();

function doGet() {
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

function doPost(datos) {

    insertarContacto(datos.parameter.nombre, datos.parameter.correo);
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');

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