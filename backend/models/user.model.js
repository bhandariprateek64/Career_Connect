import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'recruiter'],
    },
    profile: {
      bio: { type: String },
      skills: { type: String },
      resume: { type: String }, //URL to the resume
      resumeOriginalName: { type: String },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
      profilePhoto: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);
const userModel = userSchema.model('User', userSchema);
export default userModel;
