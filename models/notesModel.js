const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({

    userId: {
        type: String,
        required:true
    },
    notes: [{
        title: {
            type: String,
            trim: true
        },
        content: {
            type: String,
            trim: true
        }
    }],

}, {
    timestamps: true
});

const Note = mongoose.model('notes', noteSchema);

module.exports = Note;