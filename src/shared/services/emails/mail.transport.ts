import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailOptions');

sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      await this.devEmailSender(receiverEmail, subject, body);
    } else {
      await this.prodEmailSender(receiverEmail, subject, body);
    }
  }

  private async devEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const mailOptions: IMailOptions = {
      from: `Riivr App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject: subject,
      html: body
    };

    try {
      await transporter.sendMail(mailOptions);
      log.info('Development mail sent successfully via Ethereal to %s', receiverEmail);
    } catch (error) {
      log.error('Error sending email in development:', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private async prodEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const mailOptions: IMailOptions = {
      from: `Riivr App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject: subject,
      html: body
    };

    try {
      await sendGridMail.send(mailOptions);
      log.info('Production Email sent successfully via SendGrid to %s', receiverEmail);
    } catch (error) {
      log.error('Error sending email in production:', error);
      throw new BadRequestError('Error sending email');
    }
  }
}

export const mailTransport: MailTransport = new MailTransport();
