const { Gym, User } = require('../mongodb-schemas');

exports.createGym = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user || user.role !== 'gymOwner') {
            return res.status(403).json({ success: false, message: 'Access denied. Gym Owners only.' });
        }

        const gym = await Gym.create({
            ...req.body,
            ownerId: userId
        });

        res.status(201).json({
            success: true,
            message: 'Gym created successfully',
            data: {
                gymId: gym._id,
                name: gym.name,
                isVerified: gym.isVerified
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateGym = async (req, res) => {
    try {
        const { gymId } = req.params;
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        let gym = await Gym.findById(gymId);
        if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

        // Authorization check: Ensure requester is the owner
        if (gym.ownerId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this gym' });
        }

        gym = await Gym.findByIdAndUpdate(gymId, req.body, { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            message: 'Gym updated successfully',
            data: gym
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getGym = async (req, res) => {
    try {
        const gym = await Gym.findById(req.params.gymId).populate('trainers');
        if (!gym) return res.status(404).json({ success: false, message: 'Gym not found' });

        res.status(200).json({ success: true, data: gym });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.searchGyms = async (req, res) => {
    try {
        const { city, state, facilities, minRating, maxPrice, sortBy, order, page = 1, limit = 10 } = req.query;
        let query = {};

        if (city) query['address.city'] = { $regex: city, $options: 'i' };
        if (state) query['address.state'] = { $regex: state, $options: 'i' };
        if (facilities) query.facilities = { $in: facilities.split(',') };
        if (minRating) query.rating = { $gte: parseFloat(minRating) };
        if (maxPrice) query['pricing.monthlyMembership'] = { $lte: parseFloat(maxPrice) };

        const sortOptions = {};
        if (sortBy) sortOptions[sortBy] = order === 'desc' ? -1 : 1;

        const gyms = await Gym.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                gyms,
                pagination: { currentPage: parseInt(page), limit: parseInt(limit) }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
