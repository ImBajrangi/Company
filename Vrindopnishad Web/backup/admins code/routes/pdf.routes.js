const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const PDF = require('../models/pdf.model');
const adminAuth = require('../middleware/adminAuth');

// Set up multer storage for PDF files and thumbnails
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        
        // Create separate folders for PDFs and thumbnails
        if (file.fieldname === 'pdfFile') {
            uploadPath += 'pdfs/';
        } else if (file.fieldname === 'thumbnail') {
            uploadPath += 'thumbnails/';
        }
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with original extension
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// File filter to accept only PDFs and images
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'pdfFile') {
        // Accept only PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    } else if (file.fieldname === 'thumbnail') {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for thumbnails'), false);
        }
    } else {
        cb(new Error('Unexpected field'), false);
    }
};

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Create PDF upload middleware
const uploadPDFFiles = upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

// Get all PDFs (admin only)
router.get('/admin', adminAuth, async (req, res) => {
    try {
        const pdfs = await PDF.find().sort({ createdAt: -1 });
        
        // Format the data for the admin panel
        const formattedPdfs = pdfs.map(pdf => ({
            id: pdf._id,
            title: pdf.title,
            description: pdf.description,
            category: pdf.category,
            fileUrl: pdf.fileUrl,
            views: pdf.views,
            downloads: pdf.downloads,
            createdAt: pdf.createdAt,
            formattedCreatedAt: new Date(pdf.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }));
        
        res.json(formattedPdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get PDFs by category (public)
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const pdfs = await PDF.find({ category }).sort({ createdAt: -1 });
        
        // Format the data for the public view
        const formattedPdfs = pdfs.map(pdf => ({
            id: pdf._id,
            title: pdf.title,
            description: pdf.description,
            category: pdf.category,
            fileUrl: pdf.fileUrl,
            views: pdf.views,
            createdAt: pdf.createdAt,
            formattedCreatedAt: new Date(pdf.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }));
        
        res.json(formattedPdfs);
    } catch (error) {
        console.error('Error fetching PDFs by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all PDFs (public)
router.get('/', async (req, res) => {
    try {
        const pdfs = await PDF.find().sort({ createdAt: -1 });
        
        // Format the data for the public view
        const formattedPdfs = pdfs.map(pdf => ({
            id: pdf._id,
            title: pdf.title,
            description: pdf.description,
            category: pdf.category,
            fileUrl: pdf.fileUrl,
            views: pdf.views,
            createdAt: pdf.createdAt,
            formattedCreatedAt: new Date(pdf.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }));
        
        res.json(formattedPdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get PDF by ID
router.get('/:id', async (req, res) => {
    try {
        const pdf = await PDF.findById(req.params.id);
        
        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }
        
        // Format the data
        const formattedPdf = {
            id: pdf._id,
            title: pdf.title,
            description: pdf.description,
            category: pdf.category,
            fileUrl: pdf.fileUrl,
            views: pdf.views,
            downloads: pdf.downloads,
            createdAt: pdf.createdAt,
            formattedCreatedAt: new Date(pdf.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        res.json(formattedPdf);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update view count
router.post('/:id/view', async (req, res) => {
    try {
        const pdf = await PDF.findById(req.params.id);
        
        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }
        
        // Increment view count
        pdf.views += 1;
        await pdf.save();
        
        res.json({ success: true, views: pdf.views });
    } catch (error) {
        console.error('Error updating view count:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update download count
router.post('/:id/download', async (req, res) => {
    try {
        const pdf = await PDF.findById(req.params.id);
        
        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }
        
        // Increment download count
        pdf.downloads += 1;
        await pdf.save();
        
        res.json({ success: true, downloads: pdf.downloads });
    } catch (error) {
        console.error('Error updating download count:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload a new PDF (admin only)
router.post('/', adminAuth, upload.single('file'), async (req, res) => {
    try {
        const { title, description, category } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Create file URL
        const fileUrl = `/uploads/pdfs/${req.file.filename}`;
        
        // Create new PDF document
        const newPdf = new PDF({
            title,
            description,
            category,
            fileUrl,
            views: 0,
            downloads: 0
        });
        
        await newPdf.save();
        
        res.status(201).json({
            message: 'PDF uploaded successfully',
            pdf: {
                id: newPdf._id,
                title: newPdf.title,
                description: newPdf.description,
                category: newPdf.category,
                fileUrl: newPdf.fileUrl
            }
        });
    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update PDF details (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        
        const pdf = await PDF.findById(req.params.id);
        
        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }
        
        // Update fields
        if (title) pdf.title = title;
        if (description) pdf.description = description;
        if (category) pdf.category = category;
        
        await pdf.save();
        
        res.json({
            message: 'PDF updated successfully',
            pdf: {
                id: pdf._id,
                title: pdf.title,
                description: pdf.description,
                category: pdf.category,
                fileUrl: pdf.fileUrl
            }
        });
    } catch (error) {
        console.error('Error updating PDF:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete PDF (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const pdf = await PDF.findById(req.params.id);
        
        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }
        
        // Delete file from filesystem
        const filePath = path.join(__dirname, '..', pdf.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // Delete from database
        await PDF.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'PDF deleted successfully' });
    } catch (error) {
        console.error('Error deleting PDF:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 