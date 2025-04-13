import Background from "@/assets/images/background-home.png";
import Star from "@/assets/images/icons/star.png";
import Image from "next/image";

const BackgroundIntro = () => {
  return (
    <section className="my-32 mb-10 mt-36 w-full px-5">
      <div
        className="rounded-[37px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${Background.src})`,
          minHeight: "400px",
        }}
      >
        <section className="flex items-center justify-center p-10 md:block md:text-left">
          <div className="flex min-h-[400px] flex-col lg:flex-row">
            <div className="flex w-full flex-1 flex-col items-center justify-center lg:items-start">
              <div className="flex flex-col justify-center gap-5">
                <h1 className="text-center text-4xl lg:text-left lg:text-[40px] xl:text-5xl 2xl:text-6xl">
                  <div className="mb-3 flex justify-center lg:w-fit">
                    <div className="flex max-w-[500px] items-center justify-center gap-2 rounded-3xl bg-[#FFF9F1] px-5 py-2 lg:justify-start">
                      <Image
                        src={Star}
                        alt="star"
                        quality={100}
                        className="h-5 w-5"
                      />
                      <p className="text-sm font-semibold text-[#fca61b]">
                        Trải nghiệm nào
                      </p>
                    </div>
                  </div>
                  <h1 className="mb-5 text-3xl font-bold text-[#4d4d4d] transition-all duration-500 lg:text-4xl xl:text-[40px] 2xl:text-5xl">
                    Giải Pháp Tiết Kiệm
                  </h1>
                  <h1 className="mb-2 text-3xl font-bold text-primary transition-all duration-500 lg:text-4xl xl:text-[40px] 2xl:text-5xl">
                    Thông Minh Cho Mọi Gia Đình
                  </h1>
                </h1>
                <div className="flex justify-center transition-all duration-500 lg:justify-start">
                  <button className="group relative flex h-[2.8em] cursor-pointer items-center overflow-hidden rounded-3xl border border-solid bg-primary p-[0.35em] pl-[1em] pr-[3.3em] text-[17px] font-medium tracking-wider text-[#4d4d4d]">
                    <span className="text-sm text-superlight">
                      🚀 Tải xuống
                    </span>
                    <div className="absolute right-[0.3em] ml-[1em] flex size-[2.2em] items-center justify-center overflow-hidden rounded-3xl bg-superlight transition-all duration-300 group-hover:w-[calc(100%-0.6em)] active:group-active:scale-95">
                      <svg
                        className="w-[1.1em] text-[orange] transition-transform duration-300 group-hover:translate-x-[0.1em] group-hover:scale-110 group-hover:transform group-hover:text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M21 5L19 12H7.37671M20 16H8L6 3H3M11 6L13 8L17 4M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                            strokeWidth="2"
                            stroke="#609084"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export { BackgroundIntro };
