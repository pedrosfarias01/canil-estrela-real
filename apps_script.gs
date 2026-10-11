/**
 * Recebe os cadastros do site e grava na planilha.
 * Cole este código em: Planilha > Extensões > Apps Script (passo a passo no README.md).
 */

const SHEET_NAME = "Interessados";

// Opcional: e-mail que recebe um aviso a cada novo cadastro. Deixe "" para desligar.
const NOTIFY_EMAIL = "";

const HEADERS = ["Data", "Nome", "WhatsApp", "Cidade", "Preferência", "Mensagem", "Status"];

function doPost(e) {
  const p = e.parameter;

  // Campo anti-spam preenchido = robô. Ignora.
  if (p.website) return ContentService.createTextOutput("ok");

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const row = [
      new Date(),
      clean(p.nome),
      clean(p.whatsapp),
      clean(p.cidade),
      clean(p.preferencia),
      clean(p.mensagem),
      "Novo",
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "Novo interessado em filhote: " + row[1],
        "Nome: " + row[1] + "\nWhatsApp: " + row[2] + "\nCidade: " + row[3] +
        "\nPreferência: " + row[4] + "\nMensagem: " + row[5]
      );
    }
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput("ok");
}

// Limita o tamanho e força texto (evita que "(11) 9..." ou "=..." virem fórmula).
function clean(value) {
  const v = String(value || "").trim().slice(0, 500);
  return v ? "'" + v : "";
}
