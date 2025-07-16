import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                <div style="text-align: center; padding: 20px 0;">
                    <h2 style="color: #333;">${subject}</h2>
                </div>
                <div style="padding: 20px; line-height: 1.6; color: #666;">
                    ${text}
                </div>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888;">
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: 'subedirohit49@gmail.com',
            to: email,
            subject: subject,
            text: text,
            html: htmlContent
        });
    }
    catch (error) {
        console.log(error);
    }
}



export default sendEmail;