const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const path = require('path');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
})

app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body
    try {
        const info = await transporter.sendMail({
            from: '"Aryan Sanam"<vishalsanam2024@gmail.com>',
            to: to,
            subject: subject,
            text: text,
            // html: '<h1>Helo</h1>'
            attachments: [
                {
                    filename: "data.pdf",
                    path: path.join(__dirname, "files", "data.pdf")
                }
            ]
        })
        res.json({ message: 'Email Send Successfully', info })
    } catch (error) {
        res.status(500).json({ message: 'failed to send email', error })
    }
})

app.get('/', (req, res) => {
    res.render('mailpage');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});