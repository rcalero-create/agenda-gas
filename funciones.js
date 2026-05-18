function doGet() {
    return HtmlService.createTemplateFromFile('web').evaluate().setTitle('Agenda Google Apps Script');
}

function obtenerDatosHtml(nombre) {

    return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}