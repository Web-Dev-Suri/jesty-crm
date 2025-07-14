const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Adjust this path to your actual Client model
const Client = require('../models/appModels/Client'); // or wherever your Client model is

const upload = multer({ dest: 'uploads/' });

// EXPORT: Download all clients as Excel
router.get('/export', async (req, res) => {
  try {
    const clients = await Client.find({ removed: false }).lean();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clients');

    // Define columns (customize as needed)
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Source', key: 'source', width: 20 },
      { header: 'Created', key: 'created', width: 25 },
      // Add more fields as needed
    ];

    clients.forEach(client => {
      worksheet.addRow({
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: client.status,
        source: client.source,
        created: client.created,
        // Add more fields as needed
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=clients.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// IMPORT: Upload Excel and insert/update clients
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    let imported = 0;
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const [name, email, phone, status, source, created] = row.values.slice(1);
      if (name && email) {
        rows.push({
          name,
          email,
          phone,
          status,
          source,
          created: created ? new Date(created) : new Date(),
        });
      }
    });

    // Insert or update by email (customize as needed)
    for (const row of rows) {
      await Client.updateOne(
        { email: row.email },
        { $set: row },
        { upsert: true }
      );
      imported++;
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ success: true, imported });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;