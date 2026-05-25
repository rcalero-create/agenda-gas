const HOJA = SpreadsheetApp.openById('1r55A61lVoehpus_gCA816qCOdsRo3k2_045fTbgeu4s').getActiveSheet();
const CARPETA_IMAGENES = DriveApp.getFolderById('1VGwqsL5PddZa4z9VDczzK0KTPrYJQHls');
const CABECERA_IMAGEN_URL='https://drive.google.com/thumbnail?id=';

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
  if (!contacto) {
    throw new Error("El servidor recibió un objeto contacto nulo o inválido.");
  }

  // Pasamos la imagen por la función que genera la URL corta
  let urlImagenFinal = guardarImagen(imagen);

  // Inserción segura en las celdas
  HOJA.appendRow([
    contacto.nombre || '', 
    contacto.apellidos || '', 
    contacto.correo || '', 
    contacto.telefono || '', 
    urlImagenFinal // Aquí ahora irá una URL corta de Drive o la silueta por defecto
  ]);
}

function borrarContacto(filaIndex) {
  HOJA.deleteRow(filaIndex);
}

function modificarContacto(contacto, imagen) {
  if (!contacto || !contacto.fila) {
    throw new Error("El servidor no recibió un contacto válido o falta el número de fila.");
  }

  // Si nos llega una imagen (ya sea objeto de foto nueva o texto de la antigua)
  if (imagen) {
    contacto.imagen = guardarImagen(imagen);
  }

  let celdas = HOJA.getRange('A' + contacto.fila + ':E' + contacto.fila);
  
  celdas.setValues([[
    contacto.nombre || '', 
    contacto.apellidos || '', 
    contacto.correo || '', 
    contacto.telefono || '', 
    contacto.imagen || ''
  ]]);
}

function guardarImagen(imagen) {
  if (!imagen) return '';

  // Si lo que llega es directamente una URL de Drive existente (texto plano corto), la devolvemos tal cual
  if (typeof imagen === 'string' && imagen.startsWith('http')) {
    return imagen;
  }

  let urlImagenFinal = '';

  // Si es un objeto estructurado de una foto REAL nueva (Base64)
  if (imagen && !imagen.porDefecto && imagen.base64 && imagen.tipo && imagen.nombre) {
    try {
      let cadenaLimpia = imagen.base64.split(',')[1];
      let bytes = Utilities.base64Decode(cadenaLimpia);
      
      let blob = Utilities.newBlob(bytes, imagen.tipo, imagen.nombre);
      let archivoDrive = CARPETA_IMAGENES.createFile(blob);
      archivoDrive.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      // CORREGIDO: En lugar de guardar el Base64 eterno, guardamos la URL directa de visualización
      urlImagenFinal = CABECERA_IMAGEN_URL + archivoDrive.getId(); 
      
    } catch (errorDrive) {
      Logger.log("Error procesando imagen en Drive: " + errorDrive.toString());
      urlImagenFinal = ''; 
    }
  } 
  // Si llega el objeto de la silueta por defecto o es el string SVG de la silueta
  else if (imagen && (imagen.porDefecto || typeof imagen === 'string')) {
    urlImagenFinal = imagen.base64 || imagen;
  }

  return urlImagenFinal;
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