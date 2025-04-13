import { auth } from "@/configs/firebase";
import { TOAST_STATUS, VALID_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { useDecryptCredentials } from "@/hooks/useDecryptCredentials";
import { showToast } from "@/hooks/useShowToast";
import {
  useLoginGoogleMutation,
  useLoginMutation,
  useVerifyMutation,
} from "@/services/auth";
import { ApiResponse } from "@/types/login.type";
import { encryptData } from "@/utils";
import { FormInstance } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AUTH_CONSTANT } from "../auth.constant";
import { TEXT_TRANSLATE } from "../auth.translate";

const useLoginPage = (form: FormInstance) => {
  // mutation & provider
  const provider = new GoogleAuthProvider();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [loginGoogle, { isLoading: isLoggingInGoogle }] =
    useLoginGoogleMutation();
  const [verify, { isLoading: isVerifyingEmail }] = useVerifyMutation();
  // router & hooks
  const router = useRouter();
  const { email, password, secretKey } = useDecryptCredentials();
  // state
  const [isShowRegister, setIsShowRegister] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isShowForgotPassword, setIsShowForgotPassword] =
    useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  // constants
  const { ERROR_CODE, FORM_NAME, MAX_LENGTH_OTP } = AUTH_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE } = TEXT_TRANSLATE;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res: ApiResponse = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        Cookies.set("accessToken", res.data.accessToken);
        Cookies.set("refreshToken", res.data.refreshToken);
        const accessToken = res.data.accessToken;
        if (accessToken) {
          const decoded: any = jwtDecode(accessToken);
          const role =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

          if (rememberMe) {
            const encryptedEmail = encryptData(values.email, secretKey);
            const encryptedPassword = encryptData(values.password, secretKey);
            Cookies.set("email", encryptedEmail);
            Cookies.set("password", encryptedPassword);
          }

          if (role === VALID_ROLE.USER) {
            router.replace(PATH_NAME.CHART);
          } else {
            router.replace(PATH_NAME.STATISTIC);
          }

          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.LOGIN_SUCCESSFUL);
        }
      }
    } catch (err: any) {
      const error = err?.data;
      if (
        error?.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED &&
        error?.errorCode === ERROR_CODE.INVALID_ACCOUNT
      ) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.INVALID_INFO);
        return;
      }
      if (
        error?.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED &&
        error?.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST
      ) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.INVALID_INFO);
        return;
      }
      if (
        error?.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED &&
        error?.errorCode === ERROR_CODE.ACCOUNT_BLOCKED
      ) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.ACCOUNT_BLOCKED);
        return;
      }
      if (
        error?.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED &&
        error?.errorCode === ERROR_CODE.ACCOUNT_NEED_CONFIRM_EMAIL
      ) {
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_ERROR.DOEST_NOT_VERIFY_EMAIL);
        setTimeout(() => {
          setIsDrawerVisible(true);
        }, 500);
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const handleGoogleSignIn = async () => {
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const result = await signInWithPopup(auth, provider);
      const credentials = await result.user.getIdTokenResult();
      const accessToken = credentials.token;
      const res = await loginGoogle(JSON.stringify(accessToken)).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        const accessToken = res.data.accessToken;
        if (accessToken) {
          Cookies.set("accessToken", res.data.accessToken);
          Cookies.set("refreshToken", res.data.refreshToken);
          const decoded: any = jwtDecode(accessToken);
          const role =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          if (role !== VALID_ROLE.USER) {
            router.replace(PATH_NAME.STATISTIC);
            return;
          } else {
            router.replace(PATH_NAME.CHART);
            showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.LOGIN_SUCCESSFUL);
          }
        }
      }
    } catch (err: any) {
      const error = err?.data;
      if (
        error?.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED &&
        error?.errorCode === ERROR_CODE.ACCOUNT_BLOCKED
      ) {
        showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.ACCOUNT_BLOCKED);
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const handleOTPSubmit = async () => {
    const email = form.getFieldValue(FORM_NAME.EMAIL);
    let information = { email, otpCode };
    if (otpCode.length < MAX_LENGTH_OTP) {
      showToast(TOAST_STATUS.WARNING, MESSAGE_VALIDATE.OTP_5_DIGITS);
      return;
    }
    try {
      const res = await verify(information).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        const accessToken = res.data.accessToken;
        if (accessToken) {
          Cookies.set("accessToken", res.data.accessToken);
          Cookies.set("refreshToken", res.data.refreshToken);
          const decoded: any = jwtDecode(accessToken);
          const role =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          if (role !== VALID_ROLE.USER) {
            router.replace(PATH_NAME.STATISTIC);
            return;
          } else {
            router.replace(PATH_NAME.CHART);
            showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.LOGIN_SUCCESSFUL);
          }
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

  const handleDrawerClose = useCallback(() => {
    setIsDrawerVisible(false);
  }, []);

  const handleBackToHome = () => {
    router.push(PATH_NAME.HOME);
  };

  return {
    state: {
      isShowRegister,
      isShowForgotPassword,
      isDrawerVisible,
      rememberMe,
      otpCode,
      email,
      password,
      isLoggingIn,
      isLoggingInGoogle,
      isVerifyingEmail,
    },

    handler: {
      setIsShowRegister,
      setIsShowForgotPassword,
      setIsDrawerVisible,
      setRememberMe,
      setOtpCode,
      onFinish,
      handleGoogleSignIn,
      handleOTPSubmit,
      handleDrawerClose,
      handleBackToHome,
    },
  };
};

export { useLoginPage };
