const mongoose = require('mongoose');

const PDFSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['book', 'article', 'document', 'manual', 'other'],
        default: 'other'
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        default: null
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    filePath: {
        type: String,
        required: [true, 'File path is required']
    },
    thumbnailUrl: {
        type: String,
        default: null
    },
    thumbnailPath: {
        type: String,
        default: null
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for search
PDFSchema.index({ title: 'text', description: 'text', category: 'text' });

// Update the updatedAt field on save
PDFSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for formatted date
PDFSchema.virtual('formattedCreatedAt').get(function() {
    return new Date(this.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Virtual for file size (to be populated when needed)
PDFSchema.virtual('fileSize').get(function() {
    return this._fileSize;
});

PDFSchema.set('toJSON', { virtuals: true });
PDFSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PDF', PDFSchema); 