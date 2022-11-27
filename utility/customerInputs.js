
import { check } from 'express-validator';

 export const CustomerInputs = [
    [
      check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .trim(),
      // check("email")
      //   .isEmail()
      //   .withMessage("That email doesn‘t look right")
      //   .bail()
      //   .trim()
      //   .normalizeEmail(),  
      check("phone")
          .isLength({ min: 10 , max: 11})
          .withMessage("Phone number must be at least 11 characters long")
          .trim(),
      ],
]

export const DeliveryInputs = [
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .trim(),
    check("email")
      .isEmail()
      .withMessage("That email doesn‘t look right")
      .bail()
      .trim()
      .normalizeEmail(),  
    check("phone")
        .isLength({ min: 10 , max: 11})
        .withMessage("Phone number must be at least 11 characters long")
        .trim(),
    check("address")
        .isLength({ min: 6 , max: 24})
        .withMessage("Address must be at least 6 characters long")
        .trim(),
    check("firstName")
        .isLength({ min: 3 , max: 12})
        .withMessage("First Name must be at least 3 characters long")
        .trim(),
    check("lastName")
        .isLength({ min: 3 , max: 12})
        .withMessage("Last Name must be at least 3 characters long")
        .trim(),
    check("pincode")
        .isLength({ min: 6 , max: 12})
        .withMessage("Pincode must be at least 6 characters long")
        .trim()

    ],
]