import {MessageModel} from "./message.model";

export class AccountModel {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  isAdministrator: boolean;
  token: string;
  messages?: MessageModel[]
}

export class RegisterDto {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export class LoginDto {
  username: string;
  password: string;
}

export class PasswordChangeDto {
  username: string;
  newPassword: string;
}

export class AccountCreationDto {
  username: string;
  newPassword: string;
}
