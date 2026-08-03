const nodemailer = require('nodemailer');

const getFrontendUrl = () => {
  // Use FRONTEND_URL from environment or fallback to production URL
  return (process.env.FRONTEND_URL || 'https://west-chemist-clinic-website.vercel.app').replace(/\/$/, '');
};

// Create the nodemailer transport based on environment variables
const createTransporter = () => {
  // If SMTP configs are generic placeholder values, log it and return null for mock behavior
  if (
    !process.env.EMAIL_USER || 
    process.env.EMAIL_USER === 'your_smtp_username' ||
    !process.env.EMAIL_HOST
  ) {
    console.log('ℹ️ SMTP email transporter is running in mock mode. Check .env to configure real emails.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '2525'),
    secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send an appointment confirmation email
 * @param {Object} appointment - The booked appointment Mongoose document
 * @param {Object} patient - The patient Mongoose document
 */
const sendBookingConfirmation = async (appointment, patient) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || '"West Chemist" <noreply@westchemist.co.uk>';
  const to = patient.email || 'patient-notifications@westchemistclinic.co.uk';
  const subject = `🏥 Appointment Confirmed - West Chemist`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0d9488; margin: 0;">West Chemist</h2>
        <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Booking Confirmation</p>
      </div>
      
      <p>Dear <strong>${patient.fullName}</strong>,</p>
      <p>Thank you for booking with West Chemist. We are pleased to confirm that your appointment has been scheduled and your identity verification was successful.</p>
      
      <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #0f766e; margin-top: 0; margin-bottom: 10px;">Appointment Ticket</h3>
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="color: #666; padding: 4px 0; width: 120px;">Patient:</td>
            <td><strong>${patient.fullName}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Mobile:</td>
            <td><strong>${patient.mobile}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Clinical Service:</td>
            <td><strong>${appointment.service}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Location:</td>
            <td><strong>${appointment.clinic}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Date:</td>
            <td><strong>${appointment.date}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Time Slot:</td>
            <td><strong style="color: #0d9488; font-size: 16px;">${appointment.time}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">ID Status:</td>
            <td><strong style="color: #16a34a;">✅ Verified</strong></td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 13px; color: #666;">
        <strong>Important Information:</strong><br>
        Please arrive 5 minutes before your scheduled appointment time. If you need to reschedule or cancel your appointment, please contact the clinic directly at least 24 hours in advance.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      
      <div style="text-align: center; color: #999; font-size: 12px;">
        <p>This is an automated message, please do not reply directly to this email.</p>
        <p>🔒 Secure & NHS Accredited Clinical Services</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`\n=================== [MOCK EMAIL SENT] ===================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Patient: ${patient.fullName} (${patient.mobile})`);
    console.log(`Service: ${appointment.service} at ${appointment.clinic}`);
    console.log(`Date & Time: ${appointment.date} at ${appointment.time}`);
    console.log(`=========================================================\n`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent
    });
    console.log(`📧 Confirmation email successfully sent: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send confirmation email: ${error.message}`);
  }
};

/**
 * Send an identity verification status email
 * @param {Object} verification - The verification Mongoose document
 * @param {Object} patient - The patient Mongoose document
 */
const sendVerificationResult = async (verification, patient) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || '"West Chemist" <noreply@westchemist.co.uk>';
  const to = patient.email || 'patient-notifications@westchemistclinic.co.uk';
  
  const isApproved = verification.status === 'approved';
  const subject = isApproved 
    ? `🛡️ ID Verification Approved - West Chemist Clinic` 
    : `⚠️ ID Verification Action Required - West Chemist Clinic`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0d9488; margin: 0;">West Chemist</h2>
        <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Identity Verification Status</p>
      </div>
      
      <p>Dear <strong>${patient.fullName}</strong>,</p>
      
      ${isApproved ? `
        <p>We are pleased to inform you that your identity verification check has been successfully completed and approved.</p>
        <div style="background-color: #f0fdfa; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 4px; color: #15803d;">
          <strong>Status: APPROVED</strong><br>
          Your uploaded ${verification.idType.toUpperCase()} met all necessary safety and compliance checks.
        </div>
      ` : `
        <p>Unfortunately, we could not automatically verify your identity with the uploaded document.</p>
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px; color: #b91c1c;">
          <strong>Status: REJECTED / MANUAL REVIEW</strong><br>
          The document was either unclear or did not pass our automated compliance checks.
        </div>
        <p>A clinic agent will review your document shortly or contact you to arrange manual ID verification upon arrival.</p>
      `}
      
      <div style="margin-top: 20px; font-size: 13px; color: #555;">
        <h4>Document Compliance Scorecard:</h4>
        <ul>
          <li>MRZ Code Check: <strong>${verification.checks.mrz.toUpperCase()}</strong></li>
          <li>Anti-Blur Check: <strong>${verification.checks.blur.toUpperCase()}</strong></li>
          <li>Anti-Tampering Check: <strong>${verification.checks.tampering.toUpperCase()}</strong></li>
          <li>Image Readability Score: <strong>${verification.checks.readable.toUpperCase()}</strong></li>
        </ul>
      </div>

      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      
      <div style="text-align: center; color: #999; font-size: 12px;">
        <p>West Chemist Compliance Team · NHS GPhC Registered Pharmacy</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`\n=================== [MOCK EMAIL SENT] ===================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Verification: ${verification.idType} (${verification.status})`);
    console.log(`Checks: MRZ:${verification.checks.mrz}, Blur:${verification.checks.blur}, Tamper:${verification.checks.tampering}`);
    console.log(`=========================================================\n`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent
    });
    console.log(`📧 Verification status email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send verification email: ${error.message}`);
  }
};

