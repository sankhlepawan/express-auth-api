const XLSX = require("xlsx");
const fs = require("fs");

exports.parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const data = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    data[sheetName] = XLSX.utils.sheet_to_json(sheet);
  });

  return data; // { Sheet1: [...], Sheet2: [...] }
};

exports.buildExcel = (dataSheets) => {
  const workbook = XLSX.utils.book_new();

  Object.entries(dataSheets).forEach(([sheetName, data]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
