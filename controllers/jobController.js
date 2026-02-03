const { Job, Gym } = require('../mongodb-schemas');

exports.createJob = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { gymId } = req.body;
        const gym = await Gym.findById(gymId);

        if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });
        if (gym.ownerId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized for this gym' });
        }

        const job = await Job.create({
            ...req.body,
            postedBy: userId
        });

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: job
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        res.status(501).json({ message: 'Not implemented for lab scope yet' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.closeJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findByIdAndUpdate(jobId, {
            status: 'closed',
            closedAt: Date.now(),
            closedReason: req.body.closedReason
        }, { new: true });

        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        res.status(200).json({
            success: true,
            message: 'Job closed successfully',
            data: job
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).populate('gymId');
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        // Transform populate field to match spec 'gym': { name, city }
        const jobObj = job.toObject();
        jobObj.gym = {
            name: job.gymId.name,
            city: job.gymId.address.city
        };
        delete jobObj.gymId;

        res.status(200).json({ success: true, data: jobObj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.searchJobs = async (req, res) => {
    try {
        const { city, specialization, workType, minSalary, status = 'active', page = 1, limit = 10 } = req.query;
        let query = { status };

        if (specialization) query.requiredSpecializations = specialization;
        if (workType) query.workType = workType;
        if (minSalary) query['salaryRange.min'] = { $gte: parseFloat(minSalary) };

        // For city filter, similar to trainers, need to join with Gyms
        if (city) {
            // Complex aggregation needed or 2-step find. 
            // 2-step: find gyms in city, then find jobs for those gyms.
            // Simpler for this lab.
            const gymsInCity = await Gym.find({ 'address.city': { $regex: city, $options: 'i' } }).select('_id');
            const gymIds = gymsInCity.map(g => g._id);
            query.gymId = { $in: gymIds };
        }

        const jobs = await Job.find(query)
            .populate('gymId', 'name address.city')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const transformedJobs = jobs.map(job => {
            const j = job.toObject();
            j.gym = { name: j.gymId.name, city: j.gymId.address.city };
            delete j.gymId;
            return j;
        });

        res.status(200).json({
            success: true,
            data: {
                jobs: transformedJobs,
                pagination: { currentPage: parseInt(page), limit: parseInt(limit) }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
