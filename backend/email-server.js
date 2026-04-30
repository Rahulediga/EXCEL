/**
 * EcoWaste — Critical Alert Email Service
 * Node.js + Express + Nodemailer
 * Sends detailed critical alert emails to the admin
 */

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.EMAIL_PORT || 3001;

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// ── Gmail SMTP Transporter ──
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "edigarahul2005@gmail.com",
    pass: process.env.GMAIL_APP_PASS || "ltbw drmr huqm ktui",
  },
});

// Verify transporter on startup
transporter.verify((err, success) => {
  if (err) {
    console.error("[EMAIL] Transporter verification failed:", err.message);
  } else {
    console.log("[EMAIL] SMTP transporter is ready to send emails");
  }
});

// ── Helper: Build HTML email for a single critical alert ──
function buildSingleAlertHTML(alert) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background:#0f1923; font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1923; padding:32px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a2332; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.3);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626,#b91c1c); padding:28px 32px;">
              <h1 style="margin:0; color:#fff; font-size:22px;">⚠️ Critical Alert — EcoWaste</h1>
              <p style="margin:6px 0 0; color:#fecaca; font-size:13px;">Immediate attention required</p>
            </td>
          </tr>

          <!-- Alert Details -->
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1923; border-radius:8px; border-left:4px solid #dc2626;">
                <tr>
                  <td style="padding:20px 24px;">
                    <h2 style="margin:0 0 8px; color:#f87171; font-size:18px;">${alert.title}</h2>
                    <p style="margin:0 0 16px; color:#94a3b8; font-size:14px; line-height:1.6;">${alert.message}</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Alert Type</span><br/>
                          <span style="color:#e2e8f0; font-size:14px; font-weight:600;">${alert.type || "System Alert"}</span>
                        </td>
                        <td style="padding:6px 0;">
                          <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Severity</span><br/>
                          <span style="color:#f87171; font-size:14px; font-weight:700;">🔴 CRITICAL</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Bin ID</span><br/>
                          <span style="color:#e2e8f0; font-size:14px; font-weight:600;">${alert.bin || "N/A"}</span>
                        </td>
                        <td style="padding:6px 0;">
                          <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Reported</span><br/>
                          <span style="color:#e2e8f0; font-size:14px; font-weight:600;">${alert.timestamp || new Date().toLocaleString()}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Required -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b; border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px; color:#fbbf24; font-size:13px; font-weight:700;">⚡ ACTION REQUIRED</p>
                    <p style="margin:0; color:#94a3b8; font-size:13px; line-height:1.5;">
                      Please log in to the EcoWaste Dashboard to acknowledge and resolve this alert immediately.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f1923; padding:20px 32px; border-top:1px solid #1e293b;">
              <p style="margin:0; color:#475569; font-size:11px; text-align:center;">
                🌱 EcoWaste IoT Smart Waste Management System<br/>
                This is an automated notification. Do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

