import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};


export const signUpValidation = [
  body("name")
    .isLength({ min: 4, max: 30 })
    .withMessage("name must contain at least 4 character"),

  body("email")
  .isEmail()
  .withMessage("Please enter a valid email address"),

  body("password")
    .isLength({ min: 6, max: 100 })
    .withMessage("password must be between 6 to 100 char"),
];


export const loginValidation = [
  body("email")
  .isEmail()
  .withMessage("Please enter a valid email address"),

  body("password")
    .isLength({ min: 6, max: 100 })
    .withMessage("password must be between 6 to 100 char"),
];
