import {createAction, props} from "@ngrx/store";
import {AccountModel, LoginDto, RegisterDto} from "../../models/account.model";


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
