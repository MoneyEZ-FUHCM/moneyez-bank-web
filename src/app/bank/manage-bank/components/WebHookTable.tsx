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

const getWebhookTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return "Giao dịch";
    case 2:
      return "Tài khoản";
    default:
      return "Khác";
  }
};

const formatDate = (date: string | null): ReactNode => {
  if (!date) return <span className="text-gray-400">Chưa có</span>;
  return formatTimestampWithHour(date);
};

const WebhookConfigView = () => {
  const { Text, Paragraph } = Typography;
  const { Panel } = Collapse;
  const { state } = useWebhookConfig();
  const { webHookConfigList: webhookConfigs } = state;

  if (!webhookConfigs || webhookConfigs.length === 0) {
    return (
      <Card
        title={
          <div className="flex items-center gap-2">
            <ApiOutlined className="text-primary" />
            <span className="font-semibold text-primary">Cấu hình Webhook</span>
          </div>
        }
        bordered={false}
        className="rounded-xl border border-[#EBEFD6] shadow-md"
        headStyle={{
          backgroundColor: "#EBEFD6",
          borderBottom: "1px solid #E1EACD",
        }}
      >
        <div className="rounded-lg bg-white py-10">
          <Empty
            description={
              <span className="text-gray-500">
                Chưa có cấu hình webhook nào
              </span>
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
            Cấu hình Webhook ({webhookConfigs.length})
          </span>
        </div>
      }
      bordered={false}
      className="rounded-xl border shadow-md"
    >
      <Collapse
        className="border bg-transparent shadow-none"
        defaultActiveKey={[webhookConfigs[0]?.id]}
        expandIconPosition="end"
      >
        {webhookConfigs.map((config) => {
          const statusColor = config.isEnabled
            ? Colors.colors.primary
            : Colors.colors.gray;
          const statusText = config.isEnabled ? "Đang hoạt động" : "Đã tắt";

          const hasFailures = config.failureCount > 0;

          return (
            <Panel
              key={config.id}
              className="mb-3 overflow-hidden rounded-lg"
              header={
                <div className="flex w-full items-center justify-between px-4 py-3">
                  <div
                    className={`flex items-center gap-3 ${hasFailures ? "text-red-500" : ""}`}
                  >
                    <Badge color={statusColor} />
                    <div className="flex flex-col">
                      <div className="font-medium text-primary">
                        {getWebhookTypeLabel(config.type)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {config.url}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasFailures && (
                      <Tag color="error" className="rounded">
                        {config.failureCount} lỗi
                      </Tag>
                    )}
                    <Tag
                      color={config.isEnabled ? "success" : "default"}
                      className={`rounded ${config.isEnabled ? "border-primary text-primary" : ""}`}
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
                contentStyle={{ backgroundColor: "white" }}
              >
                <Descriptions.Item label="URL">
                  <Paragraph copyable ellipsis={{ rows: 1 }} className="mb-0">
                    {config.url}
                  </Paragraph>
                </Descriptions.Item>

                <Descriptions.Item label="Secret key">
                  <Paragraph
                    copyable={{ text: config.secret }}
                    className="mb-0"
                  >
                    <Text code className="border-0 text-primary">
                      {config.secret.substring(0, 8)}...
                    </Text>
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Thử lại">
                  <span>
                    <Text strong className="text-primary">
                      {config.maxRetries}
                    </Text>{" "}
                    lần, mỗi{" "}
                    <Text strong className="text-primary">
                      {config.retryIntervalSeconds}
                    </Text>{" "}
                    giây
                  </span>
                </Descriptions.Item>

                <Descriptions.Item label="Số lần lỗi">
                  {config.failureCount > 0 ? (
                    <Text type="danger" strong>
                      {config.failureCount}
                    </Text>
                  ) : (
                    <Text className="text-primary" strong>
                      0
                    </Text>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Kích hoạt lần cuối">
                  {formatDate(config.lastTriggeredAt)}
                </Descriptions.Item>

                <Descriptions.Item label="Lỗi lần cuối">
                  {formatDate(config.lastFailureAt)}
                </Descriptions.Item>

                <Descriptions.Item label="Ngày tạo">
                  {formatDate(config.createdAt)}
                </Descriptions.Item>

                <Descriptions.Item label="Cập nhật lần cuối">
                  {formatDate(config.updatedAt)}
                </Descriptions.Item>

                <Descriptions.Item label="ID">
                  <Tooltip title={config.id}>
                    <Text code className="border-0 text-xs text-primary">
                      {config.id.substring(0, 12)}...
                    </Text>
                  </Tooltip>
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
