/**
 * Contact Controller
 * Handles receiving, validating, and persisting contact form submissions
 */
const Contact = require('../models/Contact');

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (name, email, subject, message).',
      });
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. Ramakrishna will respond shortly.',
      data: {
        id: newContact._id,
        name: newContact.name,
        subject: newContact.subject,
        createdAt: newContact.createdAt,
      },
    });
  } catch (error) {
    console.error('Contact Submission Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error processing contact inquiry. Please try again or email directly.',
    });
  }
};

module.exports = {
  submitContactMessage,
};
