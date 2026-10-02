import { saveMessage } from '../services/data.service.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitContact = async (req, res, next) => {
  try {
    const { name = '', email = '', subject = '', message = '' } = req.body ?? {};
    const errors = {};

    if (name.trim().length < 2) errors.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
    if (message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';

    if (Object.keys(errors).length) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors });
    }

    const saved = await saveMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // TODO (later): forward to email / Firebase / CRM webhook here.
    res.status(201).json({ success: true, message: 'Thanks! Your message has been received.', id: saved.id });
  } catch (e) {
    next(e);
  }
};
