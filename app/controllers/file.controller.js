const { parseExcel, buildExcel } = require("../utils/excel");
const fs = require("fs");

exports.uploadExcel = (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const data = parseExcel(file.path);
    fs.unlinkSync(file.path); // Clean up
    res.json({ data });
  } catch (err) {
    console.error("Parse error", err);
    res.status(500).json({ message: "Failed to parse file" });
  }
};

exports.downloadExcel = (req, res) => {
  const dataSheets = {
    Users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
    Orders: [
      { orderId: 101, userId: 1 },
      { orderId: 102, userId: 2 },
    ],
  };

  const buffer = buildExcel(dataSheets);

  res.setHeader("Content-Disposition", "attachment; filename=multi-sheet.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.send(buffer);
};
