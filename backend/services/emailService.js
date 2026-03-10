const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Send approval notification email
const sendApprovalNotification = async (email, recipientName, reportDetails, action, comments = '') => {
  try {
    const { 
      id, 
      registration_number, 
      vehicle_type, 
      hospital_name, 
      repair_details, 
      engineer_name,
      status 
    } = reportDetails;

    const reportLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/repairs/${id}`;

    const actionText = action === 'approved' ? '✅ APPROVED' : '❌ REJECTED';
    const actionColor = action === 'approved' ? '#28a745' : '#dc3545';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .header { background-color: #007bff; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .action-badge { 
              display: inline-block; 
              background-color: ${actionColor}; 
              color: white; 
              padding: 10px 15px; 
              border-radius: 5px; 
              font-weight: bold; 
              margin: 10px 0;
            }
            .details-section { 
              background-color: white; 
              padding: 15px; 
              margin: 10px 0; 
              border-left: 4px solid #007bff; 
            }
            .detail-row { margin: 8px 0; }
            .detail-label { font-weight: bold; color: #007bff; }
            .button { 
              display: inline-block; 
              background-color: #007bff; 
              color: white; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 15px 0;
            }
            .footer { 
              background-color: #f0f0f0; 
              padding: 15px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-radius: 0 0 5px 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Vehicle Repair Report - ${actionText}</h2>
            </div>

            <div class="content">
              <p>Dear ${recipientName},</p>

              <p>A repair report has been <strong>${action}</strong>. Please review the details below:</p>

              <div class="action-badge">${actionText}</div>

              <div class="details-section">
                <h3 style="margin-top: 0; color: #007bff;">📋 Report Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Report ID:</span> #${id}
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Vehicle Registration:</span> ${registration_number}
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Vehicle Type:</span> ${vehicle_type}
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Hospital/MOH Office:</span> ${hospital_name}
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Submitted By:</span> ${engineer_name}
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Complaint/Issues:</span><br/>
                  <p style="margin: 5px 0; padding: 10px; background-color: #f5f5f5; border-radius: 3px;">
                    ${repair_details}
                  </p>
                </div>
              </div>

              ${comments ? `
                <div class="details-section">
                  <h3 style="margin-top: 0; color: #007bff;">💬 Comments</h3>
                  <p>${comments}</p>
                </div>
              ` : ''}

              <p style="text-align: center;">
                <a href="${reportLink}" class="button">View Full Report</a>
              </p>

              <p style="color: #666; font-size: 14px;">
                Please log in to the system to view more details and take any necessary action.
              </p>
            </div>

            <div class="footer">
              <p>Vehicle Repair Management System</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: `Report ${actionText} - Vehicle ${registration_number}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent to ${email} for report #${id}`);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error);
    // Don't throw - just log so it doesn't break the approval process
    return false;
  }
};

// Send confirmation email when report is submitted
const sendReportSubmissionNotification = async (email, recipientName, reportDetails) => {
  try {
    const { 
      id, 
      registration_number, 
      vehicle_type, 
      hospital_name, 
      repair_details 
    } = reportDetails;

    const reportLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/repairs/${id}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .header { background-color: #28a745; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .status-badge { 
              display: inline-block; 
              background-color: #ffc107; 
              color: #333; 
              padding: 10px 15px; 
              border-radius: 5px; 
              font-weight: bold; 
              margin: 10px 0;
            }
            .details-section { 
              background-color: white; 
              padding: 15px; 
              margin: 10px 0; 
              border-left: 4px solid #28a745; 
            }
            .detail-row { margin: 8px 0; }
            .detail-label { font-weight: bold; color: #28a745; }
            .button { 
              display: inline-block; 
              background-color: #28a745; 
              color: white; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 15px 0;
            }
            .footer { 
              background-color: #f0f0f0; 
              padding: 15px; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              border-radius: 0 0 5px 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Report Submitted Successfully</h2>
            </div>

            <div class="content">
              <p>Dear ${recipientName},</p>

              <p>Your vehicle repair report has been successfully submitted and is now pending review by the Subject Officer.</p>

              <div class="status-badge">⏳ PENDING REVIEW</div>

              <div class="details-section">
                <h3 style="margin-top: 0; color: #28a745;">📋 Your Report Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Report ID:</span> #${id}
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Vehicle:</span> ${registration_number} (${vehicle_type})
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Hospital:</span> ${hospital_name}
                </div>
              </div>

              <p style="text-align: center;">
                <a href="${reportLink}" class="button">View Your Report</a>
              </p>

              <p style="color: #666; font-size: 14px;">
                You will receive an email notification when the Subject Officer reviews your report.
              </p>
            </div>

            <div class="footer">
              <p>Vehicle Repair Management System</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: `Report Submitted - Vehicle ${registration_number}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✉️ Submission confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error);
    return false;
  }
};

module.exports = {
  sendApprovalNotification,
  sendReportSubmissionNotification
};
