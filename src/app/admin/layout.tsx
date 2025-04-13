"use client";

import Admin from "@/assets/images/logo/avatar_admin.jpg";
import LogoWeb from "@/assets/images/logo/logo_web.png";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { useLogout } from "@/hooks/useLogout";
import { selectUserInfo } from "@/redux/slices/userSlice";
import {
  BarsOutlined,
  BellOutlined,
  BuildOutlined,
  FileMarkdownOutlined,
  FilePptOutlined,
  PieChartOutlined,
  QuestionCircleOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FloatButton, Layout, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { MenuItem } from "./admin.constant";
import { TEXT_TRANSLATE } from "./admin.translate";
import { useSidebar } from "./hooks/useSidebar";

const { Content, Sider, Footer } = Layout;
const { SIDE_BAR, TITLE, BUTTON } = TEXT_TRANSLATE;

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

function getItem(
  label: React.ReactNode,
  key: React.ReactNode,
  icon?: React.ReactNode,
  children?: MenuItem[],
  path?: string,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    path,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    SIDE_BAR.STATISTIC,
    SIDE_BAR.POSITION_1,
    <PieChartOutlined />,
    undefined,
    PATH_NAME.STATISTIC,
  ),
  getItem(
    SIDE_BAR.MANAGE_SPENDING_MODEL,
    SIDE_BAR.POSITION_3,
    <BuildOutlined />,
    undefined,
    PATH_NAME.MANAGE_SPENDING_MODEL,
  ),
  getItem(
    SIDE_BAR.MANAGE_CATEGORY,
    SIDE_BAR.POSITION_4,
    <BarsOutlined />,
    [
      getItem(
        SIDE_BAR.MANAGE_CATEGORY_MANAGE,
        SIDE_BAR.POSITION_4,
        <FileMarkdownOutlined />,
        undefined,
        PATH_NAME.MANAGE_CATEGORY,
      ),
      getItem(
        SIDE_BAR.MANAGE_SUB_CATEGORY,
        SIDE_BAR.POSITION_5,
        <FilePptOutlined />,
        undefined,
        PATH_NAME.MANAGE_SUB_CATEGORY,
      ),
    ],
    PATH_NAME.MANAGE_CATEGORY,
  ),
  getItem(
    SIDE_BAR.MANAGE_QUIZ,
    SIDE_BAR.POSITION_8,
    <QuestionCircleOutlined />,
    undefined,
    PATH_NAME.MANAGE_QUIZ,
  ),
  getItem(
    SIDE_BAR.MANAGE_GROUP,
    SIDE_BAR.POSITION_6,
    <UsergroupAddOutlined />,
    undefined,
    PATH_NAME.MANAGE_GROUP,
  ),
  getItem(
    SIDE_BAR.MANAGE_USER,
    SIDE_BAR.POSITION_2,
    <UserOutlined />,
    undefined,
    PATH_NAME.MANAGE_USER,
  ),
  getItem(
    SIDE_BAR.MANAGE_NOTIFICATION,
    SIDE_BAR.POSITION_7,
    <BellOutlined />,
    undefined,
    PATH_NAME.MANAGE_NOTIFICATION,
  ),
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { collapsed, setCollapsed, selectedKeys, storeDefaultSelectedKeys } =
    useSidebar(items);
  const { logout } = useLogout();
  const userInfo = useSelector(selectUserInfo);
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      if (
        item &&
        "children" in item &&
        item.children &&
        item.children.length > 0
      ) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => storeDefaultSelectedKeys(item.key)}
          >
            {item.path ? (
              <Link href={item.path}>{item.label}</Link>
            ) : (
              item.label
            )}
          </Menu.Item>
        );
      }
    });
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        width={230}
        breakpoint="lg"
        collapsedWidth="60"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={`scrollbar sider bottom-0 left-0 top-0 z-[1000] box-border min-h-screen flex-none overflow-auto overflow-y-auto ${collapsed ? "collapsed" : ""}`}
        theme="light"
        collapsible
      >
        <div className="demo-logo-vertical" />
        <div className="my-7 flex justify-center">
          <Image
            className="w-8/12 select-none object-cover"
            src={LogoWeb}
            alt=""
            quality={80}
          />
        </div>
        <Menu
          theme="light"
          selectedKeys={selectedKeys}
          mode="inline"
          className="select-none"
        >
          {renderMenuItems(items)}
        </Menu>
      </Sider>
      <Layout
        className="scrollbar right-bar ease overflow-y-auto transition-all duration-150 ease-in-out"
        style={{ marginLeft: collapsed ? 60 : 230 }}
      >
        <div className="header fixed z-[999] flex h-16 items-center justify-end gap-2 bg-[#f8f8f8] bg-opacity-80 pr-5 shadow-none backdrop-blur-[6px]">
          {
            <>
              <Image
                className="h-[42px] w-[42px] rounded-full border object-cover ring-2 ring-gray-300 hover:ring-[#0077ff]"
                src={
                  userInfo?.avatarUrl && userInfo.avatarUrl !== null
                    ? userInfo.avatarUrl
                    : Admin
                }
                alt="error"
                width={42}
                height={42}
              />
              <div className="flex flex-col">
                <strong>
                  {userInfo?.fullName ? userInfo.fullName : TITLE.NAME}
                </strong>
                <button
                  className="cursor-pointer text-left font-semibold text-[#5099ff] hover:underline"
                  onClick={logout}
                >
                  {BUTTON.LOGOUT}
                </button>
              </div>
            </>
          }
        </div>
        <Content className="mx-4 mt-[80px]">
          <div className="min-w-[250px] overflow-x-auto rounded-xl">
            {children}
          </div>
        </Content>
        <Footer className="text-center">{TITLE.COPYRIGHT}</Footer>
        <FloatButton.BackTop />
      </Layout>
    </Layout>
  );
}
