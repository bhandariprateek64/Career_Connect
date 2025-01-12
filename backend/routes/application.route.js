import express from 'express';
import authUser from '../middlewares/userAuth.js';
import Application from '../models/application.model.js';
import Job from '../models/job.model.js';

const applicationRouter = express.Router();

// Apply for a job
applicationRouter.get('/apply/:id', authUser, async (req, res) => {
  const userId = req._id;
  const jobId = req.params.id;

  if (!jobId) {
    return res
      .status(400)
      .json({ message: 'Job id is required', success: false });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ message: 'Job does not exist', success: false });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: 'You have already applied', success: false });
    }

    const newApplication = new Application({ job: jobId, applicant: userId });
    const savedApplication = await newApplication.save();
    if (!savedApplication) {
      return res
        .status(500)
        .json({ message: 'Error applying for the job', success: false });
    }

    job.applications.push(savedApplication._id);
    await job.save();

    return res
      .status(201)
      .json({ message: 'Application submitted successfully', success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message,
    });
  }
});

// Get applied jobs for a user
applicationRouter.get('/get', authUser, async (req, res) => {
  const userId = req._id;

  try {
    const appliedJobs = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({ path: 'job', populate: { path: 'company' } });

    if (!appliedJobs || appliedJobs.length === 0) {
      return res
        .status(404)
        .json({ message: 'No applied jobs found', success: false });
    }

    return res
      .status(200)
      .json({ message: 'Applied jobs found', success: true, appliedJobs });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message,
    });
  }
});

// Get applicants for a job (Admin only)
applicationRouter.get('/:id/applicants', authUser, async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId).populate({
      path: 'applications',
      populate: { path: 'applicant' },
    });

    if (!job) {
      return res.status(404).json({
        message: 'No applications found for this job',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Applicants found',
      success: true,
      applications: job.applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message,
    });
  }
});

// Update application status (Admin only)
applicationRouter.patch('/status/:id/update', authUser, async (req, res) => {
  const applicationId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res
      .status(400)
      .json({ message: 'Status is required', success: false });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ message: 'Application not found', success: false });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json({ message: 'Status updated successfully', success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error.message,
    });
  }
});

export default applicationRouter;
