export type MailError = {
  code: string;
  response: string;
  responseCode: number;
  command: string;
  rejected: string[];
  rejectedErrors: MailError[];
};
