import { renderIcon } from "@/components/common/IconRender";
import { ButtonCustom } from "@/components/ui/button";
import { CategoryCardProps } from "@/types/spendingModel.types";
import { DeleteOutlined } from "@ant-design/icons";
import { Card, List, Progress, Tag, Typography } from "antd";
import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";

const { Title, Text } = Typography;

const CategoryCard = ({
  category,
  percentageAmount,
  onRemove,
}: CategoryCardProps) => {
  const { state, handler } = useSpendingModelManagementPage();
  const PRIMARY_COLOR = "#609084";
  return (
    <Card className="relative flex h-full flex-col shadow-md transition-shadow hover:shadow-lg">
      <div className="flex-grow">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-center">
            <Progress
              type="circle"
              percent={percentageAmount}
              format={(percent) => `${percent}%`}
              size={80}
              strokeColor={PRIMARY_COLOR}
            />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Tag color={category.type === "INCOME" ? "green" : "red"}>
              {category.type === "INCOME" ? "Thu nhập" : "Chi tiêu"}
            </Tag>
            {category?.icon && (
              <div className="text-2xl">{renderIcon(category.icon)}</div>
            )}
          </div>
        </div>

        <div className="flex w-full justify-center">
          <Title
            level={4}
            className="w-fit cursor-pointer text-center"
            onClick={() => handler.handleViewDetailCategory(category?.id)}
          >
            {category?.name}
          </Title>
        </div>
        <Text className="mb-4 block text-gray-600">
          {category?.description}
        </Text>

        {(category?.subcategories ?? []).length > 0 && (
          <div className="mb-10 max-h-[200px] overflow-y-auto">
            <List
              size="small"
              dataSource={category.subcategories ?? []}
              renderItem={(item) => (
                <List.Item className="py-1">
                  <span className="flex items-center">
                    {renderIcon(item.icon, 20)}
                    <span className="ml-2">{item.name}</span>
                  </span>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 mt-10 p-4">
        <ButtonCustom
          className="w-full bg-primary text-white"
          onClick={onRemove}
        >
          <DeleteOutlined className="mr-1" />
          {state.BUTTON.DELETE_SPENDING_MODEL_CATEGORY}
        </ButtonCustom>
      </div>
    </Card>
  );
};

export { CategoryCard };
