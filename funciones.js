const HOJA = SpreadsheetApp.openById('1r55A61lVoehpus_gCA816qCOdsRo3k2_045fTbgeu4s').getActiveSheet();
const CARPETA_IMAGENES = DriveApp.getFolderById('1VGwqsL5PddZa4z9VDczzK0KTPrYJQHls');
const CABECERA_IMAGEN_URL='https://drive.google.com/uc?export=view&id=';

function doGet() {
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

function doPost(e) {
    
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

function obtenerDatosHtml(nombre) {
    return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

function obtenerDatos() {
  
    return HOJA.getDataRange().getDisplayValues();
  
}

function insertarContacto(contacto, imagen) {
  // 1. Validación radical de entrada
  if (!contacto) {
    throw new Error("El servidor recibió un objeto contacto nulo o inválido.");
  }

  let urlImagenFinal = '';

  // 2. Control estricto de la imagen
  // Solo entra si existe el objeto, NO es por defecto, y tiene datos de tipo de archivo reales
  if (imagen && !imagen.porDefecto && imagen.base64 && imagen.tipo && imagen.nombre) {
    try {
      // Limpiamos el prefijo Base64
      let cadenaLimpia = imagen.base64.split(',')[1];
      let bytes = Utilities.base64Decode(cadenaLimpia);
      
      // Aquí solo entrará si es una foto real adjuntada
      let blob = Utilities.newBlob(bytes, imagen.tipo, imagen.nombre);
      
      let archivoDrive = CARPETA.createFile(blob);
      archivoDrive.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      urlImagenFinal = imagen.base64;
    } catch (errorDrive) {
      Logger.log("Error procesando imagen en Drive: " + errorDrive.toString());
      urlImagenFinal = ''; 
    }
  } 
  // 3. Si viene la imagen de la silueta por defecto (o es un texto plano)
  else if (imagen && (imagen.porDefecto || typeof imagen === 'string')) {
    // Si pasaste el objeto extrae .base64, si pasaste texto plano usa imagen
    urlImagenFinal = imagen.base64 || imagen; 
  }

  // 4. Inserción segura en las celdas
  HOJA.appendRow([
    contacto.nombre || '', 
    contacto.apellidos || '', 
    contacto.correo || '', 
    contacto.telefono || '', 
    urlImagenFinal
  ]);
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