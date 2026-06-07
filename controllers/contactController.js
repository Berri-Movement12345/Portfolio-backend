const { Contact, User } = require('../models')
const { sendContactNotification, sendContactAutoReply, sendContactReply } = require('../utils/email')

// @desc   Submit contact form
// @route  POST /api/contact
// @access Public
exports.submitContact = async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body

  // Save to DB
  const contact = await Contact.create({
    firstName,
    lastName,
    email,
    subject,
    message,
    ipAddress: req.ip,
  })

  // Send emails (non-blocking — don't fail the response if email fails)
  try {
    await Promise.all([
      sendContactNotification({ firstName, lastName, email, subject, message }),
      sendContactAutoReply({ firstName, email }),
    ])
  } catch (emailError) {
    console.error('Email send error:', emailError.message)
  }

  res.status(201).json({
    success: true,
    message: 'Message received! I\'ll respond within 24 hours.',
    data: contact,
  })
}

// @desc   Get all contact messages
// @route  GET /api/contact
// @access Admin
exports.getMessages = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query

  const query = {}
  if (status) query.status = status

  const skip = (page - 1) * limit
  const [messages, total] = await Promise.all([
    Contact.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email')
      .populate('replies.sentBy', 'name email'),
    Contact.countDocuments(query),
  ])

  res.json({
    success: true,
    count: messages.length,
    total,
    pages: Math.ceil(total / limit),
    data: messages,
  })
}

// @desc   Update message status
// @route  PATCH /api/contact/:id/status
// @access Admin
exports.updateStatus = async (req, res) => {
  const { status } = req.body
  const allowed = ['unread', 'read', 'replied']
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' })
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  )
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Message not found.' })
  }
  res.json({ success: true, data: contact })
}

// @desc   Reply to a contact message (email + DB)
// @route  POST /api/contact/:id/reply
// @access Admin
exports.replyToMessage = async (req, res) => {
  const { reply } = req.body
  if (!reply?.trim()) {
    return res.status(400).json({ success: false, message: 'Reply text is required.' })
  }

  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Message not found.' })
  }

  const linkedUser = await User.findOne({ email: contact.email })
  let emailSent = false

  try {
    await sendContactReply({
      to: contact.email,
      firstName: contact.firstName,
      subject: contact.subject,
      originalMessage: contact.message,
      reply: reply.trim(),
    })
    emailSent = true
  } catch (emailError) {
    console.error('Reply email error:', emailError.message)
  }

  contact.replies.push({
    text: reply.trim(),
    sentBy: req.user._id,
    emailSent,
  })
  if (linkedUser) contact.user = linkedUser._id
  contact.status = 'replied'
  await contact.save()

  const populated = await Contact.findById(contact._id)
    .populate('user', 'name email')
    .populate('replies.sentBy', 'name email')

  res.json({
    success: true,
    message: emailSent ? 'Reply sent successfully.' : 'Reply saved. Email could not be sent — check SMTP settings.',
    data: populated,
  })
}

// @desc   Delete message
// @route  DELETE /api/contact/:id
// @access Admin
exports.deleteMessage = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id)
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Message not found.' })
  }
  res.json({ success: true, message: 'Message deleted.' })
}
