"use client";
import { GroupMembers } from "@/types/group.types";
import { formatCurrency, formatDate } from "@/utils";
import {
  CalendarOutlined,
  CloseCircleOutlined,
  EditOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import Image from "next/image";
import React from "react";
import { useGroupManagementPage } from "../hooks/useGroupManagementPage";
import GroupStats from "./GroupStats";

const GroupDetailView: React.FC = () => {
  const { state, handler } = useGroupManagementPage();

  if (state.isLoadingGroupDetail) {
    return (
      <div className="flex justify-center p-8">
        <Spin />
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
      <div className="relative mb-10 flex flex-col gap-8 border-b border-gray-200 pb-8 md:flex-row">
        <div className="flex-shrink-0">
          <div className="relative h-60 w-60 overflow-hidden rounded-xl border-2 border-white shadow-lg transition-all duration-300 hover:shadow-xl">
            {state.groupDetail?.imageUrl ? (
              <Image
                src={state.groupDetail?.imageUrl ?? ""}
                alt={state.groupDetail?.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary">
                <span className="text-8xl font-medium uppercase text-white">
                  {state.groupDetail?.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-800">
                {state.groupDetail?.name}
              </h1>
              <p className="mb-4 max-w-2xl text-sm leading-relaxed text-gray-600">
                {state.groupDetail?.description}
              </p>
              <div className="mb-4 flex flex-col gap-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarOutlined className="mr-2 text-gray-400" />
                  <span>
                    Ngày tạo nhóm:{" "}
                    {formatDate(state.groupDetail?.createdDate || "2023-01-01")}
                  </span>
                </div>
                <div className="flex items-center">
                  <EditOutlined className="mr-2 text-gray-400" />
                  <span>
                    Cập nhật lần cuối:{" "}
                    {formatDate(state.groupDetail?.createdDate || "2023-01-01")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <span
                className={`rounded-full px-4 py-1 text-sm font-medium transition-all duration-200 hover:opacity-80 ${
                  handler.formatStatus(state.groupDetail?.status).color
                } shadow-sm`}
              >
                {handler.formatStatus(state.groupDetail?.status).label}
              </span>
              <span
                className={`rounded-full px-4 py-1 text-sm font-medium shadow-sm transition-all duration-200 hover:opacity-80 ${
                  state.groupDetail?.visibility === "PRIVATE"
                    ? "bg-yellow-100 text-yellow-500"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {state.groupDetail?.visibility === "PRIVATE" ? (
                  <LockOutlined color="yellow" className="mr-1" />
                ) : (
                  <GlobalOutlined color="purple" className="mr-1" />
                )}
                {state.groupDetail?.visibility === "PRIVATE"
                  ? "Riêng tư"
                  : "Công khai"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm transition-all hover:border-gray-200">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-600">
                Số dư hiện tại
              </p>
              <p className="text-green-600 text-2xl font-bold">
                {formatCurrency(state.groupDetail?.currentBalance)}
              </p>
            </div>
          </div>
        </div>
        <button
          className="absolute -right-5 -top-5"
          onClick={() => handler.router.back()}
        >
          <CloseCircleOutlined className="text-2xl" />
        </button>
      </div>
      <GroupStats groupDetail={state.groupDetail} />
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="mb-6 flex items-center text-xl font-semibold">
            <span>Thành viên nhóm</span>
            <span className="ml-2 h-px flex-grow bg-gray-200"></span>
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                >
                  Thành viên
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                >
                  Vai trò
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                >
                  Đóng góp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                >
                  Ngày tham gia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {state.groupDetail?.groupMembers &&
                state.groupDetail.groupMembers?.length > 0 &&
                state.groupDetail?.groupMembers?.map(
                  (member: GroupMembers, index: number) => (
                    <tr
                      key={member.id}
                      className={`transition-colors hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative h-10 w-10 flex-shrink-0">
                            {member?.userInfo?.avatarUrl ? (
                              <Image
                                src={member?.userInfo?.avatarUrl}
                                alt={member?.userInfo?.fullName}
                                layout="fill"
                                className="rounded-full border border-gray-200"
                                objectFit="cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                <span className="text-xl font-medium uppercase text-white">
                                  {member?.userInfo?.fullName?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member?.userInfo?.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {member?.userInfo?.email}
                            </div>
                            {member?.userInfo?.phoneNumber && (
                              <div className="text-xs text-gray-500">
                                {member?.userInfo?.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            member.role === "LEADER"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {handler.formatRole(member?.role)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{
                                width: `${member?.contributionPercentage}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {member?.contributionPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${handler.formatStatus(member?.status).color}`}
                        >
                          {handler.formatStatus(member?.status).label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(member?.createdDate)}
                      </td>
                    </tr>
                  ),
                )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-6 flex items-center text-xl font-semibold">
          <span>Chi tiết thành viên</span>
          <span className="ml-2 h-px flex-grow bg-gray-200"></span>
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.groupDetail?.groupMembers &&
            state.groupDetail.groupMembers?.length > 0 &&
            state.groupDetail?.groupMembers?.map((member: GroupMembers) => (
              <div
                key={`detail-${member?.id}`}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    {member?.userInfo?.avatarUrl ? (
                      <Image
                        src={member?.userInfo?.avatarUrl}
                        alt={member?.userInfo?.fullName}
                        layout="fill"
                        className="rounded-full border-2 border-white shadow-sm"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <span className="text-4xl font-medium uppercase text-white">
                          {member?.userInfo?.fullName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    {member.role === "LEADER" && (
                      <div className="absolute -right-1 -top-1 rounded-full border-2 border-white bg-yellow-400 p-1 shadow-sm">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="mb-1 text-lg font-bold text-gray-900">
                      {member?.userInfo?.fullName}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          member?.role === "LEADER"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {handler.formatRole(member?.role)}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${handler.formatStatus(member?.status).color}`}
                      >
                        {handler.formatStatus(member?.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-2">
                    <span className="font-medium text-gray-500">Email:</span>
                    <span className="text-gray-900">
                      {member?.userInfo?.email}
                    </span>
                  </div>
                  {member?.userInfo?.phoneNumber && (
                    <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-2">
                      <span className="font-medium text-gray-500">
                        Số điện thoại:
                      </span>
                      <span className="text-gray-900">
                        {member?.userInfo?.phoneNumber}
                      </span>
                    </div>
                  )}
                  {member?.userInfo?.dob && (
                    <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-2">
                      <span className="font-medium text-gray-500">
                        Ngày sinh:
                      </span>
                      <span className="text-gray-900">
                        {formatDate(member?.userInfo?.dob)}
                      </span>
                    </div>
                  )}
                  {member?.userInfo?.gender !== null && (
                    <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-2">
                      <span className="font-medium text-gray-500">
                        Giới tính:
                      </span>
                      <span className="text-gray-900">
                        {handler.formatGender(member?.userInfo?.gender as any)}
                      </span>
                    </div>
                  )}
                  {member?.userInfo?.address && (
                    <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-2">
                      <span className="font-medium text-gray-500">
                        Địa chỉ:
                      </span>
                      <span className="text-gray-900">
                        {member?.userInfo?.address}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-2">
                    <span className="font-medium text-gray-500">Đóng góp:</span>
                    <div className="flex items-center">
                      <div className="mr-2 h-1.5 w-12 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{
                            width: `${member?.contributionPercentage}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900">
                        {member?.contributionPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 rounded-lg bg-gray-50 p-2">
                    <span className="font-medium text-gray-500">
                      Ngày tham gia:
                    </span>
                    <span className="text-gray-900">
                      {formatDate(member?.createdDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailView;
