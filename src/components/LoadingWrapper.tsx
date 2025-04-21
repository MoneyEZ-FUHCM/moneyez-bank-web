"use client";

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
  PATH_NAME.MANAGE_BANK,
  PATH_NAME.MANAGE_USER,
]);

const ADMIN_PATHS = new Set([PATH_NAME.MANAGE_BANK, PATH_NAME.MANAGE_USER]);

const ADMIN_DYNAMIC_PATHS = /^\/bank\/(manage-bank)\/[^/]+$/;

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
      router.replace(PATH_NAME.AUTH);
      return;
    }

    if (loading || !userInfo) return;

    const isValidPath =
      VALID_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname);
    if (!isValidPath) {
      router.replace(PATH_NAME.NOT_FOUND);
      return;
    }

    if (!(ADMIN_PATHS.has(pathname) || ADMIN_DYNAMIC_PATHS.test(pathname))) {
      router.replace(PATH_NAME.MANAGE_BANK);
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
