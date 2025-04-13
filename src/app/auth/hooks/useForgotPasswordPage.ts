import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { useDecryptCredentials } from "@/hooks/useDecryptCredentials";
import { showToast } from "@/hooks/useShowToast";
import {
  useConfirmNewPasswordMutation,
  useConfirmOtpMutation,
  useResetPasswordMutation,
} from "@/services/auth";
import { FormInstance } from "antd";
import { useCallback, useState } from "react";
import { AUTH_CONSTANT } from "../auth.constant";
import { TEXT_TRANSLATE } from "../auth.translate";

const useForgotPasswordPage = (
  form: FormInstance,
  setIsShowRegister: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  // mutation
  const [confirmNewPassword, { isLoading: isConfirmNewPassword }] =
    useConfirmNewPasswordMutation();
  const [confirmOtp, { isLoading: isLoadingConfirmOtp }] =
    useConfirmOtpMutation();
  const [resetPassword] = useResetPasswordMutation();
  // state
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isShowForgotPassword, setIsShowForgotPassword] =
    useState<boolean>(false);
  const [isOTPSubmitted, setIsOTPSubmitted] = useState<boolean>(false);
  const [isLoadingResetPassword, setIsLoadingResetPassword] =
    useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  // hooks
  const { email, password } = useDecryptCredentials();
  // constants
  const { ERROR_CODE, FORM_NAME, MAX_LENGTH_OTP } = AUTH_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE } = TEXT_TRANSLATE;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;

  const validatePassword = (_: unknown, value: string) => {
    const password = form.getFieldValue(FORM_NAME.PASSWORD);
    if (value && password && value !== password) {
      return Promise.reject(MESSAGE_VALIDATE.PASSWORDS_MUST_MATCH);
    }
    return Promise.resolve();
  };

  const onFinish = async () => {
    setIsOTPSubmitted(false);
    setIsLoadingResetPassword(true);
    const email = form.getFieldValue(FORM_NAME.EMAIL);
    try {
      const res = await resetPassword(JSON.stringify(email)).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        showToast(
          TOAST_STATUS.SUCCESS,
          MESSAGE_SUCCESS.REQUEST_PASSWORD_SUCCESSFUL,
        );
        setTimeout(() => {
          setIsDrawerVisible(true);
          setIsLoadingResetPassword(false);
        }, 500);
      }
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.RESET_PASSWORD_FAILED) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.ACCOUNT_DOES_NOT_EXIST);
        return;
      }
      if (error?.errorCode === ERROR_CODE.OTP_HAS_SENT) {
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_ERROR.OTP_HAS_SENT);
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    } finally {
      setIsLoadingResetPassword(false);
    }
  };

  const handleOTPSubmit = async () => {
    const email = form.getFieldValue(FORM_NAME.EMAIL);
    let payload = { email, otpCode };
    if (otpCode.length < MAX_LENGTH_OTP) {
      showToast(TOAST_STATUS.WARNING, MESSAGE_VALIDATE.OTP_5_DIGITS);
      return;
    }
    try {
      const res = await confirmOtp(payload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        setIsOTPSubmitted(true);
      }
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.OTP_INVALID) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.OTP_INVALID);
        return;
      }

      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const handleResetPassword = async () => {
    await form.validateFields();
    const email = form.getFieldValue(FORM_NAME.EMAIL);
    const password = form.getFieldValue(FORM_NAME.PASSWORD);
    const payload = { email, password, otpCode };
    try {
      const res = await confirmNewPassword(payload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        showToast(
          TOAST_STATUS.SUCCESS,
          MESSAGE_SUCCESS.CONFIRM_PASSWORD_SUCCESSFUL,
        );
        setIsDrawerVisible(false);
        setIsShowRegister(true);
        form.resetFields();
      }
    } catch (err) {
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const handleResendMail = async () => {
    setIsResending(true);
    const email = form.getFieldValue(FORM_NAME.EMAIL);
    try {
      const res = await resetPassword(JSON.stringify(email)).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        showToast(
          TOAST_STATUS.SUCCESS,
          MESSAGE_SUCCESS.REQUEST_PASSWORD_SUCCESSFUL,
        );
      }
      setIsResending(false);
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.RESET_PASSWORD_FAILED) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.ACCOUNT_DOES_NOT_EXIST);
        return;
      }
      if (error?.errorCode === ERROR_CODE.OTP_HAS_SENT) {
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_ERROR.OTP_HAS_SENT);
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    } finally {
      setIsResending(false);
    }
  };

  const handleDrawerClose = useCallback(() => {
    setIsDrawerVisible(false);
    if (isOTPSubmitted) {
      setIsOTPSubmitted(false);
    }
  }, []);

  return {
    state: {
      rememberMe,
      isShowForgotPassword,
      isDrawerVisible,
      isResending,
      isOTPSubmitted,
      isLoadingResetPassword,
      isLoadingConfirmOtp,
      isConfirmNewPassword,
      otpCode,
      email,
      password,
    },

    handler: {
      setIsShowRegister,
      setIsShowForgotPassword,
      setIsDrawerVisible,
      setRememberMe,
      setOtpCode,
      validatePassword,
      onFinish,
      handleOTPSubmit,
      handleResetPassword,
      handleDrawerClose,
      handleResendMail,
    },
  };
};

export { useForgotPasswordPage };
