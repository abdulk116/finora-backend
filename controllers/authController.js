// controllers/authController.js
import {
  registerUserService,
  loginUserService,
  getUserProfileService,
} from '../services/authService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const userData = await registerUserService(req.body);
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    console.log("hitted", req)
    const userData = await loginUserService(req.body);
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserProfileService(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};