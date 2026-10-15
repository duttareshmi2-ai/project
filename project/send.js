const nodemailer = require("nodemailer");

const emojis = ["🚭", "💪", "🌿", "❤️", "🫁", "🔥", "🙌", "😊"];
const emoji = emojis[Math.floor(Math.random() * emojis.length)];

async function main() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Daily Reminder" <${process.env.GMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    subject: `No smoking for the day ${emoji}`,
    text: `No smoking for the day ${emoji}`,
  });

  console.log("Email sent!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