// ── Helper: Build HTML email for multiple critical alerts ──
function buildMultiAlertHTML(alerts) {
  const alertRows = alerts
    .map(
      (alert) => `
      <tr>
        <td style="padding:16px 20px; border-bottom:1px solid #1e293b;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <h3 style="margin:0 0 6px; color:#f87171; font-size:15px;">🔴 ${alert.title}</h3>
                <p style="margin:0 0 10px; color:#94a3b8; font-size:13px; line-height:1.5;">${alert.message}</p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:20px;">
                      <span style="color:#64748b; font-size:11px;">TYPE:</span>
                      <span style="color:#e2e8f0; font-size:12px; font-weight:600; margin-left:4px;">${alert.type || "System"}</span>
                    </td>
                    <td style="padding-right:20px;">
                      <span style="color:#64748b; font-size:11px;">BIN:</span>
                      <span style="color:#e2e8f0; font-size:12px; font-weight:600; margin-left:4px;">${alert.bin || "N/A"}</span>
                    </td>
                    <td>
                      <span style="color:#64748b; font-size:11px;">TIME:</span>
                      <span style="color:#e2e8f0; font-size:12px; font-weight:600; margin-left:4px;">${alert.timestamp || "Just now"}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background:#0f1923; font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1923; padding:32px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a2332; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.3);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626,#b91c1c); padding:28px 32px;">
              <h1 style="margin:0; color:#fff; font-size:22px;">⚠️ ${alerts.length} Critical Alert${alerts.length > 1 ? "s" : ""} — EcoWaste</h1>
              <p style="margin:6px 0 0; color:#fecaca; font-size:13px;">Immediate attention required • ${new Date().toLocaleString()}</p>
            </td>
          </tr>

          <!-- Summary -->
          <tr>
            <td style="padding:24px 32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#7f1d1d; border-radius:8px;">
                <tr>
                  <td style="padding:14px 20px; text-align:center;">
                    <span style="color:#fca5a5; font-size:28px; font-weight:800;">${alerts.length}</span>
                    <span style="color:#fca5a5; font-size:14px; margin-left:8px;">critical alert${alerts.length > 1 ? "s" : ""} detected</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert List -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1923; border-radius:8px; border-left:4px solid #dc2626;">
                ${alertRows}
              </table>
            </td>
          </tr>

          <!-- Action -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b; border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px; color:#fbbf24; font-size:13px; font-weight:700;">⚡ ACTION REQUIRED</p>
                    <p style="margin:0; color:#94a3b8; font-size:13px; line-height:1.5;">
                      Please log in to the EcoWaste Dashboard to acknowledge and resolve these alerts immediately.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f1923; padding:20px 32px; border-top:1px solid #1e293b;">
              <p style="margin:0; color:#475569; font-size:11px; text-align:center;">
                🌱 EcoWaste IoT Smart Waste Management System<br/>
                This is an automated notification. Do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

// ═══════════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════════

/**
 * POST /send-alert
 * Send a single critical alert email
 * Body: { alert: { id, title, message, type, severity, bin, timestamp } }
 */
app.post("/send-alert", async (req, res) => {
  try {
    const { alert, recipientEmail } = req.body;

    if (!alert) {
      return res.status(400).json({ error: "Missing alert data" });
    }

    const toEmail = recipientEmail || "edigarahul2005@gmail.com";

    const mailOptions = {
      from: '"🌱 EcoWaste Alerts" <edigarahul2005@gmail.com>',
      to: toEmail,
      subject: `🔴 CRITICAL: ${alert.title} — ${alert.bin || "EcoWaste"}`,
      html: buildSingleAlertHTML(alert),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Alert email sent to ${toEmail}: ${info.messageId}`);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("[EMAIL] Failed to send alert:", err.message);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

/**
 * POST /send-alerts
 * Send multiple critical alerts in one email
 * Body: { alerts: [ { id, title, message, type, severity, bin, timestamp }, ... ] }
 */
app.post("/send-alerts", async (req, res) => {
  try {
    const { alerts, recipientEmail } = req.body;

    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
      return res.status(400).json({ error: "Missing or empty alerts array" });
    }

    const toEmail = recipientEmail || "edigarahul2005@gmail.com";

    const mailOptions = {
      from: '"🌱 EcoWaste Alerts" <edigarahul2005@gmail.com>',
      to: toEmail,
      subject: `🔴 CRITICAL: ${alerts.length} Alert${alerts.length > 1 ? "s" : ""} Require Attention — EcoWaste`,
      html: buildMultiAlertHTML(alerts),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Batch alert email sent to ${toEmail} (${alerts.length} alerts): ${info.messageId}`);
    res.json({ success: true, messageId: info.messageId, alertCount: alerts.length });
  } catch (err) {
    console.error("[EMAIL] Failed to send batch alert:", err.message);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

/**
 * POST /send-report
 * Send a report PDF as an email attachment
 * Body: { recipientEmail, reportTitle, reportPeriod, reportType, pdfBase64, fileName }
 */
app.post("/send-report", async (req, res) => {
  try {
    const { recipientEmail, reportTitle, reportPeriod, reportType, pdfBase64, fileName } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ error: "Missing PDF data" });
    }

    const toEmail = recipientEmail || "edigarahul2005@gmail.com";
    const pdfFileName = fileName || "EcoWaste_Report.pdf";
    const reportLabel = reportType ? reportType.toUpperCase() : "REPORT";

    const reportEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0; padding:0; background:#0f1923; font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1923; padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#1a2332; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.3);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#10b981,#059669); padding:28px 32px;">
                <h1 style="margin:0; color:#fff; font-size:22px;">📊 EcoWaste Report</h1>
                <p style="margin:6px 0 0; color:#d1fae5; font-size:13px;">Your waste management report is attached</p>
              </td>
            </tr>

            <!-- Report Details -->
            <tr>
              <td style="padding:28px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1923; border-radius:8px; border-left:4px solid #10b981;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <h2 style="margin:0 0 12px; color:#34d399; font-size:18px;">${reportTitle || "Waste Management Report"}</h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:6px 0;">
                            <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Report Type</span><br/>
                            <span style="color:#e2e8f0; font-size:14px; font-weight:600;">📋 ${reportLabel}</span>
                          </td>
                          <td style="padding:6px 0;">
                            <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Period</span><br/>
                            <span style="color:#e2e8f0; font-size:14px; font-weight:600;">${reportPeriod || "N/A"}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;">
                            <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Generated</span><br/>
                            <span style="color:#e2e8f0; font-size:14px; font-weight:600;">${new Date().toLocaleString()}</span>
                          </td>
                          <td style="padding:6px 0;">
                            <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Sent To</span><br/>
                            <span style="color:#e2e8f0; font-size:14px; font-weight:600;">${toEmail}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Attachment Info -->
            <tr>
              <td style="padding:0 32px 28px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b; border-radius:8px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0 0 4px; color:#10b981; font-size:13px; font-weight:700;">📎 ATTACHMENT</p>
                      <p style="margin:0; color:#94a3b8; font-size:13px; line-height:1.5;">
                        The full report PDF <strong style="color:#e2e8f0;">${pdfFileName}</strong> is attached to this email.
                        Open it to view detailed waste breakdown, charts, and statistics.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#0f1923; padding:20px 32px; border-top:1px solid #1e293b;">
                <p style="margin:0; color:#475569; font-size:11px; text-align:center;">
                  🌱 EcoWaste IoT Smart Waste Management System<br/>
                  This is an automated report delivery. Do not reply to this email.
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

    const mailOptions = {
      from: '"🌱 EcoWaste Reports" <edigarahul2005@gmail.com>',
      to: toEmail,
      subject: `📊 ${reportTitle || "EcoWaste Report"} — ${reportPeriod || reportLabel}`,
      html: reportEmailHTML,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBase64,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Report emailed to ${toEmail}: ${info.messageId} (${pdfFileName})`);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("[EMAIL] Failed to send report:", err.message);
    res.status(500).json({ error: "Failed to send report email", details: err.message });
  }
});

/**
 * GET /health
 */
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "EcoWaste Email Service", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ status: "online", service: "EcoWaste Email Notification Service", version: "1.0.0" });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🌱 EcoWaste Email Service running on http://localhost:${PORT}`);
  console.log(`   POST /send-alert   → Send single critical alert email`);
  console.log(`   POST /send-alerts  → Send batch critical alert email`);
  console.log(`   POST /send-report  → Send report PDF via email\n`);
});
