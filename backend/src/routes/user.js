import express from 'express';
import { getProfile, updateProfile } from '../db.js';

const router = express.Router();

/**
 * GET /api/user/profile
 * Fetch the current user's strictly personal profile details
 */
router.get('/profile', async (req, res) => {
  try {
    const profile = await getProfile();
    
    // Extract strictly personal details
    const personalDetails = {
      id: profile.id,
      name: profile.name || 'Arunaswin S',
      email: profile.email || 'arunaswin@wealthpulse.app',
      username: profile.username || 'sarunaswin',
      avatar_url: profile.avatar_url || '',
      phone_number: profile.phone_number || '+91 98765 43210'
    };

    res.json({
      success: true,
      data: personalDetails
    });
  } catch (err) {
    console.error('Error fetching personal profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/user/profile
 * Update user's personal details (name, email, username, phone_number, avatar_url)
 */
router.put('/profile', async (req, res) => {
  try {
    const { name, email, username, phone_number, avatar_url } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (username !== undefined) updates.username = username.trim().replace(/^@/, '');
    if (phone_number !== undefined) updates.phone_number = phone_number.trim();
    if (avatar_url !== undefined) updates.avatar_url = avatar_url.trim();

    const updatedProfile = await updateProfile(updates);

    const personalDetails = {
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      username: updatedProfile.username,
      avatar_url: updatedProfile.avatar_url,
      phone_number: updatedProfile.phone_number
    };

    res.json({
      success: true,
      message: 'Personal profile updated successfully',
      data: personalDetails
    });
  } catch (err) {
    console.error('Error updating personal profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/user/avatar
 * Update user's profile avatar
 */
router.post('/avatar', async (req, res) => {
  try {
    const { avatar_url } = req.body;
    if (!avatar_url) {
      return res.status(400).json({ success: false, error: 'Avatar URL is required.' });
    }

    const updated = await updateProfile({ avatar_url: avatar_url.trim() });
    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: { avatar_url: updated.avatar_url }
    });
  } catch (err) {
    console.error('Error updating avatar:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
