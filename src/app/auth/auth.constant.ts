export const AUTH_CONSTANT = {
  // Form name
  FORM_NAME: {
    EMAIL: "email",
    PASSWORD: "password",
    CONFIRM_PASSWORD: "confirmPassword",
    NAME: "fullName",
    PHONE_NUMBER: "phoneNumber",
  },

  // Error code
  ERROR_CODE: {
    ACCOUNT_NOT_EXIST: "AccountNotExist",
    INVALID_ACCOUNT: "PasswordIsIncorrect",
    ACCOUNT_NEED_CONFIRM_EMAIL: "AccountDoesNotVerifyEmail",
    WRONG_PASSWORD: "WRONG_PASSWORD",
    OLD_PASSWORD_INVALID: "OldPasswordInvalid",
    OTP_INVALID: "OtpInvalid",
    RESET_PASSWORD_FAILED: "CanNotResetPassword",
    ACCOUNT_EXISTED: "AccountAlreadyExisted",
    ACCOUNT_BLOCKED: "AccountWasBlocked",
    DUPLICATE_PHONE_NUMBER: "DuplicatePhoneNumber",
    OTP_HAS_SENT: "OtpHasSent",
  },

  MAX_LENGTH_OTP: 5,
};
