import { jsPDF } from "jspdf"
var font = 'undefined';
var callAddFont = function () {
this.addFileToVFS('Noto Sans TC-normal.ttf', font);
this.addFont('Noto Sans TC-normal.ttf', 'Noto Sans TC', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
