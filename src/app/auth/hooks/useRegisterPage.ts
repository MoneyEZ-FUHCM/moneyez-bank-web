import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { showToast } from "@/hooks/useShowToast";
import {
  useRegisterMutation,
  useResetPasswordMutation,
  useVerifyMutation,
} from "@/services/auth";
import { FormInstance } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AUTH_CONSTANT } from "../auth.constant";
import { TEXT_TRANSLATE } from "../auth.translate";

const useRegisterPage = (form: FormInstance) => {
  // router
  const router = useRouter();
  // env
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
  // mutation
  const [register, { isLoading: isSigningUp }] = useRegisterMutation();
  const [verify, { isLoading: isVerifyingEmail }] = useVerifyMutation();
  const [resetPassword] = useResetPasswordMutation();
  // state
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);
  // constant
  const { ERROR_CODE, FORM_NAME, MAX_LENGTH_OTP } = AUTH_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE } = TEXT_TRANSLATE;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;

  const onCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  const validateFieldsMatch = (fieldKey: string, errorMessage: string) => {
    return (_: unknown, value: string) => {
      const fieldValue = form.getFieldValue(fieldKey);
      if (value && fieldValue && value !== fieldValue) {
        return Promise.reject(new Error(errorMessage));
      }
      return Promise.resolve();
    };
  };

  const handleDrawerClose = useCallback(() => {
    setIsDrawerVisible(false);
  }, []);

  const handleOTPSubmit = async () => {
    const email = form.getFieldValue(FORM_NAME.EMAIL);
    let payload = { email, otpCode };
    if (otpCode.length < MAX_LENGTH_OTP) {
      showToast(TOAST_STATUS.WARNING, MESSAGE_VALIDATE.OTP_5_DIGITS);
      return;
    }
    try {
      const res = await verify(payload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        const accessToken = res.data.accessToken;
        if (accessToken) {
          Cookies.set("accessToken", res.data.accessToken);
          Cookies.set("refreshToken", res.data.refreshToken);
          router.replace(PATH_NAME.HOME);
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.LOGIN_SUCCESSFUL);
        }
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

  const onFinish = async (values: {
    email: string;
    fullName: string;
    password: string;
    phoneNumber: string;
  }) => {
    if (!captchaVerified) {
      showToast(TOAST_STATUS.WARNING, MESSAGE_VALIDATE.RECAPTCHA_REQUIRED);
      return;
    }
    try {
      const res = await register(values).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_ERROR.DOEST_NOT_VERIFY_EMAIL);
        setTimeout(() => {
          setIsDrawerVisible(true);
        }, 1000);
      }
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.INVALID_INFO);
        return;
      }
      if (error?.errorCode === ERROR_CODE.DUPLICATE_PHONE_NUMBER) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.PHONE_ALREADY_EXISTED);
        return;
      }
      if (error?.errorCode === ERROR_CODE.ACCOUNT_EXISTED) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.ACCOUNT_ALREADY_EXISTED);
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  return {
    state: {
      captchaVerified,
      isSigningUp,
      isVerifyingEmail,
      isDrawerVisible,
      isResending,
      recaptchaSiteKey,
      otpCode,
    },

    handler: {
      validateFieldsMatch,
      onCaptchaChange,
      setOtpCode,
      setIsDrawerVisible,
      handleDrawerClose,
      handleOTPSubmit,
      handleResendMail,
      onFinish,
    },
  };
};

export { useRegisterPage };
