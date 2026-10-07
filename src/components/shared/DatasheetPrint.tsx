"use client";

import React, { forwardRef } from "react";
import QRCode from "react-qr-code";
import { Award, ShieldCheck, CheckCircle } from "lucide-react";

interface DatasheetPrintProps {
  product: any;
  locale: string;
  categories?: any[];
  brands?: any[];
  brand?: any;
}

const DatasheetPrint = forwardRef<HTMLDivElement, DatasheetPrintProps>(
  ({ product, locale, categories = [], brands = [] }, ref) => {
    if (!product) return null;

    const isRtl = locale === "fa" || locale === "ar" || locale === "ps";

    const title = isRtl
      ? (product.faTitle || product.title?.fa || product.title || "")
      : (product.enTitle || product.title?.en || product.title || "");

    const description = isRtl
      ? (product.faDesc || product.description?.fa || product.description || "")
      : (product.enDesc || product.description?.en || product.description || "");

    const brandName = product.brandId?.faName 
      ? (isRtl ? product.brandId.faName : (product.brandId.enName || product.brandId.faName))
      : (isRtl ? "رنگ افغان فیضی" : "Afghan Faizi Paint");

    const categoryMap: Record<string, { fa: string; en: string }> = {
      oil: { fa: "رنگ روغنی (آلکیدی)", en: "Alkyd Oil Paint" },
      plastic: { fa: "رنگ پلاستیک و اکریلیک", en: "Plastic & Acrylic Emulsion" },
      instant: { fa: "رنگ و جلای فوری", en: "Instant Nitrocellulose & Wood Lacquer" },
      industrial: { fa: "رنگ صنعتی و اپوکسی", en: "Industrial & Epoxy Coating" },
      primers: { fa: "آستری و ضدزنگ", en: "Primers & Anti-Rust" },
      decorative: { fa: "رنگ‌های دکوراتیو", en: "Decorative Coatings" },
      tools: { fa: "حلال‌ها و ابزار", en: "Solvents & Tools" }
    };

    const catName = categoryMap[product.mainCat] 
      ? (isRtl ? categoryMap[product.mainCat].fa : categoryMap[product.mainCat].en)
      : (product.category || (isRtl ? "رنگ تخصصی" : "Specialty Paint"));

    const productImage = product.images?.main || product.image || "/images/placeholder-paint.png";

    // استخراج مشخصات تخصصی رنگ
    const resolveText = (val: any) => {
      if (!val) return "-";
      if (typeof val === "string") return val;
      return (isRtl ? (val.fa || val.ps || val.en) : (val.en || val.fa)) || "-";
    };

    const resinBase = resolveText(product.specs?.resinBase);
    const thinnerType = resolveText(product.specs?.thinnerType);
    
    const surfaceDry = resolveText(product.specs?.dryingTime?.surfaceDry);
    const fullDry = resolveText(product.specs?.dryingTime?.fullDry);
    const dryingTimeDisplay = `${surfaceDry} (سطحی) / ${fullDry} (کامل)`;

    const coverage = resolveText(product.specs?.coverage) !== "-" 
      ? resolveText(product.specs?.coverage) 
      : (product.specs?.coverageRate ? `${product.specs.coverageRate} m²/L` : "۱۰ الی ۱۲ مترمربع بر لیتر");

    const standardCodes = Array.isArray(product.specs?.standardCodes) && product.specs.standardCodes.length > 0
      ? product.specs.standardCodes.join(", ")
      : (product.specs?.colorCode || "RAL Standard / ISO 9001");

    const packagingSizes = Array.isArray(product.specs?.packagingSizes) && product.specs.packagingSizes.length > 0
      ? product.specs.packagingSizes.join(" - ")
      : (isRtl ? "۱ لیتری، ۴ لیتری (گالن)، ۲۰ لیتری (حلب)" : "1L, 4L (Gallon), 20L (Pail)");

    const applicationMethod = resolveText(product.specs?.applicationMethod) !== "-"
      ? resolveText(product.specs?.applicationMethod)
      : (isRtl ? "قلم‌مو، غلطک و پیستوله ایرلس" : "Brush, Roller & Airless Spray");

    const issueDate = new Date().toLocaleDateString(isRtl ? "fa-AF" : "en-US");
    const documentNo = `TDS-AFP-${String(product._id || product.id || "001").slice(-8).toUpperCase()}`;
    const pageUrl = typeof window !== "undefined" ? window.location.href : "https://afghanfaizipaint.com";

    return (
      <div
        ref={ref}
        id="datasheet-print"
        dir={isRtl ? "rtl" : "ltr"}
        className="w-[210mm] min-h-[297mm] mx-auto p-8 md:p-12 bg-white text-gray-900 flex flex-col gap-8 print:p-8 print:m-0 print:shadow-none shadow-xl relative"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 overflow-hidden">
          <span className="text-9xl font-black rotate-[-35deg] whitespace-nowrap">
            Afghan Faizi Paint
          </span>
        </div>

        <div className="relative z-10 flex flex-col h-full w-full gap-8">

          {/* هدر برگه فنی */}
          <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-black tracking-tight text-gray-950">
                {isRtl ? "شرکت تولید رنگ افغان فیضی" : "Afghan Faizi Paint Co."}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Product Technical Datasheet (TDS)
              </p>
            </div>
            <div className="text-left" dir="ltr">
              <p className="text-[10px] font-bold text-gray-400 text-end">Doc No: {documentNo}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5 text-end">Issue Date: {issueDate}</p>
            </div>
          </div>

          {/* خلاصه مشخصات محصول و تصویر */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row items-stretch bg-gray-50 p-6 rounded-2xl border border-gray-100 gap-6">
              <div className="flex flex-col gap-3 flex-[2] justify-center">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                    {isRtl ? "شناسنامه فنی محصول رنگ" : "Paint Technical ID"}
                  </span>
                  <h4 className="text-xl font-black text-gray-950 mt-1">{title}</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-600 text-justify whitespace-pre-wrap">
                  {description}
                </p>
              </div>
              <div className="flex flex-[1] justify-center items-center h-auto min-h-[120px]">
                <img src={productImage} alt={title} className="max-h-[160px] object-contain mix-blend-multiply" />
              </div>
            </div>

            {(product.hasWarning || product.warningMessageFa || product.warningMessageEn) && (
              <div className="border border-red-200 bg-red-50/70 rounded-2xl p-4 flex items-start gap-3 w-full">
                <span className="text-red-500 text-lg mt-0.5 shrink-0">⚠</span>
                <div>
                  <h3 className="text-xs font-black text-red-700 mb-1 text-start">
                    {isRtl ? "نکات ایمنی و بهداشت (MSDS Summary)" : "Safety & Health Precautions"}
                  </h3>
                  <p className="text-[11px] font-medium text-red-900/80 leading-relaxed text-justify">
                    {isRtl ? (product.warningMessageFa || product.warningMessage?.fa) : (product.warningMessageEn || product.warningMessage?.en)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* جدول مشخصات فنی و مهندسی رنگ */}
          <div className="flex flex-col gap-3 w-full">
            <h5 className={`text-xs font-black text-gray-900 ${isRtl ? 'border-r-4 pr-2' : 'border-l-4 pl-2'} border-amber-400`}>
              {isRtl ? "جدول مشخصات و پارامترهای فنی رنگ" : "Paint Technical Specifications"}
            </h5>

            <div className="grid grid-cols-3 gap-6 items-stretch h-full">
              <div className="col-span-2 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <table className={`w-full text-xs ${isRtl ? 'text-right' : 'text-left'} border-collapse h-full`}>
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                      <th className="px-4 py-3 w-1/3 text-start">{isRtl ? "پارامتر فنی" : "Parameter"}</th>
                      <th className="px-4 py-3 text-start">{isRtl ? "مشخصه مهندسی" : "Specification"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium text-gray-700 h-full">
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "گروه / دسته‌بندی" : "Category"}</td>
                      <td className="px-4 py-3 text-start">{brandName} - {catName}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "پایه رزین (Resin Base)" : "Resin Base"}</td>
                      <td className="px-4 py-3 text-start"><bdi>{resinBase}</bdi></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "نوع حلال / تینر" : "Thinner / Solvent"}</td>
                      <td className="px-4 py-3 text-start"><bdi>{thinnerType}</bdi></td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "میزان پوشش‌دهی (m²/L)" : "Coverage Rate"}</td>
                      <td className="px-4 py-3 text-start"><bdi>{coverage}</bdi></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "زمان خشک شدن" : "Drying Time"}</td>
                      <td className="px-4 py-3 leading-relaxed text-start">{dryingTimeDisplay}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "کدهای استاندارد / شید" : "Color Codes / RAL"}</td>
                      <td className="px-4 py-3 text-start"><bdi>{standardCodes}</bdi></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "روش اجرا" : "Application Method"}</td>
                      <td className="px-4 py-3 text-start">{applicationMethod}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-gray-900 text-start">{isRtl ? "بسته‌بندی‌های استاندارد" : "Packaging"}</td>
                      <td className="px-4 py-3 text-start">{packagingSizes}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-span-1 flex flex-col gap-6 h-full">
                <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center bg-white shadow-sm flex-1 min-h-[110px]">
                  <QRCode value={pageUrl} size={65} />
                  <div className="mt-2 text-center text-[9px] font-bold text-gray-500">
                    {isRtl ? "اسکن برای دریافت کاتالوگ رنگ" : "Scan to view color catalog"}
                  </div>
                </div>

                <div className="shrink-0 h-[48px] border border-gray-200 rounded-xl px-2.5 py-1.5 flex items-center bg-gray-50/50 shadow-sm gap-2.5">
                  <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <Award size={16} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-[11px] font-black text-gray-800 leading-tight">ISO 9001:2015</div>
                    <div className="text-[7px] font-bold text-gray-500 mt-0.5 text-start leading-tight">
                      {isRtl ? "مدیریت کیفیت تولید رنگ" : "Quality Management Standard"}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 h-[48px] border border-gray-200 rounded-xl px-2.5 py-1.5 flex items-center bg-gray-50/50 shadow-sm gap-2.5">
                  <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-[11px] font-black text-gray-800 leading-tight">RAL Standard</div>
                    <div className="text-[7px] font-bold text-gray-500 mt-0.5 text-start leading-tight">
                      {isRtl ? "انطباق با کالیته رال آلمان" : "German RAL Color System"}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 h-[48px] border border-gray-200 rounded-xl px-2.5 py-1.5 flex items-center bg-gray-50/50 shadow-sm gap-2.5">
                  <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle size={16} className="text-amber-600" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-[11px] font-black text-gray-800 leading-tight">ASTM Standards</div>
                    <div className="text-[7px] font-bold text-gray-500 mt-0.5 text-start leading-tight">
                      {isRtl ? "تست چسبندگی و سایش" : "Adhesion & Wear Testing"}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4 text-center w-full mt-2">
              <h3 className="text-xs font-black text-emerald-800 mb-2">
                {isRtl ? "تضمین اصالت و کنترل کیفیت رنگ" : "Quality & Performance Assurance"}
              </h3>
              <p className="text-[11px] font-medium text-emerald-900/80 leading-relaxed mx-auto text-justify sm:text-center">
                {isRtl
                  ? "این رنگ تحت نظارت دقیق آزمایشگاه شیمی و کنترل کیفی شرکت رنگ افغان فیضی تولید شده و دارای مقاومت عالی در برابر شرایط آب و هوایی افغانستان می‌باشد."
                  : "Formulated and tested in Afghan Faizi Paint quality laboratories for maximum durability, opacity, and weather resistance."}
              </p>
            </div>
          </div>

          {/* فوتر برگه فنی */}
          <div className="mt-auto pt-8 border-t border-dashed border-gray-300 flex justify-between items-center text-[10px] font-medium text-gray-400">
            <p className="text-start">
              {isRtl ? "تأیید شده توسط واحد کنترل کیفیت (QC) رنگ افغان فیضی" : "Approved by Afghan Faizi Paint Quality Control (QC)"}
            </p>
            <p className="text-end font-mono" dir="ltr">www.afghanfaizipaint.com</p>
          </div>

        </div>
      </div>
    );
  }
);

DatasheetPrint.displayName = "DatasheetPrint";

export default DatasheetPrint;