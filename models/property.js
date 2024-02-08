const mongoose = require('mongoose');
const Room = require('./room');
const Schema = mongoose.Schema;

const Property = new Schema({
    name: {
        type: String
    },
    propertyType: {
        type: String,
        enum: ['HOSTEL', 'PG', 'FLAT'],
    },
    tenantType: {
        type: String,
        enum: ['BOYS', 'GIRLS', 'CO_ED']
    },
    address: {
        type: String
        // apartmentNo: String,
        // street1: String,
        // street2: String,
        // landmark: String,
        // city: String,
        // zipCode: String,
        // state: String,
        // country: String,
        // ph: String,
        // ph2: String,
        // cell: String,
        // cell2: String,
        // fax: String,
        // email: String,
        // web: String,
        // lat: mongoose.Schema.Types.Number,
        // lng: mongoose.Schema.Types.Number,
        // placeId: String,
        // created: mongoose.Schema.Types.Date,
        // modified: mongoose.Schema.Types.Date,
        // note: String,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pincode: {
        type: Number
    },
    website: {
        type: String
    },
    cell: {
        type: String,
        minlength: 10
    },
    cell2: {
        type: String,
        minlength: 10
    },
    location: {
        lat: mongoose.Schema.Types.Number,
        lng: mongoose.Schema.Types.Number,
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    }],
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE']
    },
    icon: {
        type: String,
    },
    logo: {
        type: String,
    },
    images: {
        type: [String]
    },
    note: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now,
    },
    modified: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Property', Property);