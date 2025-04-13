"use client";

import LogoWeb from "@/assets/images/logo/logo_web.png";
import { ButtonCustom } from "@/components/ui/button";
import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { useAcceptInvitationMutation } from "@/services/group";
import { Card, Divider, Spin, Typography } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { HTTP_STATUS } = COMMON_CONSTANT;

const Accept = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [acceptInvitation] = useAcceptInvitationMutation();
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const effectCalled = useRef(false);

  const [state, setState] = useState<{
    status: "loading" | "success" | "error";
    message?: string;
    groupName?: string;
  }>({
    status: "loading",
  });

  const handleBackToApp = () => {
    const deepLinkUrl = "myapp://Group";
    window.location.href = deepLinkUrl;
  };

  useEffect(() => {
    if (effectCalled.current) return;
    effectCalled.current = true;

    const handleAcceptInvitation = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setState({
          status: "error",
          message: "Mã tham gia không hợp lệ hoặc bị thiếu",
        });
        return;
      }

      try {
        const result = await acceptInvitation(token).unwrap();
        if (result && result.status === HTTP_STATUS.SUCCESS.OK) {
          setState({
            status: "success",
            groupName: result.data?.name || "nhóm",
          });
          showToast(TOAST_STATUS.SUCCESS, "Tham gia nhóm thành công!");
        }
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === "GroupMemberAlreadyExist") {
          showToast(TOAST_STATUS.ERROR, "Bạn đã là thành viên của nhóm này");
          setState({
            status: "error",
            message: "Bạn đã là thành viên của nhóm này",
          });
          return;
        }
        setState({
          status: "error",
          message: SYSTEM_ERROR.SERVER_ERROR,
        });
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
      }
    };

    handleAcceptInvitation();
  }, [searchParams, acceptInvitation, SYSTEM_ERROR]);

  const renderContent = () => {
    switch (state.status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <Spin size="large" className="my-8" />
            <Text className="mt-4 text-gray-500">
              Đang xử lý lời mời của bạn...
            </Text>
          </div>
        );
      case "success":
        return (
          <div className="p-4 text-center">
            <div className="my-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                <span className="text-5xl text-primary">✓</span>
              </div>
            </div>
            <Title level={3} className="mb-2 text-primary">
              Tham Gia Nhóm Thành Công!
            </Title>
            <Paragraph className="mb-6 text-gray-500">
              Bạn đã được thêm vào nhóm <strong>{state.groupName}</strong>. Bây
              giờ bạn có thể tham gia quản lý chi tiêu cùng với các thành viên
              khác trong nhóm.
            </Paragraph>
            <Divider className="my-6" />
            <ButtonCustom
              className="w-full border-primary bg-primary text-white hover:bg-primary/80"
              onClick={handleBackToApp}
            >
              Về Trang Chủ
            </ButtonCustom>
          </div>
        );
      case "error":
        return (
          <div className="p-4 text-center">
            <div className="my-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red/20">
                <span className="text-5xl text-[#CC0000]">✗</span>
              </div>
            </div>
            <Title level={3} className="mb-2 text-[#CC0000]">
              Không Thể Tham Gia Nhóm
            </Title>
            <Paragraph className="mb-6 text-gray-500">
              {state.message ||
                "Đã có lỗi xảy ra khi xử lý lời mời của bạn. Vui lòng thử lại hoặc liên hệ với người quản trị."}
            </Paragraph>
            <Divider className="my-6" />
            <div className="flex flex-col gap-3">
              <ButtonCustom
                className="w-full border-primary bg-primary text-white hover:bg-primary/80"
                onClick={handleBackToApp}
              >
                Về Trang Chủ
              </ButtonCustom>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FBFA] p-4">
      <Card
        className="w-full max-w-md overflow-hidden rounded-xl border-none shadow-lg"
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-thirdly p-6 text-center">
          <div className="relative mx-auto mb-2 h-12">
            <Image
              src={LogoWeb}
              alt="MoneyEZ Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <Title level={4} className="m-0 text-primary">
            Lời Mời Tham Gia Nhóm
          </Title>
        </div>
        {renderContent()}
      </Card>
    </div>
  );
};

export default Accept;
