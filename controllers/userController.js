const { User } = require('../mongodb-schemas');

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        // Assume user context from middleware or header
        // For lab: we need to pass userId in body OR assume only "Me" updates. 
        // API spec: PUT /api/users/profile. This implies "current user".
        // I will look for x-user-id header.

        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const updates = req.body;

        // Prevent role update via this endpoint for security (even in lab, good practice)
        delete updates.role;
        delete updates.password;

        const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
