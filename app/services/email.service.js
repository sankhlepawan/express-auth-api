const nodemailer = require("nodemailer");
const config = require("../config/email.config");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const logger = require("../utils/logger");

async function getTransporter() {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });

    // Optional: verify connection before using
    await transporter.verify();

    if (transporter) {
      // Register handlebars plugin
      transporter.use(
        "compile",
        hbs({
          viewEngine: {
            partialsDir: path.resolve(__dirname, "../templates"),
            defaultLayout: false,
          },
          viewPath: path.resolve(__dirname, "../templates"),
          extName: ".hbs",
        }),
      );
    }

    return transporter;
  } catch (err) {
    logger.error("🚨 Failed to create transporter:", err.message);
    return null; // Don't crash the app
  }
}

exports.sendEmail = async ({ to, subject, template, context }) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      logger.warn("⚠️ Email skipped: transporter not initialized");
      return;
    }
    const info = transporter.sendMail({
      from: config.from,
      to,
      subject,
      template, // name of the .hbs file
      context, // variables for the template
    });

    logger.info({
      event: "email_sent",
      to,
      subject,
      template,
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
    });

    //  console.log("📨 Email sent:", info.messageId);
  } catch (err) {
    logger.error({
      event: "email_failed",
      to,
      subject,
      template,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
    // throw err;
  }
};
