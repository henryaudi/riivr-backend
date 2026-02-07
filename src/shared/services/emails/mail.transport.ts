import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as postmark from 'postmark';
import Logger from 'bunyan';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';
// import sendGridMail from '@sendgrid/mail';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailOptions');

const postmarkClient = config.POSTMARK_API_KEY ? new postmark.ServerClient(config.POSTMARK_API_KEY) : null;
// sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      await this.devEmailSender(receiverEmail, subject, body);
    } else {
      await this.prodEmailSender(receiverEmail, subject, body);
    }
  }

  private async devEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const transporter: Mail = nodemailer.createTransport({
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
    if (!postmarkClient) {
      log.error('Postmark client is not initialized');
      throw new BadRequestError('Email service is not configured');
    }

    const mailOptions: IMailOptions = {
      from: `Riivr App <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject: subject,
      html: body
    };

    try {
      const postmarkMessage = MailTransport.toPostmarkMessage(mailOptions);
      await postmarkClient.sendEmail(postmarkMessage);
      log.info('Production Email sent successfully via Postmark to %s', receiverEmail);
    } catch (error) {
      log.error('Error sending email in production:', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private static toPostmarkMessage(mailOptions: IMailOptions): postmark.Models.Message {
    return {
      From: mailOptions.from,
      To: mailOptions.to,
      Subject: mailOptions.subject,
      HtmlBody: mailOptions.html
    };
  }
}

export const mailTransport: MailTransport = new MailTransport();
