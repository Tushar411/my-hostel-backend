const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        minlength: 10
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    registrationDate: { 
        type: Date, 
        default: Date.now },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'subAdmin', 'tenant'],
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    age: {
        type: String,
    },
    emergencyContact: {
        name: String,
        phoneNumber: String,
    },
    guardianName: {
        type: String
    },
    // guardianMobileNo: {
    //     type: String
    // },
    // // fee: {
    // //     type: mongoose.Schema.Types.ObjectId,
    // //     ref: feeStructure
    // // },
    // tPropertyId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Property"
    // },
    // tRoomId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Property"
    // },
    // tBedId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Property"
    // },
    // admissionDate: {
    //     type: Date
    // },
    // tPreviousBed: {
    //     type: Array                         // array of [{tPropertyId, tRoomId, tBedId}
    // },
    // modified: mongoose.Schema.Types.Date,
    // created: mongoose.Schema.Types.Date,
    // // Additional fields specific to certain roles
    // adminDetails: {
    //     adminTitle: String,
    //     // ... other admin-specific fields
    // },
    // subAdminDetails: {
    //     subAdminTitle: String,
    //     // ... other sub-admin-specific fields
    // },
    // tenantDetails: {
    //     tenantOccupation: String,
    //     // ... other tenant-specific fields
    // },
})

module.exports = mongoose.model('User', userSchema)