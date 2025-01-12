import express from 'express';
import Company from '../models/company.model.js';
import authUser from '../middlewares/userAuth.js';
import singleUpload from '../middlewares/multer.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
const companyRouter = express.Router();

// Registering a company
companyRouter.post('/register', authUser, async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: 'Company Name is required',
        success: false,
      });
    }

    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({
        message: 'Company already registered',
        success: false,
      });
    }

    const newCompany = new Company({
      name: companyName,
      userId: req._id,
    });
    const savedCompany = await newCompany.save();
    if (!savedCompany) {
      return res.status(400).json({
        message: 'Error registering the company',
        success: false,
      });
    }
  

    return res.status(201).json({
      message: 'Registered Successfully',
      success: true,
      company: savedCompany,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});

// Getting all companies of a user
companyRouter.get('/get', authUser, async (req, res) => {
  try {
    const userId = req._id;
    const companies = await Company.find({ userId: userId });
    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: 'No companies found',
        success: false,
      });
    }
    return res.status(200).json({
      message: 'Companies Found Successfully',
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});

// Getting a particular company
companyRouter.get('/get/:id', authUser, async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        message: 'No company found',
        success: false,
      });
    }
    return res.status(200).json({
      message: 'Company Found Successfully',
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});

// Updating a company
companyRouter.patch('/update/:id', authUser, singleUpload, async (req, res) => {
  try {
    const id = req.params.id;

    const { name, description, website, location } = req.body;
    const file = req.file;

    // Fetch the current company data
    const currentCompany = await Company.findById(id);

    if (!currentCompany) {
      return res.status(404).json({
        message: 'Company not found',
        success: false,
      });
    }

    let logo = currentCompany.logo; // Retain the current logo if no new file is provided

    // Cloudinary logic (if a new logo is uploaded)
    if (file) {
      const fileuri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
      logo = cloudResponse.secure_url; // Update the logo with the new image URL
    }

    const updateData = { name, description, website, location, logo };

    // Update the company with the new data
    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, {
      new: true, // Ensures the returned document is the updated one
    });

    if (!updatedCompany) {
      return res.status(404).json({
        message: 'Company not found or update failed',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Company Updated Successfully',
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});


export default companyRouter;
