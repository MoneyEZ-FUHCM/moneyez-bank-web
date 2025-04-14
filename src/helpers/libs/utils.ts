import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import moment from "moment";
import { FormInstance } from "antd";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRequest(dateString: string | number | Date) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  } else {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = date.getTime() - timezoneOffset;
    const localDate = new Date(localTime);

    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const day = localDate.getDate().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
}

export function formatDate2(dateString: string | number | Date) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  } else {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = date.getTime() - timezoneOffset;
    const localDate = new Date(localTime);

    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const day = localDate.getDate().toString().padStart(2, "0");

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
}

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const removeHtmlTags = (html: string) => {
  return html.replace(/(<([^>]+)>)/gi, "").trim();
};

export function encryptData(
  data: string | CryptoJS.lib.WordArray,
  key: string | CryptoJS.lib.WordArray | undefined,
) {
  if (key === undefined) {
    throw new Error("Key cannot be undefined");
  }
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decryptData(
  ciphertext: string | CryptoJS.lib.CipherParams | undefined,
  key: string | CryptoJS.lib.WordArray,
) {
  try {
    if (ciphertext === undefined) {
      throw new Error("Ciphertext cannot be undefined");
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
}

export const PriceFormat = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export function formatTimestamp(timestampStr: string): string {
  const timestamp = new Date(timestampStr);
  return timestamp.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTimestampWithHour(timestampStr: string): string {
  const timestamp = new Date(timestampStr);
  return timestamp.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const validatePassword =
  (form: FormInstance) => (_: unknown, value: string) => {
    const password = form.getFieldValue("password");
    if (value && password && value !== password) {
      return Promise.reject("Mật khẩu không trùng");
    }
    return Promise.resolve();
  };

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(value)
    .replace(/\s₫/, "đ");

export const formatDate = (
  date: moment.MomentInput,
  pattern: string = "DD/MM/YYYY",
): string => {
  if (!date) return "N/A";
  return moment.utc(date).format(pattern);
};

export const calculateDaysDifference = (startDateStr: string) => {
  const startDate = new Date(startDateStr);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - startDate.getTime();
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return dayDifference;
};
