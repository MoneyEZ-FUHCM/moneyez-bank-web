"use client";

import Rating4 from "@/assets/images/icons/4star.png";
import Rating from "@/assets/images/icons/rating.png";
import Star from "@/assets/images/icons/star.png";
import Admin from "@/assets/images/logo/avatar_admin.jpg";
import Image from "next/image";

const Comments = () => {
  const feedbacks = [
    {
      id: 1,
      name: "Dương Tôn Bảo",
      role: "Công nhân",
      avatar: Admin,
      feedback:
        "Tính năng góp quỹ nhóm quá tiện! Mình và bạn bè cùng tiết kiệm cho chuyến du lịch hè, giờ ai đóng bao nhiêu đều rõ ràng minh bạch.",
      rating: Rating,
    },
    {
      id: 2,
      name: "Thương Huyền",
      role: "Nội trợ",
      avatar: Admin,
      feedback:
        "Ứng dụng rất dễ dùng, có thể phân loại chi tiêu theo từng nhóm như ăn uống, mua sắm, học hành... Nhờ vậy mình kiểm soát được ngân sách tốt hơn.",
      rating: Rating,
    },
    {
      id: 3,
      name: "Gia Đức",
      role: "Quản lý",
      avatar: Admin,
      feedback:
        "Mình hay dùng hũ tiết kiệm trong app để dành tiền mua laptop. Nhìn số tiền tăng dần mỗi tuần cảm giác rất có động lực để góp quỹ nhiều hơn!",
      rating: Rating4,
    },
    {
      id: 4,
      name: "Minh Trí",
      role: "Kỹ sư",
      avatar: Admin,
      feedback:
        "Điều mình thích nhất là tính năng chatbot nhập chi tiêu siêu nhanh. Chỉ cần gõ 'ăn trưa 45k', không cần chọn danh mục hay ngày giờ gì cả, quá tiện!",
      rating: Rating4,
    },
  ];

  return (
    <section className="my-32 px-5 text-center">
      <div className="mb-3 flex justify-center">
        <div className="flex items-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2">
          <Image src={Star} alt="star" quality={100} width={20} height={20} />
          <p className="text-sm font-semibold text-[#fca61b]">Sự hài lòng</p>
        </div>
      </div>
      <h1 className="mb-3 text-2xl font-medium text-[#4d4d4d] sm:text-3xl lg:text-4xl">
        Đánh giá khách hàng
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="relative my-5 flex flex-col items-center rounded-3xl p-6 shadow-soft-green transition-all duration-300 md:p-8"
          >
            <Image
              src={feedback.avatar}
              alt={feedback.name}
              quality={100}
              className="absolute -top-6 size-16 rounded-full border"
            />
            <h2 className="text-[#4d4d4d]md:text-xl mt-4 text-lg font-semibold">
              {feedback.name}
            </h2>
            <p className="text-[12px] text-gray-500 md:text-sm">
              {feedback.role}
            </p>
            <p className="my-5 text-sm italic text-gray-500 md:text-base">
              "{feedback.feedback}"
            </p>
            <Image
              src={feedback.rating}
              alt="star"
              quality={100}
              className="mt-5 w-40 lg:w-56 2xl:w-60"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export { Comments };
