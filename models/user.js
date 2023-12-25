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
    // orgName: {
    //     type: String,
    //     required:true,
    // },
    // orgType: {
    //     type: String,
    //     enum: ['hostel', 'PG'],
    //     required: true
    // },
    // hostelType:{
    //     type: String,
    //     enum: ['boys', 'girls', 'co-ed'],
    //     required: true
    // }
})

module.exports = mongoose.model('User', userSchema)