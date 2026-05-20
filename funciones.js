const HOJA = SpreadsheetApp.openById('1r55A61lVoehpus_gCA816qCOdsRo3k2_045fTbgeu4s').getActiveSheet();

function doGet() {
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}
// EL NOU doPOST: Ara rep els canvis del fetch i respon correctament en JSON
function doPost(e) {
    try {
        // Llegim les dades que venen del FormData de la web
        const nombre = e.parameter.nombre;
        const correo = e.parameter.correo;
        
        // Insertem a la fila
        insertarContacto(nombre, correo);
        
        // Respondre èxit en format JSON (Això evita que demani permisos o obri finestres)
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Contacto insertado correctamente" }))
                             .setMimeType(ContentService.MimeType.JSON);
                             
    } catch(error) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                             .setMimeType(ContentService.MimeType.JSON);
    }
}

<<<<<<< HEAD
function doPost(e) {
    
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

=======
>>>>>>> c026d02b80f0f734299b9919881abd50da96e098
function obtenerDatosHtml(nombre) {
    return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

function obtenerContactos() {
<<<<<<< HEAD
  
    return HOJA.getDataRange().getDisplayValues();
  
}

function insertarContacto(nombre, correo) {
  HOJA.appendRow([nombre, correo]);
}
=======
  try {
    return HOJA.getDataRange().getDisplayValues();
  } catch(error) {
    return [];
  }
}

// Net i sense col·lisions: l'únic que fa és afegir la fila i punt
function insertarContacto(nombre, correo) {
  HOJA.appendRow([nombre, correo]);
}

function insertarContacto(nombre, correo) {
    HOJA.appendRow([nombre, correo]);
}
>>>>>>> c026d02b80f0f734299b9919881abd50da96e098
