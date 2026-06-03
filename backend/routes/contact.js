const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact   — save a contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, whatsapp, message } = req.body;

    if (!name || !whatsapp || !message) {
      return res.status(400).json({
        success: false,
        message: 'name, whatsapp, and message are required',
      });
    }

    const submission = new Contact({ name, whatsapp, message });
    await submission.save();

    res.status(201).json({ success: true, message: 'Message received. We\'ll be in touch shortly!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
