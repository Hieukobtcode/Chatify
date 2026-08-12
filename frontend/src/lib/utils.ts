import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatOnlineTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "vừa xong";

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) {
    return "vừa xong";
  } else if (diffMins < 60) {
    return `${diffMins} phút`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày`;
  } else if (diffWeeks < 5) {
    return `${diffWeeks} tuần`;
  } else if (diffMonths < 12) {
    return `${diffMonths} tháng`;
  } else {
    return `${diffYears} năm`;
  }
};

export const formatMessageTime = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeStr = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (messageDate.getTime() === today.getTime()) {
    return timeStr;
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return `Hôm qua ${timeStr}`;
  } else if (date.getFullYear() === now.getFullYear()) {
    return `${date.getDate()} thg ${date.getMonth() + 1}, ${timeStr}`;
  } else {
    return `${date.getDate()} thg ${date.getMonth() + 1}, ${date.getFullYear()} ${timeStr}`;
  }
};