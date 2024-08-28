import mongoose, { Schema } from 'mongoose';

const OTPSchema = new Schema({
    phoneNumber: {type:String, required:true},
    otpcode:{type:String, required:true},
    createdAt: {type: Date, default: Date.now, index: {expires: '5m'}},
});

const Otp = mongoose.model('otp', OTPSchema);

export default Otp;