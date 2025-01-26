import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import authUser from '../middlewares/userAuth.js';
import singleUpload from '../middlewares/multer.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';

const userRouter = express.Router();

userRouter.post('/register', singleUpload, async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        message: 'Profile photo is required',
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
        success: false,
      });
    }

    // Upload profile photo to Cloudinary
    let cloudResponse;
    try {
      const fileuri = getDataUri(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileuri.content);
    } catch (cloudError) {
      return res.status(500).json({
        message: 'Error uploading profile photo',
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    // Save user to database
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(500).json({
        message: 'Error saving user',
        success: false,
      });
    }

    // Success response
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
});
userRouter.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate request body
    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Something is missing',
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Incorrect email or password',
        success: false,
      });
    }

    // Validate password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Incorrect email or password',
        success: false,
      });
    }

    // Validate role
    if (role !== user.role) {
      return res.status(400).json({
        message: 'Account does not exist with current role',
        success: false,
      });
    }

    // Generate JWT token
    const tokenData = { userID: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    // Prepare sanitized user data
    const sanitizedUser = {
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      _id: user._id,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };

    // Send response with cookie
    return res
      .status(200)
      .cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        success: true,
        user: sanitizedUser,
      });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
});
userRouter.get('/logout', async (req, res) => {
  try {
    return res.status(200).cookie('token', '', { maxAge: 0 }).json({
      message: 'logged out successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});
userRouter.patch(
  '/profile/update',
  authUser, // Ensure user is authenticated
  singleUpload, // Ensure file upload middleware
  async (req, res) => {
    try {
      const { fullName, email, phoneNumber, bio, skills } = req.body;

      // Validate if at least one field is provided
      if (!fullName && !email && !phoneNumber && !bio && !skills && !req.file) {
        return res.status(400).json({
          message: 'No fields provided to update.',
          success: false,
        });
      }

      const file = req.file;
      let cloudResponse;

      if (file) {
        const fileuri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileuri.content);
      }

      // Initialize the user ID
      const userID = req._id;
      let user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({
          message: 'User not found.',
          success: false,
        });
      }

      // Update fields only if they are provided
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (bio) user.profile.bio = bio;
      if (skills) user.profile.skills = skills.split(','); // Convert skills string to array

      // If a new resume is uploaded, update the resume URL
      if (cloudResponse) {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;
      }

      // Save the updated user to the database
      const updatedUser = await user.save();

      if (!updatedUser) {
        return res.status(400).json({
          message: 'User update failed.',
          success: false,
        });
      }

      // Prepare the response with updated user details
      const updatedUserResponse = {
        _id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        profile: updatedUser.profile,
      };

      return res.status(200).json({
        message: 'User updated successfully.',
        user: updatedUserResponse,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal server error.',
        success: false,
        error: error.message,
      });
    }
  }
);

export default userRouter;
