// import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { MailerService } from '@nestjs-modules/mailer';
// import { MailError } from './types';
// import { User } from 'src/user/models/user.model';


// @Injectable()
// export class MailService {
//   private logger = new Logger(`MAIL-SERVICE`);

//   constructor(
//     private readonly mailerService: MailerService,
//     private readonly configService: ConfigService,
//   ) {}

//   async resetPassswordEmail(user: User, token: string): Promise<void> {
//     const url = encodeURI(
//       `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${token}`,
//     );

//     await this.sendConfirmation(
//       user.email,
//       `Здравствуйте!
//       Вы начали процесс смены пароля. Чтобы его завершить, нажмите на кнопку ниже`,
//       url,
//       'Смена пароля',
//     );
//   }

//   async sendConfirmation(email: string, text: string, href: string, subject: string) {
//     try {
//       await this.mailerService
//         .sendMail({
//           to: email,
//           from: this.configService.get('EMAIL_USER'),
//           subject: `Новое уведомление на сервисе PrinterParts`,
//           template: 'email-notification',
//           context: {
//             text: text,
//             href: href,
//             subject: subject
//           }
//         })
//         .catch((err: MailError) => {
//           this.logger.error(err)
//         });
//     } catch (e) {
//       this.logger.error(e);
//       throw new BadRequestException(`Mail send user error`);
//     }
//   }
// }
