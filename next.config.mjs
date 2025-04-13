/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/moneyez-web",
  env: {
    NEXT_PUBLIC_API_KEY: "AIzaSyBjF8jvekmTSJ4us7PiI0GTJbNzR06z5lY",
    NEXT_PUBLIC_AUTH_DOMAIN: "exe201-9459a.firebaseapp.com",
    NEXT_PUBLIC_PROJECT_ID: "exe201-9459a",
    NEXT_PUBLIC_STORAGE_BUCKET: "exe201-9459a.appspot.com",
    NEXT_PUBLIC_MESSAGING_SENDER_ID: "285230826131",
    NEXT_PUBLIC_APP_ID: "1:285230826131:web:43cb5f1546cbbe4a5c8366",
    NEXT_PUBLIC_MEASUREMENT_ID: "G-QMB51P0NNZ",
    NEXT_PUBLIC_SECRET_KEY: "admin",
    NEXT_PUBLIC_RECAPTCHA_SECRET_KEY:
      "6LfWakkqAAAAAID4QJwk3_gSy2FclYio3WmzDYWp",
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "6LfWakkqAAAAABKFbRZGqp9i_aYrEu9YwDqVWfsT",
    NEXT_PUBLIC_BASE_URL: "https://easymoney.anttravel.online/api/v1",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },

      {
        protocol: "https",
        hostname: "freesvg.org",
      },

      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
