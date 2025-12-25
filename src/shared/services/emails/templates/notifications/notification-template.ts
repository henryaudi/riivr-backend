import fs from 'fs';
import ejs from 'ejs';
import { INotificationTemplate } from '@notification/interfaces/notification.interface';

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, header, message } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/notification.ejs', 'utf-8'), {
      username,
      header,
      message,
      image_url:
        'https://w7.pngwing.com/pngs/201/134/png-transparent-gray-lock-icon-password-computer-security-scalable-graphics-icon-unlocked-lock-s-noun-project-security-hacker-password-strength-thumbnail.png'
    });
  }
}

export const notificationTemplate: NotificationTemplate = new NotificationTemplate();
