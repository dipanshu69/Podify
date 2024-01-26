export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  LostPassWord: undefined;
  Verification: {userInfo: NewUserResponse};
};

interface NewUserResponse {
  id: string;
  name: string;
  email: string;
}
