import { formatDate, formatDate2 } from "@/helpers/libs/utils";
import { UserInfo } from "@/types/user.types";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  EnvelopeClosedIcon,
  ExternalLinkIcon,
  HomeIcon,
  LockClosedIcon,
  MobileIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Modal } from "antd";
import Image from "next/image";

interface UserDetailModalProps {
  visible: boolean;
  onClose: () => void;
  userData: UserInfo;
}

const UserDetailModal = ({
  visible,
  onClose,
  userData,
}: UserDetailModalProps) => {
  if (!userData) return null;
  const ROLE_TEXT = {
    ADMIN: "Quản lý",
    USER: "Người dùng",
  };

  console.log("Check userData", userData);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={1000}
      centered
      destroyOnClose
      className="user-detail-modal"
    >
      <div className="rounded-lg shadow-lg">
        <div className="relative">
          <div className="h-56 w-full bg-gradient-to-r from-primary via-secondary to-thirdly">
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-3 w-3 rounded-full ${userData.status === "ACTIVE" ? "bg-green-400 animate-pulse" : "bg-gray-400"} ring-2 ring-white/50`}
                ></div>
                <span className="text-sm font-medium tracking-wide">
                  {userData.status}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                {userData.avatarUrl ? (
                  <Image
                    src={userData.avatarUrl}
                    alt={userData.fullName}
                    width={50}
                    height={50}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <PersonIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              {userData.isVerified && (
                <div className="absolute -right-2 bottom-3 rounded-full border-2 border-white bg-emerald-500 p-1 text-white shadow-md">
                  <CheckIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="border-b border-gray-100 px-8 pb-6 pt-8">
            <div className="flex flex-col items-start justify-between md:flex-row">
              <div className="mt-4 md:ml-36 md:mt-0">
                <h1 className="text-2xl font-bold text-gray-800">
                  {userData.fullName}
                </h1>
                <p className="text-gray-500">{userData.nameUnsign || ""}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 shadow-sm">
                    <LockClosedIcon className="mr-1 h-3 w-3" />
                    {ROLE_TEXT[userData.role] || "Không xác định"}
                  </span>
                  {userData.isVerified && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm">
                      <CheckIcon className="mr-1 h-3 w-3" /> Đã xác thực
                    </span>
                  )}
                  {userData.googleId && (
                    <span className="inline-flex items-center rounded-full bg-red/10 px-3 py-1 text-xs font-medium text-red shadow-sm">
                      <ExternalLinkIcon className="mr-1 h-3 w-3" /> Google
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 divide-y md:grid-cols-5 md:divide-x md:divide-y-0">
            <div className="col-span-3 p-6 md:p-8">
              <h2 className="mb-6 flex items-center text-lg font-semibold text-gray-800">
                <PersonIcon className="mr-2 h-5 w-5 text-blue-600" />
                Thông tin cá nhân
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2.5 transition-all group-hover:bg-blue-200">
                        <EnvelopeClosedIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="mt-1 break-all text-gray-900">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-green/20 hover:shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-lg bg-green/20 p-2.5 transition-all group-hover:bg-green/40">
                        <MobileIcon className="h-5 w-5 text-green" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Số điện thoại
                        </p>
                        <p className="mt-1 text-gray-900">
                          {userData.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-lg bg-purple-100 p-2.5 transition-all group-hover:bg-purple-200">
                        <CalendarIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Ngày sinh
                        </p>
                        <div className="mt-1">
                          <p className="text-gray-900">
                            {userData.dob
                              ? formatDate(userData.dob)
                              : "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-orange-200 hover:shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-lg bg-orange-100 p-2.5 transition-all group-hover:bg-orange-200">
                        <PersonIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Giới tính
                        </p>
                        <p className="mt-1 text-gray-900">
                          {Number(userData.gender) === 1
                            ? "Nam"
                            : Number(userData.gender) === 2
                              ? "Nữ"
                              : "Khác"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-red/20 hover:shadow-md md:col-span-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 rounded-lg bg-red/20 p-2.5 transition-all group-hover:bg-red/30">
                        <HomeIcon className="h-5 w-5 text-red" />
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="text-sm font-medium text-gray-500">
                          Địa chỉ
                        </p>
                        <p className="mt-1 text-gray-900">
                          {userData.address || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-gray-50 p-6 md:p-8">
              <h2 className="mb-6 flex items-center text-lg font-semibold text-gray-800">
                <LockClosedIcon className="mr-2 h-5 w-5 text-gray-600" />
                Thông tin hệ thống
              </h2>
              <div className="space-y-6">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4 text-indigo-500" />
                    <p className="text-sm font-medium text-gray-500">
                      Ngày tạo tài khoản
                    </p>
                  </div>
                  <p className="mt-2 pl-6 font-medium text-gray-800">
                    {formatDate2(userData.createdDate)}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4 text-indigo-500" />
                    <p className="text-sm font-medium text-gray-500">
                      Cập nhật gần nhất
                    </p>
                  </div>
                  <p className="mt-2 pl-6 font-medium text-gray-800">
                    {formatDate2(userData.updatedDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { UserDetailModal };
