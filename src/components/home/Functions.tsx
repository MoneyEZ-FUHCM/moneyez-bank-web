import Contact from "@/assets/images/icons/contact.png";
import Price from "@/assets/images/icons/price.png";
import Secure from "@/assets/images/icons/secure.png";
import Star from "@/assets/images/icons/star.png";
import Statistic from "@/assets/images/icons/statistic.png";
import MobileFull from "@/assets/images/mobile-full.png";
import Image from "next/image";

const features = [
  { id: 1, src: Contact, label: "Trợ lý AI" },
  { id: 2, src: Secure, label: "Quản lý chi tiêu" },
  { id: 3, src: Price, label: "Quỹ nhóm" },
  { id: 4, src: Statistic, label: "Thống kê định kì" },
];

const Functions = () => {
  return (
    <section className="my-32 flex flex-col-reverse items-center lg:flex-row">
      <div className="mt-10 flex-1 lg:mt-0">
        <Image
          src={MobileFull}
          alt="Mobile view"
          quality={100}
          className="w-[93%]"
        />
      </div>
      <div className="h-full w-full flex-1">
        <div className="flex flex-col items-start justify-start gap-5">
          <div className="flex w-full flex-col items-center justify-center gap-3 lg:items-start">
            <div className="w-fit">
              <div className="flex items-center justify-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2">
                <Image
                  src={Star}
                  alt="star"
                  quality={100}
                  className="h-5 w-5"
                />
                <p className="text-sm font-semibold text-[#fca61b]">
                  Ứng dụng xịn xò
                </p>
              </div>
            </div>
            <h1 className="text-2xl font-medium text-[#4d4d4d] sm:text-3xl lg:text-4xl">
              Tính Năng
            </h1>
          </div>
          <p className="w-full text-center text-gray-500 lg:w-[90%] lg:text-left">
            Đây là một vài tính năng chính của app xịn nhất FPTU 2025
          </p>
          <div className="mt-7 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="col-span-1 flex w-full flex-col gap-5"
              >
                <button className="button-hire flex !w-full cursor-default items-center gap-7 rounded-[20px] border-[0.5px] !p-3 text-[#4d4d4d] shadow-soft-green">
                  <Image
                    src={feature.src}
                    alt={feature.label}
                    quality={100}
                    height={60}
                    width={60}
                  />
                  {feature.label}
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Functions };
