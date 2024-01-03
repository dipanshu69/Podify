import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { categories } from "./audio_category";

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
    .trim()
    .required("Password Is Missing")
    .min(8, "Password Is Too Short")
    .matches(passwordRegExp, "Invalid password format"),
});

export const TokenAndIdValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId"),
});

export const updatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid Token"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId"),
  password: yup
    .string()
    .trim()
    .required("Password Is Missing")
    .min(8, "Password Is Too Short")
    .matches(passwordRegExp, "Invalid password format"),
});

export const signInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is Required").email("Invalid Email"),
  password: yup.string().trim().required("Password Is Missing"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title Is Missing"),
  about: yup.string().required("About Is Missing!"),
  category: yup
    .string()
    .oneOf(categories, "Invalid Category!")
    .required("Category Is Missing!"),
});

export const newPlayListValidationSchema = yup.object().shape({
  title: yup.string().required("Title Is Required"),
  audioId: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "visibility must be public or private!")
    .required("visibility is missing!"),
});

export const oldPlayListValidationSchema = yup.object().shape({
  title: yup.string().required("Title Is Required"),
  //this is going to validate the audio id
  audio: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  //this is going to validate the playList id
  id: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  visibility: yup.string().oneOf(["public", "private"],  "visibility must be public or private!"),
});
