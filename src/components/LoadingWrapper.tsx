"use client";

import { VALID_ROLE } from "@/enums/globals";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useUserInfo from "@/hooks/useUserInfo";
import { selectUserInfo } from "@/redux/slices/userSlice";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const VALID_PATHS = new Set([
  "/",
  "/notfound",
  "/admin",
  "/user",
  "/auth",
  "/admin/statistic",
  "/admin/manage-user",
  "/admin/manage-model",
  "/admin/manage-category",
  "/admin/manage-sub-category",
  "/admin/manage-notification",
  "/admin/manage-group",
  "/user/chart",
  "/admin/manage-quiz",
]);

const ADMIN_PATHS = new Set([
  "/admin",
  "/admin/statistic",
  "/admin/manage-user",
  "/admin/manage-model",
  "/admin/manage-category",
  "/admin/manage-sub-category",
  "/admin/manage-notification",
  "/admin/manage-group",
  "/admin/manage-quiz",
]);

const USER_PATHS = new Set(["/user", "/user/chart"]);
const ADMIN_DYNAMIC_PATHS =
  /^\/admin\/(manage-category|manage-sub-category|manage-model|manage-group)\/[^/]+$/;

export function LoadingWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("accessToken");
  const { refetch, isLoading: loading } = useUserInfo();
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    if (!token) {
      if (
        pathname.startsWith(PATH_NAME.USER) ||
        pathname.startsWith(PATH_NAME.ADMIN)
      ) {
        router.replace(PATH_NAME.AUTH);
      }
      return;
    }

    if (loading || !userInfo) return;

    const role = userInfo?.role;

    const isValidPath =
      VALID_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname);
    if (!isValidPath) {
      router.replace(PATH_NAME.NOT_FOUND);
      return;
    }

    if (role === VALID_ROLE.ADMIN) {
      if (!(ADMIN_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname))) {
        router.replace(PATH_NAME.STATISTIC);
      }
    } else if (role === VALID_ROLE.USER) {
      if (!USER_PATHS.has(pathname)) {
        router.replace(PATH_NAME.USER);
      }
    }
  }, [token, pathname, loading, userInfo]);

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading || loading) return null;

  return <>{children}</>;
}
