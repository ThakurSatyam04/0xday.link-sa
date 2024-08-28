import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
});

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
