"use client";

import Star from "@/assets/images/icons/star.png";
import { TOAST_STATUS } from "@/enums/globals";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { showToast } from "@/hooks/useShowToast";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const packagesData = [
  {
    id: 1,
    name: "Free",
    price: "0đ",
    period: "/ Tháng",
    description: "Trải nghiệm cơ bản các tính năng của ứng dụng",
    features: [
      "Sử dụng các tính năng cơ bản",
      "Hỗ trợ khách hàng 24/7",
      "Truy cập không giới hạn nội dung miễn phí",
    ],
    buttonText: "🚀 Trải nghiệm ngay",
  },
  {
    id: 2,
    name: "Premium",
    price: "199.000đ",
    period: "/ Tháng",
    description: "Mở khóa các tính năng nâng cao để có trải nghiệm tuyệt vời",
    features: [
      "Truy cập toàn bộ tính năng ứng dụng",
      "Hỗ trợ khách hàng VIP",
      "Không quảng cáo",
    ],
    buttonText: "🚀 Nâng cấp ngay",
  },
];

const Packages = () => {
  const handleUpGradePackage = () => {
    showToast(TOAST_STATUS.INFO, "Vui lòng đăng nhập để sử dụng dịch vụ");
  };

  return (
    <section className="my-32 px-5 text-center text-superlight">
      <div className="mb-3 flex justify-center">
        <div className="flex items-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2">
          <Image src={Star} alt="star" quality={100} width={20} height={20} />
          <p className="text-sm font-semibold text-[#fca61b]">Trải nghiệm</p>
        </div>
      </div>
      <h1 className="text-2xl font-medium text-[#4d4d4d] sm:text-3xl lg:text-4xl">
        Gói dịch vụ
      </h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:gap-16">
        {packagesData.map((pkg) => (
          <div
            key={pkg.id}
            className="group flex flex-col items-start rounded-3xl p-7 text-[#4d4d4d] shadow-soft-green transition-colors duration-300 hover:bg-primary hover:text-superlight"
          >
            <h3 className="mb-1 text-left text-gray-500 transition-all duration-300 group-hover:text-superlight">
              {pkg.name}
            </h3>
            <div className="flex w-full flex-col items-start gap-5">
              <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                {pkg.price} <span className="text-sm">{pkg.period}</span>
              </h1>
              <h4 className="text-left text-gray-500 transition-all duration-300 group-hover:text-superlight">
                {pkg.description}
              </h4>
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <CheckOutlined className="text-primary transition-all duration-300 group-hover:text-superlight" />
                  <p className="text-left font-medium">{feature}</p>
                </div>
              ))}
              <Link
                href={PATH_NAME.AUTH}
                onClick={handleUpGradePackage}
                className="relative mt-5 flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#e5f4f2] px-6 py-3 text-sm font-semibold text-[#009379] transition-all duration-300 hover:bg-superlight hover:text-primary active:scale-95 group-hover:bg-superlight"
              >
                {pkg.buttonText}
                <ArrowRightOutlined className="ml-1 translate-x-[-10px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Packages };
