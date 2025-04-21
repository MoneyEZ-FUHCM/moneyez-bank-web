import { Colors } from "@/helpers/constants/color";
import { formatTimestampWithHour } from "@/helpers/libs/utils";
import { ApiOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Collapse,
  Descriptions,
  Empty,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ReactNode } from "react";
import { useWebhookConfig } from "../hooks/useWebhookConfig";

export const formatDateWebHook = (date: string | null): ReactNode => {
  if (!date) return <span className="text-gray-400">Chưa có</span>;
  return formatTimestampWithHour(date);
};

const WebhookConfigView = () => {
  const { Text, Paragraph } = Typography;
  const { Panel } = Collapse;
  const { state } = useWebhookConfig();

  if (
    !state.webHookConfigList ||
    state.webHookConfigList?.items?.length === 0
  ) {
    return (
      <Card
        title={
          <div className="flex items-center gap-2">
            <ApiOutlined className="" />
            <span className="font-semibold">Cấu hình Webhook</span>
          </div>
        }
        bordered={false}
        className="rounded-xl border border-[#EBEFD6] shadow-md"
      >
        <div className="rounded-lg bg-white py-10">
          <Empty
            description={
              <span className="text-gray-500">Chưa liên kết webhook</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ApiOutlined className="" />
          <span className="font-semibold">
            Cấu hình Webhook ({state.webHookConfigList?.totalCount})
          </span>
        </div>
      }
      bordered={false}
      className="rounded-xl border shadow-md"
    >
      <Collapse
        className="border bg-transparent shadow-none"
        defaultActiveKey={[state.webHookConfigList?.items?.[0]?.id]}
        expandIconPosition="end"
      >
        {state.webHookConfigList.items?.length > 0 &&
          state.webHookConfigList.items?.map((config, index) => {
            const statusColor = config?.isEnabled
              ? Colors.colors.primary
              : Colors.colors.red;
            const statusText = config?.isEnabled
              ? "Đang liên kết"
              : "Đã hủy liên kết";

            const isHasFailures = config?.failureCount > 0;
            const configPosition = index + 1;

            return (
              <Panel
                key={config?.id}
                className="mb-3 overflow-hidden rounded-lg"
                header={
                  <div className="flex w-full items-center justify-between px-4 py-3">
                    <div
                      className={`flex items-center gap-3 ${isHasFailures ? "text-red" : ""}`}
                    >
                      <Badge color={statusColor} />
                      <div className="flex flex-col">
                        <div
                          className={`font-medium ${config?.isEnabled ? "text-primary" : "text-red"}`}
                        >
                          Cấu hình {configPosition}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {config?.accountNumber} - {config?.accountHolder}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag
                        color={config?.isEnabled ? "success" : "red"}
                        className={`rounded ${config?.isEnabled ? "border-primary text-primary" : "border-red text-red"}`}
                      >
                        {statusText}
                      </Tag>
                    </div>
                  </div>
                }
              >
                <Descriptions
                  bordered
                  size="small"
                  className="overflow-hidden"
                  column={1}
                  labelStyle={{ width: "180px" }}
                >
                  <Descriptions.Item label="Loại">
                    <Paragraph className="!mb-0">
                      <Text code className="border-0 text-primary">
                        {config?.type}
                      </Text>
                    </Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label="Chủ tài khoản">
                    <span>
                      <Text strong className="text-primary">
                        {config?.accountHolder}
                      </Text>
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tài khoản">
                    <span>
                      <Text strong className="text-primary">
                        {config?.accountNumber}
                      </Text>
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="ID">
                    <Tooltip title={config?.id}>
                      <Text code className="border-0 text-xs text-primary">
                        {config?.id.substring(0, 12)}...
                      </Text>
                    </Tooltip>
                  </Descriptions.Item>
                  <Descriptions.Item label="Secret key">
                    <Paragraph
                      copyable={{ text: config?.secret }}
                      className="!mb-0"
                    >
                      <Text code className="border-0 text-primary">
                        {config?.secret.substring(0, 8)}...
                      </Text>
                    </Paragraph>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thử lại">
                    <span>
                      <Text strong className="text-primary">
                        {config?.maxRetries}
                      </Text>{" "}
                      lần /{" "}
                      <Text strong className="text-primary">
                        {config?.retryIntervalSeconds}
                      </Text>{" "}
                      giây
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Số lần lỗi">
                    {config?.failureCount > 0 ? (
                      <Text type="danger" strong>
                        {config?.failureCount}
                      </Text>
                    ) : (
                      <Text className="text-primary" strong>
                        0
                      </Text>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Kích hoạt lần cuối">
                    {formatDateWebHook(config?.lastTriggeredAt)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Lỗi lần cuối">
                    {formatDateWebHook(config?.lastFailureAt)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày tạo">
                    {formatDateWebHook(config?.createdAt)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Cập nhật lần cuối">
                    {formatDateWebHook(config?.updatedAt)}
                  </Descriptions.Item>
                </Descriptions>
              </Panel>
            );
          })}
      </Collapse>
    </Card>
  );
};

export default WebhookConfigView;
