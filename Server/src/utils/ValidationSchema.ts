import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing!")
    .min(3, "Name is too short!")
    .max(20, "Name is too long!"),
  email: yup
    .string()
    .email("Invalid Email ID!")
    .required("Email ID is missing!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing")
    .min(8, "Password should have minimum 8 characters!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , "Use a strong Password!"
    ),
});
