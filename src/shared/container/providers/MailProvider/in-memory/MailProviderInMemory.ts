import { IMailProvider } from "../IMailProvider";

class MailProviderInMemory implements IMailProvider {
  private emails = [];

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    this.emails.push({
      to,
      subject,
      variables,
      path,
    });
  }
}

export { MailProviderInMemory };
