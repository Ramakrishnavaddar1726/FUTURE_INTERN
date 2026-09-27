/**
 * Request Validation & Error Handling Middleware
 */
const validateContactPayload = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Valid name of at least 2 characters is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Valid email address is required.' });
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Subject of at least 3 characters is required.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'Message must be at least 10 characters long.' });
  }

  next();
};

module.exports = {
  validateContactPayload,
};
