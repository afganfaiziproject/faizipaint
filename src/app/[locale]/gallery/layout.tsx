import React from "react";

export const metadata = {
  title: "مرکز رسانه و گالری - رنگ افغان فیضی",
  description: "آرشیو ویدیوهای خطوط تولید، پروژه‌های اجرایی، تیزرها و کاتالوگ‌های رنگ افغان فیضی",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
  <div className="flex flex-col w-full min-h-screen bg-transparent relative overflow-x-hidden">
      {/* فضای تزریق افکت‌های سراسری ترانزیشن و محتوای داینامیک گالری */}
      <div className="grow w-full relative">
        {children}
      </div>
    </div>
  );
}