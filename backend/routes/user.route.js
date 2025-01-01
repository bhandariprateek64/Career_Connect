import express from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  const { fullName, email, phoneNumber, password, role } = req.body;
  if (!fullName || !email || !phoneNumber || !password || !role) {
    return res.status(400).json({
      message: 'Something is missing',
      success: false,
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: 'User already exist with this email',
      success: false,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = new User({
    fullName,
    email,
    phoneNumber,
    password: hashedPassword,
    role,
  });
  const savedData = await data.save();
  if (!savedData) {
    return res.status(400).json({
      message: 'Error saving data',
      success: false,
    });
  }
  res.json({
    message: 'User registered Successfully',
    success: true,
  });
});
userRouter.post('/login')
export default userRouter;
