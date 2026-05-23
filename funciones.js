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

function importarContactos() {
  let url = 'https://randomuser.me/api/?results=5&inc=name,email,phone,picture';
  let respuesta = UrlFetchApp.fetch(url).getContentText();
  let datos = JSON.parse(respuesta);
  
  // CORREGIDO: Pasamos el contacto de forma explícita en el bucle
  datos.results.forEach(contacto => insertarContactoJSON(contacto));
}

function insertarContactoJSON(contacto) {
  // Añadimos seguridad con (?.) por si la API falla en algún campo
  HOJA.appendRow([
    contacto?.name?.first,
    contacto?.name?.last,
    contacto?.email,
    contacto?.phone,
    contacto?.picture?.large
  ]);
}