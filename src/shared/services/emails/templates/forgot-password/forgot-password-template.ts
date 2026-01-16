import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf-8'), {
      username,
      resetLink,
      image_url:
        'https://w7.pngwing.com/pngs/201/134/png-transparent-gray-lock-icon-password-computer-security-scalable-graphics-icon-unlocked-lock-s-noun-project-security-hacker-password-strength-thumbnail.png'
    });
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
