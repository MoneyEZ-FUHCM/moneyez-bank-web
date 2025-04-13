"use client";

import Star from "@/assets/images/icons/star.png";
import MobilePart from "@/assets/images/mobile-part.png";
import {
  BackgroundIntro,
  BackToTop,
  Comments,
  Functions,
  Packages,
  Reasons,
  ScrollReveal,
  Statistic,
  Supporter,
} from "@/components";
import Footer from "@/components/layouts/footer/footer";
import { Navbar } from "@/components/layouts/navbar/navbar";
import Image from "next/image";
import Typewriter from "typewriter-effect";

export default function Home() {
  return (
    <main className="transition-all duration-500">
      <div className="relative select-none overflow-hidden bg-yellow-100 transition-all duration-500">
        <Navbar />
        <div className="pt-[70px] lg:pt-[80px]">
          <section className="container mx-auto items-center justify-center py-10">
            <section className="flex min-h-[400px] flex-col justify-between lg:flex-row">
              <div className="mb-5 flex flex-1 flex-col items-center justify-center lg:items-start">
                <div className="flex flex-col justify-center gap-5">
                  <h1 className="text-center text-4xl text-[#4d4d4d] lg:text-left lg:text-[40px] xl:text-5xl 2xl:text-6xl">
                    <div className="mb-3 flex justify-center lg:w-fit">
                      <div className="flex max-w-[500px] items-center justify-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2 lg:justify-start">
                        <Image
                          src={Star}
                          alt="star"
                          quality={100}
                          className="h-5 w-5"
                        />
                        <p className="text-sm font-semibold text-[#fca61b]">
                          Chào mừng đến với MoneyEZ
                        </p>
                      </div>
                    </div>
                    <h1 className="mb-5 text-3xl font-bold text-primary transition-all duration-500 lg:text-4xl xl:text-[40px] 2xl:text-5xl">
                      Money<span className="text-secondary">EZ</span>
                    </h1>
                    <Typewriter
                      options={{
                        strings: [
                          '<span class="font-semibold transition-all duration-500">Quản Lý Tài Chính</span>',
                          '<span class="font-semibold transition-all duration-500">Tiết Kiệm Thông Minh</span>',
                        ],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </h1>
                  <h5 className="mx-10 text-center text-sm leading-7 text-gray-500 transition-all duration-500 md:mx-12 lg:mx-0 lg:text-left lg:text-[14px] xl:text-[16px]">
                    Ứng dụng giúp bạn dễ dàng quản lý tài chính, theo dõi và tối
                    ưu hóa hũ tiết kiệm mỗi ngày, từ đó giúp bạn đạt được mục
                    tiêu tài chính một cách nhanh chóng và hiệu quả!
                  </h5>
                  <div className="flex justify-center transition-all duration-500 lg:justify-start">
                    <button className="translate max-w-60 transform rounded-xl bg-[#009379] px-10 py-4 text-sm font-semibold text-superlight outline-none transition-all duration-200 active:scale-95">
                      🚀 Trải nghiệm ngay
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex min-h-[600px] flex-1 justify-center">
                <Image
                  src={MobilePart}
                  alt="mockup"
                  width={550}
                  height={400}
                  quality={100}
                />
              </div>
            </section>
          </section>
        </div>
        <div className="absolute bottom-0 h-16 min-w-full rounded-t-[100%] bg-white" />
      </div>
      <section className="container mx-auto select-none transition-all duration-500">
        <Supporter />
        <ScrollReveal>
          <Reasons />
        </ScrollReveal>
        <ScrollReveal>
          <Functions />
        </ScrollReveal>
        <ScrollReveal>
          <Statistic />
        </ScrollReveal>
        <ScrollReveal>
          <Comments />
        </ScrollReveal>
        {/* <ScrollReveal>
          <Packages />
        </ScrollReveal> */}
        <ScrollReveal>
          <BackgroundIntro />
        </ScrollReveal>
        <BackToTop />
        <Footer />
      </section>
    </main>
  );
}
