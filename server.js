const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST route to handle form submissions
app.post("/api/send-enquiry", async (req, res) => {
  const {
    Name,
    email,
    Phone,
    "Company Name": CompanyName,
    venue,
    Message,
    Services,
    eventDate,
  } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. Admin email
   const adminMailOptions = {
  from: `"Website Enquiry" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "📩 New Event Enquiry from " + Name,
  html: `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 700px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px;">
        <div style="text-align: center;">
          <img src="https://i.postimg.cc/h4ZkBQjM/TAMSA-LOGO-1-page-0001-removebg-preview.png" alt="Tamsa IMS Logo" style="max-width: 150px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #333;">New Enquiry Received</h2>
        <p style="font-size: 15px; color: #555;">You’ve received a new event enquiry from your website. Here are the details:</p>
        
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name:</td>
            <td style="padding: 8px;">${Name}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Phone:</td>
            <td style="padding: 8px;">${Phone}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Company Name:</td>
            <td style="padding: 8px;">${CompanyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Venue:</td>
            <td style="padding: 8px;">${venue}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Event Date:</td>
            <td style="padding: 8px;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Services Required:</td>
            <td style="padding: 8px;">${Services}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Message:</td>
            <td style="padding: 8px;">${Message}</td>
          </tr>
        </table>

        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          This message was generated from the enquiry form on the Tamsa Integrated website.
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://tamsaims.com" style="text-decoration: none; color: #007BFF;">Visit Website</a>
          <p style="margin: 10px 0 0; font-size: 13px; color: #bbb;">&copy; ${new Date().getFullYear()} Tamsa Integrated</p>
        </div>
      </div>
    </div>
  `,
};


    // 2. User confirmation email
    const userMailOptions = {
      from: `"Tamsa Integrated" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We’ve received your enquiry!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/h4ZkBQjM/TAMSA-LOGO-1-page-0001-removebg-preview.png" alt="Tamsa IMS Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #333;">Hi ${Name},</h2>
          <p style="font-size: 16px; color: #555;">
            Thank you for reaching out to <strong>Tamsa Integrated</strong>. We’ve successfully received your enquiry and our team will get back to you shortly.
          </p>
          <p style="font-size: 16px; color: #555;">
            If your query is urgent, please feel free to contact us directly at
            <a href="mailto:ali@tamsaims.com" style="color:rgb(184, 43, 43);">ali@tamsaims.com</a>.
          </p>
          <p style="font-size: 16px; color: #555;">We look forward to helping you create something unforgettable.</p>
          
          <hr style="margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="margin-bottom: 10px;">Follow us for more updates:</p>
            <a href="https://www.instagram.com/tamsaintegrated/" target="_blank" style="margin: 0 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="24">
            </a>
            <a href="https://www.linkedin.com/company/tamsa-events/" target="_blank" style="margin: 0 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24">
            </a>
            <a href="https://wa.me/919703510709?text=Hi%20Tamsa%2C%20I%E2%80%99m%20interested%20in%20your%20event%20management%20services.%20Could%20we%20connect%20to%20discuss%20more%20details%3F" target="_blank" style="margin: 0 10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" width="24">
            </a>

          </div>

          <p style="text-align: center; font-size: 14px; color: #999; margin-top: 30px;">
            &copy; ${new Date().getFullYear()} Tamsa Integrated. All rights reserved.
          </p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ message: "Enquiry and confirmation email sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send enquiry and confirmation" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
