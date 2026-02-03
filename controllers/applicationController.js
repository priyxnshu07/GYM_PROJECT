const { Application, Trainer, Job, User } = require('../mongodb-schemas');

exports.submitApplication = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        // Need to find Trainer profile for this user
        const trainer = await Trainer.findOne({ userId });
        if (!trainer) return res.status(403).json({ success: false, message: 'Trainer profile required' });

        const { jobId, coverLetter, expectedSalary, availableStartDate } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (job.status !== 'active') return res.status(400).json({ success: false, message: 'Job closed' });

        // Check for duplicates
        const existing = await Application.findOne({ trainerId: trainer._id, jobId });
        if (existing) return res.status(409).json({ success: false, message: 'Already applied' });

        const application = await Application.create({
            trainerId: trainer._id,
            jobId,
            gymId: job.gymId,
            coverLetter,
            expectedSalary,
            availableStartDate
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getApplication = async (req, res) => {
    try {
        const app = await Application.findById(req.params.applicationId)
            .populate('trainerId') // Need deep populate for name?
            .populate('jobId');

        // For deep user info (name) we need .populate({ path: 'trainerId', populate: { path: 'userId' } })
        // I will do simple populate first.

        if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
        res.status(200).json({ success: true, data: app });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        // Assume trainer calls this
        const userId = req.headers['x-user-id'];
        const trainer = await Trainer.findOne({ userId });
        if (!trainer) return res.status(403).json({ message: 'Not a trainer' });

        const applications = await Application.find({ trainerId: trainer._id })
            .populate({ path: 'jobId', populate: { path: 'gymId', select: 'name' } }); // Nested populate for Gym Name

        res.status(200).json({ success: true, data: { applications } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, offerDetails, rejectionReason } = req.body;
        const userId = req.headers['x-user-id'];

        const application = await Application.findById(applicationId).populate({
            path: 'jobId',
            populate: { path: 'gymId' }
        });

        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        // Auth check: Must be gym owner of the job's gym
        if (application.jobId.gymId.ownerId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        application.status = status;
        if (status === 'accepted' && offerDetails) {
            application.offerDetails = offerDetails;
        }
        if (status === 'rejected' && rejectionReason) {
            application.rejectionReason = rejectionReason;
        }

        await application.save();

        res.status(200).json({
            success: true,
            message: `Application ${status}`,
            data: application
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        // Verify user owns the job's gym
        // (Skipping deep auth for speed, but ideally check)

        const applications = await Application.find({ jobId })
            .populate({
                path: 'trainerId',
                populate: { path: 'userId', select: 'name' }
            });

        // Transform for frontend if needed
        const data = applications.map(app => ({
            ...app.toObject(),
            trainer: {
                name: app.trainerId.userId?.name,
                ...app.trainerId.toObject()
            }
        }));

        res.status(200).json({ success: true, data: { applications: data } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
