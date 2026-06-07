const { Booking } = require('../models')
const { sendEmail } = require('../utils/email')

// @desc   Submit a booking / meeting request
// @route  POST /api/booking
// @access Private (must be logged in)
exports.submitBooking = async (req, res) => {
  const {
    websiteType,
    name,
    address,
    companyName,
    projectName,
    phoneNumber,
    projectDescription,
    budget,
    deadline,
    email,
    userEmail,
    additionalNotes,
  } = req.body
  const logoFile = req.file

  const logoUrl = logoFile ? `/uploads/${logoFile.filename}` : null
  const finalEmail = email || userEmail || req.user?.email || '';

  // 1. Log the booking request in the MongoDB database
  const booking = await Booking.create({
    websiteType,
    name,
    address,
    companyName,
    projectName,
    phoneNumber,
    projectDescription,
    budget,
    deadline,
    userEmail: finalEmail,
    logoUrl,
    additionalNotes,
  })

  // 2. Prepare the email body
  const logoInfo = logoFile
    ? `<p><strong style="color:#C9B79C;">Logo:</strong> ${logoFile.originalname} (attached as file)</p>`
    : `<p><strong style="color:#C9B79C;">Logo:</strong> Not provided</p>`

  const logoPath = logoFile ? logoFile.path : null

  try {
    await sendEmail({
      to: ['godswillm23456@gmail.com', 'goswillmm23456@gmail.com'],
      subject: `[Mixzy Portfolio] New Project Booking from ${name}`,
      html: `
        <div style="font-family:'DM Sans',sans-serif;max-width:640px;margin:0 auto;background:#121212;color:#F5F1EA;padding:40px;border-radius:8px;">
          <div style="border-bottom:2px solid #0f4c5c;padding-bottom:20px;margin-bottom:30px;">
            <h2 style="color:#C9B79C;margin:0;font-weight:300;font-size:1.6rem;letter-spacing:0.05em;">
              📅 New Project Booking Request
            </h2>
            <p style="color:#7A8A91;font-size:0.8rem;margin-top:8px;letter-spacing:1.1em;text-transform:uppercase;">
              Logged in Portfolio Database & Submitted via Book a Meeting
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Client Name</span><br/>
                <span style="color:#F5F1EA;font-size:1rem;margin-top:4px;display:block;">${name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Company Name</span><br/>
                <span style="color:#F5F1EA;font-size:1rem;margin-top:4px;display:block;">${companyName || 'Not provided'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Website / Project Name</span><br/>
                <span style="color:#F5F1EA;font-size:1rem;margin-top:4px;display:block;">${projectName || 'Not provided'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Phone Number</span><br/>
                <span style="color:#F5F1EA;font-size:1rem;margin-top:4px;display:block;">${phoneNumber}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Office Address</span><br/>
                <span style="color:#F5F1EA;font-size:1rem;margin-top:4px;display:block;">${address}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Type of Website Needed</span><br/>
                <span style="color:#C9B79C;font-size:1rem;font-weight:500;margin-top:4px;display:block;">${websiteType}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Project Budget</span><br/>
                <span style="color:#C9B79C;font-size:1.1rem;font-weight:600;margin-top:4px;display:block;">${budget}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Target Deadline</span><br/>
                <span style="color:#F5F1EA;font-size:1rem;margin-top:4px;display:block;">${deadline}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Project Description</span><br/>
                <span style="color:#B8C2C7;font-size:0.95rem;margin-top:4px;display:block;white-space:pre-wrap;line-height:1.6;">${projectDescription}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Additional Notes</span><br/>
                <span style="color:#B8C2C7;font-size:0.95rem;margin-top:4px;display:block;white-space:pre-wrap;line-height:1.6;">${additionalNotes || 'None'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Client Email Account</span><br/>
                <span style="color:#F5F1EA;font-size:1rem;margin-top:4px;display:block;">${finalEmail || 'Authenticated user'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;">
                <span style="color:#7A8A91;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;">Company Logo Attachment</span><br/>
                <span style="color:#F5F1EA;font-size:0.9rem;margin-top:4px;display:block;">${logoFile ? `✅ ${logoFile.originalname} (${(logoFile.size / 1024).toFixed(1)} KB)` : '❌ Not uploaded'}</span>
              </td>
            </tr>
          </table>

          <div style="background:rgba(15,76,92,0.15);border-left:3px solid #0f4c5c;padding:16px;margin:24px 0;border-radius:0 4px 4px 0;">
            <p style="margin:0;color:#B8C2C7;font-size:0.85rem;line-height:1.7;">
              <strong style="color:#C9B79C;">Action Required:</strong> This request has been logged inside your Admin Dashboard as well. You can view all requests and files directly at your dashboard.
            </p>
          </div>

          <a href="mailto:${finalEmail}" style="display:inline-block;background:linear-gradient(135deg,#0f4c5c,#1a6b80);color:#F5F1EA;padding:12px 28px;text-decoration:none;font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;border-radius:4px;margin-top:8px;">
            Reply to Client
          </a>

          <p style="color:#7A8A91;font-size:0.75rem;margin-top:36px;border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
            Mixzy Portfolio · Booking Notification · godswillm23456@gmail.com
          </p>
        </div>
      `,
      attachments: logoPath
        ? [{ filename: logoFile.originalname, path: logoPath }]
        : [],
    })

    res.status(201).json({
      success: true,
      message: 'Project booking request submitted and logged successfully!',
      data: booking,
    })
  } catch (err) {
    console.error('Booking email notification error:', err.message)
    // Send 201 because it was still successfully created and logged in the database
    res.status(201).json({
      success: true,
      message: 'Project booking request logged in database, but email notification failed.',
      data: booking,
    })
  }
}

// @desc   Get all booking requests
// @route  GET /api/booking
// @access Private/Admin
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort('-createdAt')
    res.status(200).json({ success: true, count: bookings.length, data: bookings })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @desc   Update a booking request's status
// @route  PUT /api/booking/:id/status
// @access Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }
    res.status(200).json({ success: true, data: booking })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @desc   Delete a booking request
// @route  DELETE /api/booking/:id
// @access Private/Admin
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }
    res.status(200).json({ success: true, message: 'Booking request deleted successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

