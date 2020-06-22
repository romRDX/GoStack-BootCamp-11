import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'meaghan.jast92@ethereal.email',
        pass: 'yQQkdWArcpqFfw2ss7',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    /**
       * essa propriedade que resolveu o problema
       * tls: {
          rejectUnauthorized: false,
        },
       */

    this.client = transporter;
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.name || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

// nodemailer.createTestAccount().then(account => {
//   const transporter = nodemailer.createTransport({
//     host: account.smtp.host,
//     port: account.smtp.port,
//     secure: account.smtp.secure,
//     auth: {
//       user: account.user,
//       pass: account.pass,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   /**
//    * essa propriedade que resolveu o problema
//    * tls: {
//       rejectUnauthorized: false,
//     },
//    */

//   this.client = transporter;
// });
