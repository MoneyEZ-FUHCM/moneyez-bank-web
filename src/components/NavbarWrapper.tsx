// "use client";

// import Star from "@/assets/images/icons/star.png";
// import MobilePart from "@/assets/images/mobile-part.png";
// import { PATH_NAME } from "@/helpers/constants/pathname";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import Typewriter from "typewriter-effect";
// import Footer from "./layouts/footer/footer";
// import { Navbar } from "./layouts/navbar/navbar";

// const NavbarWrapper = ({ children }: { children: React.ReactNode }) => {
//   const pathname = usePathname();
//   const { ADMIN, AUTH, NOT_FOUND, USER, ACCEPT_INIVITATION } = PATH_NAME;
//   const showNavbar =
//     pathname !== AUTH &&
//     pathname !== NOT_FOUND &&
//     !pathname.startsWith(ADMIN) &&
//     !pathname.startsWith(USER) &&
//     !pathname.startsWith(ACCEPT_INIVITATION);

//   if (!showNavbar) return <>{children}</>;

//   return (

//     <>{children}</>

//   );
// };

// export default NavbarWrapper;
