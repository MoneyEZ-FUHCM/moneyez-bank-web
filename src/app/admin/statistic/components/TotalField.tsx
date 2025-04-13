import Bag from "@/assets/images/icons/ic_glass_bag.png";
import Cart from "@/assets/images/icons/ic_glass_buy.png";
import User from "@/assets/images/icons/ic_glass_users.png";
import Revenue from "@/assets/images/icons/revenue.png";
import { AdminDashboardInfo } from "@/types/dashboard.type";
import Image from "next/image";
import CountUp from "react-countup";

interface TotalFieldProps {
  data: AdminDashboardInfo;
}

const TotalField = ({ data }: TotalFieldProps) => {
  return (
    <section className="grid grid-cols-1 gap-5 transition-all duration-500 md:grid-cols-2 lg:grid-cols-4">
      <div className="bold flex items-center gap-5 rounded-xl bg-[#fff] px-6 py-10 text-white shadow-md transition-all duration-500">
        <div>
          <Image
            src={Cart}
            alt="error"
            width={80}
            height={80}
            quality={100}
            className="w-[80px]"
          />
        </div>
        <div>
          <p className="text-3xl font-bold text-[black]">
            <CountUp end={data.revenue} duration={2} />đ
          </p>
          <p className="text-[15px] font-semibold text-[#bdbdbd]">Doanh thu</p>
        </div>
      </div>
      <div className="bold flex items-center gap-5 rounded-xl bg-[#fff] px-6 py-10 text-white shadow-md transition-all duration-500">
        <div>
          <Image
            src={Revenue}
            alt="error"
            className="w-[80px]"
            width={80}
            height={80}
            quality={100}
          />
        </div>
        <div>
          <p className="text-3xl font-bold text-[black]">
            <CountUp end={data.numOfOrders ?? 0} duration={2} />
          </p>
          <p className="text-[15px] font-semibold text-[#bdbdbd]">Đơn hàng</p>
        </div>
      </div>
      <div className="bold flex items-center gap-5 rounded-xl bg-[#fff] px-6 py-10 text-white shadow-md transition-all duration-500">
        <div>
          <Image
            src={Bag}
            alt="error"
            width={80}
            height={80}
            quality={100}
            className="w-[80px]"
          />
        </div>
        <div>
          <p className="text-3xl font-bold text-[black]">
            <CountUp end={data.numOfStores} duration={2} />
          </p>
          <p className="text-[15px] font-semibold text-[#bdbdbd]">
            Hũ tiết kiệm
          </p>
        </div>
      </div>
      <div className="bold flex items-center gap-5 rounded-xl bg-[#fff] px-6 py-10 text-white shadow-md transition-all duration-500">
        <div>
          <Image
            src={User}
            alt="error"
            width={80}
            height={80}
            quality={100}
            className="w-[80px]"
          />
        </div>
        <div>
          <p className="text-3xl font-bold text-[black]">
            <CountUp end={data.numOfUsers} duration={2} />
          </p>
          <p className="text-[15px] font-semibold text-[#bdbdbd]">Người dùng</p>
        </div>
      </div>
    </section>
  );
};

export { TotalField };
