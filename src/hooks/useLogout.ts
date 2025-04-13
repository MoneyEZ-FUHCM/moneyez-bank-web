import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import apiSlice from "@/redux/slices/apiSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showToast } from "./useShowToast";

export const useLogout = () => {
  const { SYSTEM_SUCCESS } = COMMON_CONSTANT;
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.replace(PATH_NAME.AUTH);
    showToast(TOAST_STATUS.SUCCESS, SYSTEM_SUCCESS.LOGOUT);

    setTimeout(() => {
      dispatch(apiSlice.util.resetApiState());
    }, 100);
  };

  return { logout };
};
