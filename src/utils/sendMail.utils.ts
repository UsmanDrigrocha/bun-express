import nodemailer,{ type SentMessageInfo }  from 'nodemailer';

async function sendMail(
    sendMailto: string | string[],
    mailSubject: string,
    mailHTMLBody: string
): Promise<boolean> {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_FROM,
                pass: process.env.MAIL_PASSKEY,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const info: SentMessageInfo = await transporter.sendMail({
            from: `"NoReply" <${process.env.MAIL_FROM}>`,
            to: sendMailto,
            subject: mailSubject,
            text: mailSubject,
            html: mailHTMLBody,
        });
        console.log(`✅ Mail Sent to ${sendMailto} about ${mailSubject}`);
        return true;
    } catch (err: any) {
        console.error(`⚠️ Error Sending Mail to ${sendMailto} about ${mailSubject}, Error: ${err?.message}`);
        return false;
    }
}

export default sendMail;