import slide_5 from "@/assets/images/slider/undraw_data-reports_uylc.png";
import slide_6 from "@/assets/images/slider/undraw_data_0ml2.png";
import slide_1 from "@/assets/images/slider/undraw_diary_f7r8.png";
import slide_2 from "@/assets/images/slider/undraw_nakamoto_uy67.png";
import slide_3 from "@/assets/images/slider/undraw_pay-online_806n.png";
import slide_4 from "@/assets/images/slider/undraw_transfer-money_h9s3.png";
import { Carousel } from "antd";
import ImageSliderCustom from "./common/ImageSliderCustom";

const CarouselDemo = () => (
  <Carousel autoplay className="m-5 select-none rounded-xl">
    <ImageSliderCustom src={slide_1} alt="slide1" />
    <ImageSliderCustom src={slide_2} alt="slide2" />
    <ImageSliderCustom src={slide_3} alt="slide3" />
    <ImageSliderCustom src={slide_4} alt="slide4" />
    <ImageSliderCustom src={slide_5} alt="slide5" />
    <ImageSliderCustom src={slide_6} alt="slide6" />
  </Carousel>
);

export { CarouselDemo };
