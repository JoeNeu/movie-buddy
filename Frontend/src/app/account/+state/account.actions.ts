import {createAction, props} from "@ngrx/store";


export const LoginAction = createAction(
  '[Account] Login',
  props<{username: string, password: string}>()
);
