const mongoose = require('mongoose');
const property = require('./property');
//const Bed = require('./bed');
const Schema = mongoose.Schema;

const Bed = new Schema ({
    bedNumber: {
        type: String,
    },
    rent: {
        type: Number,
    },
    // propertyId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Property'
    // },
    // roomId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Room'
    // },
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


const Room = new Schema ({
    name: {
        type : String
    },
    bedCapacity: {
        type: Number
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    beds: {
        type: [Bed]
    },
    images: {
        type : [String]
    },
    features: {
        type: Array
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
       // required: true
    }

})

// Ensure uniqueness for the combination of 'name' and 'propertyId'
// Room.index({ name: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('Room', Room)