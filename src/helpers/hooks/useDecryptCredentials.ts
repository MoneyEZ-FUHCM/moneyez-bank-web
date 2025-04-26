import { decryptData } from "@/helpers/libs/utils";
import Cookies from "js-cookie";

export function useDecryptCredentials() {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const encryptedEmail = Cookies.get("email");
  const encryptedPassword = Cookies.get("password");

  if (encryptedEmail !== null && encryptedPassword !== null) {
    const email = decryptData(encryptedEmail, secretKey as string);
    const password = decryptData(encryptedPassword, secretKey as string);
    return { email, password, secretKey };
  } else {
    console.warn("Email and password are not set in Cookies");
    return { email: "", password: "" };
  }
}
