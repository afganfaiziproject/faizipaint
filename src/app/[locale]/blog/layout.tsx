import React from "react";

export const metadata = {
  title: "مجله تخصصی رنگ - رنگ افغان فیضی",
  description: "آموزش‌های تخصصی نقاشی ساختمان، رنگ‌های صنعتی، اپوکسی و تکنیک‌های رنگ‌آمیزی در مجله شرکت رنگ افغان فیضی.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full min-h-screen bg-transparent relative overflow-x-hidden">
      {/* فضای محتوای مقالات وبلاگ */}
      <div className="grow w-full relative">
        {children}
      </div>
    </div>
  );
}