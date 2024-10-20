const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const User = require('../../model/resultSchema'); // Assuming you have stored your model in models/User.js

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Bulk insert data into MongoDB
        await User.insertMany(data);

        res.status(200).json({
            status: true,
            message: "Data successfully saved to MongoDB",
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to process the file.');
    }
});

module.exports = router;
