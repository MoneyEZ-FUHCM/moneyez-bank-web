import { CountupCustom } from "@/components";
import { Group } from "@/types/group.types";

const GroupStats = ({ groupDetail }: { groupDetail: Group }) => {
  const totalMembers = groupDetail?.groupMembers?.length || 0;
  const activeMembers = groupDetail?.groupMembers?.filter(
    (m) => m?.status === "ACTIVE",
  ).length;
  const createdDate = new Date(groupDetail?.createdDate || "2023-01-01");
  const activeDays = Math.floor(
    (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const leader =
    groupDetail?.groupMembers?.find((m) => m.role === "LEADER")?.userInfo
      ?.fullName ?? "Chưa có";

  return (
    <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-4">
      {[
        { label: "Tổng thành viên", value: totalMembers },
        { label: "Thành viên hoạt động", value: activeMembers },
        { label: "Số ngày hoạt động", value: activeDays },
      ].map(({ label, value }, index) => (
        <div
          key={index}
          className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-600">
            {label}
          </p>
          <p className="text-2xl font-bold text-primary">
            <CountupCustom value={value} className="text-left" />
          </p>
        </div>
      ))}
      <div className="rounded-lg border border-indigo-100 bg-thirdly/30 p-4 shadow-sm">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-600">
          Trưởng nhóm
        </p>
        <p className="truncate text-lg font-bold text-primary">{leader}</p>
      </div>
    </div>
  );
};

export default GroupStats;
