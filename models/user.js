const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentLogSchema = new Schema({
    periodCovered: {
        start: { type: Date, }, // Start date of the covered rent period
        end: { type: Date, }    // End date of the covered rent period
    },
    paidAmount: { type: Number, },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, },
    paymentMode: { type: String, },
    transactionReference: { type: Array, },
    paymentStatus: {
        type: String,
        enum: ['PAID', 'PARTIAL', 'UNPAID'],
        default: 'UNPAID'
    },
    notes: { type: String, },
});

const leaseSchema = new Schema({
    rentAmount: { type: Number, },
    lateFeePerDay: { type: Number, },
    startDate: { type: Date, },
    endDate: { type: Date, },
    validityEndDate: { type: Date, },
    scheduledRent: { type: Number, },
    securityDeposit: { type: Number, },
    paymentSchedule: { type: String, enum: ['MONTHLY', 'QUATERLY', 'YEARLY'], default: 'MONTHLY' }
});

const scheduleRentSchema = new Schema({
    dueAmount: { type: Number, },
    advanceAmount: { type: Number, },
    paymentStatus: {
        type: String,
        enum: ['PAID', 'PARTIAL', 'UNPAID'],
        default: 'Unpaid'
    },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    dueDate: { type: Date, }, // When is the next payment due
})

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        index: true,
    },
    password: {
        type: String,
        // required: true,
        minLength: 6,
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['SUPERADMIN', 'ADMIN', 'SUBADMIN', 'TENANT'],
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
        enum: ['MALE', 'FEMALE', 'OTHER'],
    },
    age: {
        type: Number,
    },
    emergencyContact: {
        name: String,
        phoneNumber: String,
    },
    guardianName: {
        type: String
    },
    properties: {
        type: Array
    },
    guardianMobileNo: {
        type: String
    },
    tPropertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
    },
    tRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    tBedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    admissionDate: {
        type: Date
    },
    tPreviousBed: [
        {
            tPropertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
            tRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
            tBedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
        },
    ],
    leaseDetails: leaseSchema,
    rentDetails: [scheduleRentSchema],
    paymentHistory: [paymentLogSchema],
},
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    })

module.exports = mongoose.model('User', userSchema)