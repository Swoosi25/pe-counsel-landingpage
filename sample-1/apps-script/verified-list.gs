/**
 * PE Counsel Waitlist — VERIFIED list ("clicked the verification link")
 * Spreadsheet: 13fwA4V2XcYYP5b5zg7A9YRgFPAF7RvzOtQ5h3iNJgeM
 *
 * SETUP:
 *  1. Open this spreadsheet -> Extensions -> Apps Script
 *  2. Replace everything with this file's content
 *  3. Deploy -> New deployment -> Web app
 *       Execute as: Me   Access: Anyone
 *  4. Copy the /exec URL. Send it + SCRIPT_SECRET to your developer.
 */

var SCRIPT_SECRET = "HtwARMPdY1OJWVVwIU9RWdawcm-D6H663uNxIxUnyPQ";
var SPREADSHEET_ID = "13fwA4V2XcYYP5b5zg7A9YRgFPAF7RvzOtQ5h3iNJgeM";
var SHEET_NAME = "Verified";
var HEADERS = [
  "Verified (UTC)", "Email", "Name", "Company", "Source", "IP"
];

function doGet() {
  return ContentService.createTextOutput(
    "PE Counsel waitlist VERIFIED endpoint is alive. Use POST."
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
      .setBackground("#4F8EF7")
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
  var name = String(req.name || "").trim();
  var company = String(req.company || "").trim();
  if (!name) return out_({ ok: false, error: "name required" });
  if (!company) return out_({ ok: false, error: "company required" });
  var sh = ensureSheet_();
  sh.appendRow([
    new Date(),
    email,
    name,
    company,
    String(req.source || "landing"),
    String(req.ip || "")
  ]);
  return out_({ ok: true });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}