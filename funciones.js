const HOJA = SpreadsheetApp.openById('1r55A61lVoehpus_gCA816qCOdsRo3k2_045fTbgeu4s').getActiveSheet();

function doGet() {
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

function doPost(e) {
    
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

function obtenerDatosHtml(nombre) {
    return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

function obtenerContactos() {
  
    return HOJA.getDataRange().getDisplayValues();
  
}

function insertarContacto(nombre, apellidos, correo, telefono) {
  HOJA.appendRow([nombre, apellidos, correo, telefono]);
}


function borrarContacto(filaIndex) {
  HOJA.deleteRow(filaIndex);
}

function modificarContacto(numFila, datos) {

  let celdas = HOJA.getRange('A' + numFila + ':D' + numFila);
  celdas.setValues([[datos.nombre, datos.apellidos, datos.correo, datos.telefono]]);
}