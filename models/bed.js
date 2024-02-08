const mongoose = require('mongoose');
const Room = require('./room');
const Schema = mongoose.Schema;

const Bed = new Schema ({
    name: {
        type: String,
    },
    bedNumber: {
        type: String,
    },
    rent: {
        type: Number,
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'],
    },
    features: {
        type: Array,
    },
    notes: {
        type: String,
    },
})

module.exports = mongoose.model('Bed', Bed);