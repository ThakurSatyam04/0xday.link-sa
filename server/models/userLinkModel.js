import mongoose, { Schema } from 'mongoose';


// Create the User Schema
const UserSchema = new Schema({
  image: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, required: true,unique: true },
  linkedInId: { type: String, required: true,unique: true },
  githubId: { type: String, required: true,unique: true },
  instaId: { type: String, required: true,unique: true },
  xId: { type: String, required: true,unique: true },
  fbId: { type: String, required: true,unique: true },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Export the model and return your IUser interface
const User = mongoose.model('User', UserSchema);

export default User;
