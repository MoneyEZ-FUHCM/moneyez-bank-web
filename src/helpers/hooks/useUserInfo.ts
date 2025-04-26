import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setUserInfo } from "@/redux/slices/userSlice";
import { useGetInfoUserQuery } from "@/services/auth";

const useUserInfo = () => {
  const token = Cookies.get("accessToken");
  const dispatch = useDispatch();
  const {
    data: userInfo,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetInfoUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (userInfo?.data) {
      dispatch(setUserInfo(userInfo.data));
    }
  }, [userInfo?.data, dispatch]);

  return { userInfo, isLoading, isError, refetch, isFetching };
};

export default useUserInfo;
