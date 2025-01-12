import express from 'express';
import Job from '../models/job.model.js';
import authUser from '../middlewares/userAuth.js';
const jobRouter = express.Router();
//Admin is posting a new job(RECRUITER)
jobRouter.post('/post', authUser, async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req._id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: 'Somethin is missing.',
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(','),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      createdBy: userId,
    });
    return res.status(201).json({
      message: 'New job created successfully.',
      job,
      success: true,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});

//Getting all job or with filter for student
jobRouter.get('/get', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } }, // Use $regex instead of regex
        { description: { $regex: keyword, $options: 'i' } }, // Use $regex instead of regex
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: 'company' })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: 'No jobs found',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Jobs fetched successfully',
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});

// Getting a particular job for a student
jobRouter.get('/get/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: 'applications',
    });
    if (!job) {
      return res.status(400).json({
        message: 'Error finding  job',
        success: false,
      });
    }
    return res.status(201).json({
      message: 'Job found',
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});
//Getting all jobs created by admin till
jobRouter.get('/getAdminJobs', authUser, async (req, res) => {
  try {
    const adminId = req._id;
    const job = await Job.find({ createdBy: adminId }).populate({
      path: 'company',
    });
    if (!job) {
      return res.status(400).json({
        message: 'Error finding  job',
        success: false,
      });
    }
    return res.status(201).json({
      message: 'Job found',
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
});

export default jobRouter;
