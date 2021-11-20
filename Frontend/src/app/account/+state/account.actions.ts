import {createAction, props} from "@ngrx/store";
import {AccountModel, LoginDto, PasswordChangeDto, RegisterDto} from "../../models/account.model";


export const LoginAction = createAction(
  '[Account] Login',
  props<{loginDto: LoginDto, route: string}>()
);

export const LoginActionSuccess = createAction(
  '[Account] Login Success',
  props<{account: AccountModel, route: string}>()
);

export const RegisterAction = createAction(
  '[Account] Register',
  props<{registerDto: RegisterDto, route: string}>()
);

export const RegisterActionSuccess = createAction(
  '[Account] Register Success',
  props<{account: AccountModel, route: string}>()
);

export const ChangePasswordAction = createAction(
  '[Account] ChangePassword',
  props<{passwordChangeDto: PasswordChangeDto}>()
);

export const ChangePasswordActionSuccess = createAction(
  '[Account] ChangePassword Success',
);

export const DeleteAccountAction = createAction(
  '[Account] DeleteAccount',
);

export const DeleteAccountActionSuccess = createAction(
  '[Account] DeleteAccount Success',
);

export const GetAllAccountsAction = createAction(
  '[Accounts] Get all Accounts',
);

export const GetAllAccountsActionSuccess = createAction(
  '[Accounts] Get all Accounts Success',
  props<{accounts: AccountModel[]}>()
);

export const LogoutActionSuccess = createAction(
  '[Account] Logout Success'
);
