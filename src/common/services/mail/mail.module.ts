// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { MailService } from './mail.service';
// import { join } from 'path';

// @Module({
//   imports: [
//     MailerModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (config: ConfigService) => ({
//         transport: {
//           host: config.get('EMAIL_HOST'),
//           port: config.get('EMAIL_PORT'),
//           secure: true,
//           auth: {
//             user: config.get('EMAIL_USER'),
//             pass: config.get('EMAIL_PASSWORD'),
//           },
//         },
//         defaults: {
//           from: config.get('EMAIL_USER'),
//         },
//         template: {
//           dir: (join(__dirname, '..', '..' ,'templates')),
//           adapter: new HandlebarsAdapter(),
//           options: {
//               strict: true,
//           },
//         }
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [MailService],
//   exports: [MailService],
// })
// export class MailModule {}
