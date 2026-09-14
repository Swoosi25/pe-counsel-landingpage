/**
 * PE Counsel Waitlist — RAW list ("signed up, not yet verified")
 * Spreadsheet: 1h2MGzVv_1LPHafwZF37GkAWJlg_H4DmH9zgT6F215WA
 *
 * SETUP:
 *  1. Open this spreadsheet -> Extensions -> Apps Script
 *  2. Replace everything with this file's content
 *  3. Deploy -> New deployment -> Web app
 *       Execute as: Me   Access: Anyone
 *  4. Copy the /exec URL. Send it + SCRIPT_SECRET to your developer.
 */

var SCRIPT_SECRET = "O9voh1iPAnQa5F7DajChO7S9LZY7RHRRCLNbuibqoYI";
var SPREADSHEET_ID = "1h2MGzVv_1LPHafwZF37GkAWJlg_H4DmH9zgT6F215WA";
var SHEET_NAME = "Raw Signups";
var HEADERS = ["Signed up (UTC)", "Email", "Source", "IP", "Verify link expires"];

function doGet() {
  return ContentService.createTextOutput(
    "PE Counsel waitlist RAW endpoint is alive. Use POST."
  );
}

function ensureSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.setFrozenRows(1);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold")
      .setBackground("#00C896")
      .setFontColor("#04121a");
    sh.setColumnWidths(1, HEADERS.length, 200);
    for (var i = 1; i <= HEADERS.length; i++) {
      sh.autoResizeColumn(i);
    }
  }
  return sh;
}

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: "bad json" });
  }
  if (req.token !== SCRIPT_SECRET) {
    return out_({ ok: false, error: "forbidden" });
  }
  var email = String(req.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return out_({ ok: false, error: "invalid email" });
  }
  var sh = ensureSheet_();
  sh.appendRow([
    new Date(),
    email,
    String(req.source || "landing"),
    String(req.ip || ""),
    String(req.verify_expires || "")
  ]);
  return out_({ ok: true });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}