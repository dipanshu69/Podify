import * as yup from "yup";

const passwordRegExp =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is Missing")
    .min(3, "Name is too short")
    .max(20, "Name is too long"),
  email: yup.string().required("Email is Required").email("Invalid Email"),
  password: yup
    .string()
    .required("Password Is Missing")
    .min(8, "Password Is Too Short")
    .matches(passwordRegExp, "Invalid password format"),
});
