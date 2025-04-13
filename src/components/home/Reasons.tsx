import Contact from "@/assets/images/icons/contact.png";
import Price from "@/assets/images/icons/price.png";
import Secure from "@/assets/images/icons/secure.png";
import Star from "@/assets/images/icons/star.png";
import Statistic from "@/assets/images/icons/statistic.png";
import Image from "next/image";

const reasons = [
  {
    icon: Secure,
    title: "Bảo mật thông tin chi tiêu",
    description:
      "Dữ liệu chi tiêu của bạn luôn được bảo vệ an toàn với công nghệ bảo mật tiên tiến.",
  },
  {
    icon: Contact,
    title: "Hỗ trợ thông minh 24/7",
    description:
      "Giải đáp thắc mắc nhanh chóng với chatbot tích hợp, hỗ trợ bạn quản lý chi tiêu hiệu quả hơn.",
  },
  {
    icon: Price,
    title: "Lập ngân sách dễ dàng",
    description:
      "Theo dõi chi tiêu, đặt hạn mức ngân sách và nhận gợi ý tiết kiệm thông minh giúp bạn kiểm soát tài chính cá nhân tốt hơn.",
  },
  {
    icon: Statistic,
    title: "Thống kê chi tiêu trực quan",
    description:
      "Xem báo cáo chi tiêu theo danh mục, biểu đồ minh họa giúp bạn hiểu rõ thói quen tiêu dùng của mình.",
  },
];

const Reasons = () => {
  return (
    <section className="my-32 flex flex-col items-center px-5 sm:px-8">
      <div className="mb-3 w-fit">
        <div className="flex items-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2">
          <Image src={Star} alt="star" quality={100} width={20} height={20} />
          <p className="text-sm font-semibold text-[#fca61b]">
            Lợi ích tuyệt vời
          </p>
        </div>
      </div>
      <h1 className="text-2xl font-medium text-[#4d4d4d] sm:text-3xl lg:text-4xl">
        Tại sao nên chọn chúng tôi?
      </h1>
      <div className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reasons.map((reason, index) => (
          <div key={index} className="flex flex-col items-start">
            <Image
              src={reason.icon}
              alt={reason.title}
              width={75}
              height={75}
              quality={100}
              priority
              className="mb-3"
            />
            <h2 className="text-lg font-semibold text-[#4d4d4d] sm:min-h-[80px] sm:text-xl lg:text-2xl">
              {reason.title}
            </h2>
            <p className="text-sm text-gray-500 sm:text-base">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Reasons };
