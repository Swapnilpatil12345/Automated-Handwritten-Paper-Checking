const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const ExcelJS = require("exceljs"); // Import exceljs

router.get("/download-summary", async (req, res) => {
    try {
        const students = await Listing.find({}); // Fetch data from MongoDB

        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Students Summary");

        // Add header row
        worksheet.addRow(["#", "Name", "Class", "PRN", "Subject", "Marks Obtained", "Max Marks"]);

        // Add student data
        students.forEach((student, index) => {
            worksheet.addRow([
                index + 1,
                student.Name,
                student.Class,
                student.PRN_Number,
                student.Subject,
                student.MarksObtained,
                student.MaxMarks
            ]);
        });

        // Set response headers for file download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");

        // Send the workbook
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("Error generating Excel file:", err);
        res.status(500).send("Error generating Excel file");
    }
});

module.exports = router;
