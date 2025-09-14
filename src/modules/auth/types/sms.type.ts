export type SmsLoginCredentials = {
  mobile: string;
  code: string;
};

export type SmsSendRequest = {
  mobile: string;
  template?: string;
};