/**
 * Send an appointment request received email (awaiting audit)
 * @param {Object} appointment - The booked appointment Mongoose document
 * @param {Object} patient - The patient Mongoose document
 */
const sendBookingReceived = async (appointment, patient) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || '"West Chemist" <noreply@westchemist.co.uk>';
  const to = patient.email || 'patient-notifications@westchemistclinic.co.uk';
  const subject = `🏥 Appointment Request Received - West Chemist Clinic`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #d97706; margin: 0;">West Chemist</h2>
        <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Clinical Booking Under Review</p>
      </div>
      
      <p>Dear <strong>${patient.fullName}</strong>,</p>
      <p>We have received your appointment request. In compliance with GPhC regulations, a Superintendent Pharmacist will verify your identity verification document and audit your booking shortly.</p>
      
      <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #b45309; margin-top: 0; margin-bottom: 10px;">Booking Details</h3>
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="color: #666; padding: 4px 0; width: 120px;">Patient:</td>
            <td><strong>${patient.fullName}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Clinical Service:</td>
            <td><strong>${appointment.service}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Location:</td>
            <td><strong>${appointment.clinic}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Date:</td>
            <td><strong>${appointment.date}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Time Slot:</td>
            <td><strong style="color: #b45309; font-size: 16px;">${appointment.time}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">ID Status:</td>
            <td><strong style="color: #d97706;">⏳ Awaiting Audit</strong></td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 13px; color: #666;">
        Once approved, you will receive a confirmation email with your secured clinical slot details. You can track the status of your booking at any time via the patient portal.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      
      <div style="text-align: center; color: #999; font-size: 12px;">
        <p>This is an automated message, please do not reply directly to this email.</p>
        <p>🔒 Secure & NHS Accredited Clinical Services</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`\n=================== [MOCK EMAIL SENT] ===================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Patient: ${patient.fullName} (${patient.mobile})`);
    console.log(`Service: ${appointment.service} at ${appointment.clinic}`);
    console.log(`Date & Time: ${appointment.date} at ${appointment.time}`);
    console.log(`Status: Awaiting Audit`);
    console.log(`=========================================================\n`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent
    });
    console.log(`📧 Booking request received email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send booking received email: ${error.message}`);
  }
};

/**
 * Send an email notifying the patient that their slot needs rescheduling due to clinic changes
 * @param {Object} appointment - The booked appointment Mongoose document
 * @param {Object} patient - The patient Mongoose document
 */
const sendRescheduleNotice = async (appointment, patient) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || '"West Chemist" <noreply@westchemist.co.uk>';
  const to = patient.email || 'patient-notifications@westchemistclinic.co.uk';
  const subject = `⚠️ Reschedule Required - West Chemist Clinic`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #ef4444; margin: 0;">West Chemist</h2>
        <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Clinical Booking Action Required</p>
      </div>
      
      <p>Dear <strong>${patient.fullName}</strong>,</p>
      <p>We are contacting you because our clinic's operational schedule has changed for the date of your upcoming appointment. As a result, your original slot is no longer available.</p>
      
      <div style="background-color: #fff1f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #9f1239; margin-top: 0; margin-bottom: 10px;">Affected Appointment Details</h3>
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="color: #666; padding: 4px 0; width: 120px;">Clinical Service:</td>
            <td><strong>${appointment.service}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Location:</td>
            <td><strong>${appointment.clinic}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Original Date:</td>
            <td><strong>${appointment.date}</strong></td>
          </tr>
          <tr>
            <td style="color: #666; padding: 4px 0;">Original Time:</td>
            <td><strong style="color: #ef4444; font-size: 16px;">${appointment.time}</strong></td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 14px; color: #333;">
        Please log in to the <strong>Patient Tracking Center</strong> using your registered phone number (+44 ${patient.mobile}) to select a new date and time slot for your appointment immediately.
      </p>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${getFrontendUrl()}/track-booking?mobile=${encodeURIComponent(patient.mobile)}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Reschedule My Appointment
        </a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      
      <div style="text-align: center; color: #999; font-size: 12px;">
        <p>This is an automated message, please do not reply directly to this email.</p>
        <p>🔒 Secure & NHS Accredited Clinical Services</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`\n=================== [MOCK EMAIL SENT] ===================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Patient: ${patient.fullName} (${patient.mobile})`);
    console.log(`Service: ${appointment.service} at ${appointment.clinic}`);
    console.log(`Action Required: RESCHEDULE slot ${appointment.date} at ${appointment.time}`);
    console.log(`=========================================================\n`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlContent
    });
    console.log(`📧 Reschedule notice email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send reschedule notice email: ${error.message}`);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendVerificationResult,
  sendBookingReceived,
  sendRescheduleNotice
};
