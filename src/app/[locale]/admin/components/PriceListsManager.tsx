"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Search, Edit3, Trash2, Archive, CheckCircle2,
  X, Upload, Loader2, Calendar, MapPin, Users,
  FileText, ShieldCheck, Tag, DollarSign, Download, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ToastProvider";
import {
  getPriceLists,
  createPriceList,
  updatePriceList,
  archivePriceList,
  deletePriceList
} from "@/actions/priceList";
import { AFGHAN_PROVINCES, formatAfghanShamsiDate } from "@/lib/dateUtils";

interface PriceItem {
  productTitle: { fa: string; en: string; ps?: string };
  unitSize: string;
  currency: string;
  consumerPrice: number;
  retailerPrice: number;
  officialAgencyPrice: number;
}

export default function PriceListsManager() {
  const { showToast } = useToast();

  const [priceLists, setPriceLists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterArchived, setFilterArchived] = useState<"all" | "active" | "archived">("active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // فرم ایجاد / ویرایش نرخنامه
  const [formData, setFormData] = useState({
    _id: "",
    titleFa: "",
    titleEn: "",
    titlePs: "",
    versionCode: "AFP-PL-" + new Date().getFullYear(),
    allowedRoles: ["consumer", "retailer", "official_agency"],
    isAllProvinces: true,
    allowedProvinces: [] as string[],
    fileUrl: "",
    notesFa: "",
    notesEn: "",
    notesPs: "",
    items: [
      {
        productTitle: { fa: "رنگ روغنی براق آلکیدی سوپر", en: "Super Gloss Alkyd Enamel", ps: "" },
        unitSize: "گالن ۴ لیتری",
        currency: "AFN",
        consumerPrice: 850,
        retailerPrice: 780,
        officialAgencyPrice: 720
      },
      {
        productTitle: { fa: "رنگ پلاستیک مات پرمیوم", en: "Premium Matt Plastic Paint", ps: "" },
        unitSize: "حلب ۲۰ لیتری",
        currency: "AFN",
        consumerPrice: 2200,
        retailerPrice: 2000,
        officialAgencyPrice: 1850
      }
    ] as PriceItem[]
  });

  const fetchData = async () => {
    setIsLoading(true);
    const filter: any = {};
    if (filterProvince !== "all") filter.province = filterProvince;
    if (filterArchived === "active") filter.isArchived = false;
    if (filterArchived === "archived") filter.isArchived = true;

    const res = await getPriceLists(filter);
    if (res.success) {
      setPriceLists(res.data);
    } else {
      showToast(res.error || "خطا در دریافت نرخنامه‌ها", "error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filterProvince, filterArchived]);

  const handleAddNew = () => {
    setEditMode(false);
    setFormData({
      _id: "",
      titleFa: "نرخنامه رسمی رنگ افغان فیضی - " + formatAfghanShamsiDate(new Date()),
      titleEn: "Official Price List - " + new Date().toLocaleDateString('en-US'),
      titlePs: "د افغان فیضی رنګ رسمي نرخنامه",
      versionCode: "AFP-" + Date.now().toString().slice(-6),
      allowedRoles: ["consumer", "retailer", "official_agency"],
      isAllProvinces: true,
      allowedProvinces: [],
      fileUrl: "",
      notesFa: "قیمت‌ها به افغانی (AFN) بوده و تحویل درب کارخانه می‌باشد.",
      notesEn: "Prices in AFN, Ex-Factory terms.",
      notesPs: "نرخونه په افغانیو دي.",
      items: [
        {
          productTitle: { fa: "رنگ روغنی براق آلکیدی", en: "Gloss Alkyd Paint", ps: "" },
          unitSize: "گالن ۴ لیتری",
          currency: "AFN",
          consumerPrice: 850,
          retailerPrice: 780,
          officialAgencyPrice: 720
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (list: any) => {
    setEditMode(true);
    setFormData({
      _id: list._id,
      titleFa: list.title?.fa || list.titleFa || "",
      titleEn: list.title?.en || list.titleEn || "",
      titlePs: list.title?.ps || list.titlePs || "",
      versionCode: list.versionCode || "",
      allowedRoles: list.allowedRoles || ["consumer", "retailer", "official_agency"],
      isAllProvinces: list.isAllProvinces ?? true,
      allowedProvinces: list.allowedProvinces || [],
      fileUrl: list.fileUrl || "",
      notesFa: list.notes?.fa || "",
      notesEn: list.notes?.en || "",
      notesPs: list.notes?.ps || "",
      items: list.items && list.items.length > 0 ? list.items : []
    });
    setIsModalOpen(true);
  };

  const handleAddItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productTitle: { fa: "", en: "", ps: "" },
          unitSize: "گالن ۴ لیتری",
          currency: "AFN",
          consumerPrice: 0,
          retailerPrice: 0,
          officialAgencyPrice: 0
        }
      ]
    }));
  };

  const handleRemoveItemRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      if (field === 'titleFa') {
        newItems[index].productTitle.fa = val;
      } else if (field === 'titleEn') {
        newItems[index].productTitle.en = val;
      } else {
        (newItems[index] as any)[field] = val;
      }
      return { ...prev, items: newItems };
    });
  };

  const handleToggleProvince = (prov: string) => {
    setFormData(prev => {
      const current = [...prev.allowedProvinces];
      const exists = current.includes(prov);
      const updated = exists ? current.filter(p => p !== prov) : [...current, prov];
      return { ...prev, allowedProvinces: updated, isAllProvinces: false };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleFa.trim()) {
      showToast("عنوان نرخنامه الزامی است.", "warning");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: {
        fa: formData.titleFa,
        en: formData.titleEn,
        ps: formData.titlePs
      },
      versionCode: formData.versionCode,
      allowedRoles: formData.allowedRoles,
      isAllProvinces: formData.isAllProvinces,
      allowedProvinces: formData.isAllProvinces ? [] : formData.allowedProvinces,
      fileUrl: formData.fileUrl,
      notes: {
        fa: formData.notesFa,
        en: formData.notesEn,
        ps: formData.notesPs
      },
      items: formData.items
    };

    if (editMode && formData._id) {
      const res = await updatePriceList(formData._id, payload);
      if (res.success) {
        showToast("نرخنامه با موفقیت بروزرسانی شد.", "success");
        setIsModalOpen(false);
        fetchData();
      } else {
        showToast(res.error || "خطا در ویرایش نرخنامه", "error");
      }
    } else {
      const res = await createPriceList(payload);
      if (res.success) {
        showToast("نرخنامه جدید با موفقیت منتشر شد.", "success");
        setIsModalOpen(false);
        fetchData();
      } else {
        showToast(res.error || "خطا در ایجاد نرخنامه", "error");
      }
    }
    setIsSaving(false);
  };

  const handleArchive = async (id: string, currentlyArchived: boolean) => {
    const actionName = currentlyArchived ? "خروج از بایگانی" : "بایگانی کردن";
    if (confirm(`آیا از ${actionName} این نرخنامه اطمینان دارید؟`)) {
      const res = await archivePriceList(id, !currentlyArchived);
      if (res.success) {
        showToast(`نرخنامه با موفقیت ${currentlyArchived ? "فعال" : "بایگانی"} شد.`, "success");
        fetchData();
      } else {
        showToast(res.error || "خطا در تغییر وضعیت بایگانی", "error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف دائمی این نرخنامه اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
      const res = await deletePriceList(id);
      if (res.success) {
        showToast("نرخنامه با موفقیت حذف شد.", "success");
        fetchData();
      } else {
        showToast(res.error || "خطا در حذف نرخنامه", "error");
      }
    }
  };

  const filteredLists = priceLists.filter(list => {
    const q = searchQuery.toLowerCase();
    const matchTitle = (list.title?.fa && list.title.fa.includes(q)) || (list.title?.en && list.title.en.toLowerCase().includes(q)) || (list.versionCode && list.versionCode.toLowerCase().includes(q));
    return matchTitle;
  });

  return (
    <div className="flex flex-col gap-6">

      {/* هدر بخش نرخنامه */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Tag size={24} className="text-amber-500" />
            <span>مدیریت نرخنامه‌های ولایتی و قیمت‌گذاری چندسطحی</span>
          </h1>
          <p className="text-xs text-gray-500 mt-2 font-medium flex items-center gap-2">
            تنظیم قیمت تفکیکی برای مصرف‌کننده، پرچون‌فروش و نمایندگی رسمی با دسترسی ولایتی و تقویم شمسی دری (fa-AF)
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-amber-400 hover:bg-amber-500 text-gray-950 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-amber-400/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>انتشار نرخنامه جدید</span>
        </button>
      </div>

      {/* فیلترها و جستجو */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative grow max-w-md">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجوی نرخنامه بر اساس عنوان یا کد نسخه..."
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* فیلتر ولایت */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
            <MapPin size={16} className="text-amber-500 ml-1" />
            <select
              value={filterProvince}
              onChange={e => setFilterProvince(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none text-gray-700 dark:text-gray-300"
            >
              <option value="all">همه ولایات افغانستان</option>
              {AFGHAN_PROVINCES.map(p => (
                <option key={p.id} value={p.faName}>{p.faName}</option>
              ))}
            </select>
          </div>

          {/* فیلتر وضعیت بایگانی */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
            <Archive size={16} className="text-amber-500 ml-1" />
            <select
              value={filterArchived}
              onChange={e => setFilterArchived(e.target.value as any)}
              className="bg-transparent text-xs font-bold focus:outline-none text-gray-700 dark:text-gray-300"
            >
              <option value="active">نرخنامه‌های جاری و فعال</option>
              <option value="archived">آرشیو و نسخه‌های قدیمی</option>
              <option value="all">نمایش همه نسخه‌ها</option>
            </select>
          </div>
        </div>
      </div>

      {/* لیست نرخنامه‌ها */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 w-full">
            <Loader2 className="animate-spin text-amber-500" size={40} />
          </div>
        ) : filteredLists.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold text-xs border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">عنوان نرخنامه و کد</th>
                  <th className="px-6 py-4">ولایات مجاز</th>
                  <th className="px-6 py-4">سطوح دسترسی نقش</th>
                  <th className="px-6 py-4">تاریخ نشر (شمسی دری)</th>
                  <th className="px-6 py-4">تعداد اقلام</th>
                  <th className="px-6 py-4">وضعیت</th>
                  <th className="px-6 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filteredLists.map((list) => (
                  <tr key={list._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>{list.title?.fa || list.titleFa || "نرخنامه رسمی"}</span>
                        {list.fileUrl && (
                          <a href={list.fileUrl} target="_blank" rel="noreferrer" title="دانلود فایل PDF رسمی" className="text-red-500 hover:text-red-600">
                            <FileText size={16} />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{list.versionCode || "---"}</div>
                    </td>

                    <td className="px-6 py-4">
                      {list.isAllProvinces ? (
                        <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold">
                          سراسر افغانستان (تمام ۳۴ ولایت)
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(list.allowedProvinces || []).map((prov: string) => (
                            <span key={prov} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              {prov}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(list.allowedRoles || []).map((role: string) => (
                          <span key={role} className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {role === 'consumer' ? 'مصرف‌کننده' : role === 'retailer' ? 'پرچون‌فروش' : 'نمایندگی رسمی'}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300">
                      {list.publishedAtShamsi || "---"}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-xs">
                      {list.items?.length || 0} قلم رنگ
                    </td>

                    <td className="px-6 py-4">
                      {list.isArchived ? (
                        <span className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit">
                          <Archive size={12} /> بایگانی شده
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 size={12} /> جاری و فعال
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(list)}
                          className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-amber-500 rounded-xl transition-colors cursor-pointer"
                          title="ویرایش نرخنامه"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleArchive(list._id, list.isArchived)}
                          className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-blue-500 rounded-xl transition-colors cursor-pointer"
                          title={list.isArchived ? "خروج از آرشیو" : "بایگانی نرخنامه"}
                        >
                          <Archive size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(list._id)}
                          className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                          title="حذف دائمی"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 font-bold">
            هیچ نرخنامه‌ای با این شرایط یافت نشد.
          </div>
        )}
      </div>

      {/* مودال ایجاد / ویرایش نرخنامه */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <Tag size={20} className="text-amber-500" />
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">
                    {editMode ? "ویرایش نرخنامه رسمی" : "انتشار نرخنامه رسمی جدید (افغان فیضی)"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col grow overflow-hidden bg-white dark:bg-gray-950">
                <div className="p-6 overflow-y-auto grow custom-scrollbar space-y-6">

                  {/* اطلاعات کلی نرخنامه */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-black text-gray-400">عنوان نرخنامه (فارسی دری) <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.titleFa}
                        onChange={e => setFormData({ ...formData, titleFa: e.target.value })}
                        placeholder="نرخنامه رسمی رنگ‌های ساختمانی و صنعتی - فصل خزان ۱۴۰۳"
                        className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-gray-400">کد نسخه / رفرنس</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.versionCode}
                        onChange={e => setFormData({ ...formData, versionCode: e.target.value })}
                        placeholder="AFP-PL-2024-Q3"
                        className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* محدودیت ولایات */}
                  <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                        <MapPin size={16} className="text-amber-500" />
                        <span>منطقه و ولایات مجاز جهت رؤیت قیمت</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isAllProvinces}
                          onChange={e => setFormData({ ...formData, isAllProvinces: e.target.checked })}
                          className="w-4 h-4 text-amber-500 rounded"
                        />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">سراسر افغانستان (تمام ولایات)</span>
                      </label>
                    </div>

                    {!formData.isAllProvinces && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
                        {AFGHAN_PROVINCES.map(prov => {
                          const isChecked = formData.allowedProvinces.includes(prov.faName);
                          return (
                            <button
                              key={prov.id}
                              type="button"
                              onClick={() => handleToggleProvince(prov.faName)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${isChecked ? 'bg-amber-400 text-gray-950 shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                            >
                              {prov.faName}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* جدول قیمت اقلام محصول */}
                  <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                        <DollarSign size={16} className="text-emerald-500" />
                        <span>اقلام نرخنامه و قیمت‌گذاری تفکیکی (بر حسب افغانی AFN)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddItemRow}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Plus size={14} /> افزودن ردیف محصول
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-right">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500">
                          <tr>
                            <th className="p-2.5">نام محصول رنگ</th>
                            <th className="p-2.5">واحد / بسته‌بندی</th>
                            <th className="p-2.5 text-blue-600">قیمت مصرف‌کننده</th>
                            <th className="p-2.5 text-amber-600">قیمت پرچون‌فروش</th>
                            <th className="p-2.5 text-emerald-600">قیمت نمایندگی رسمی</th>
                            <th className="p-2.5 w-10">حذف</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {formData.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={item.productTitle.fa}
                                  onChange={e => handleItemChange(idx, 'titleFa', e.target.value)}
                                  placeholder="مثال: رنگ روغنی سوپر براق"
                                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 font-bold outline-none focus:border-amber-400"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={item.unitSize}
                                  onChange={e => handleItemChange(idx, 'unitSize', e.target.value)}
                                  placeholder="گالن ۴ لیتری"
                                  className="w-28 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 font-bold outline-none focus:border-amber-400"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={item.consumerPrice}
                                  onChange={e => handleItemChange(idx, 'consumerPrice', Number(e.target.value))}
                                  className="w-24 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-2 font-bold text-blue-700 dark:text-blue-300 outline-none"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={item.retailerPrice}
                                  onChange={e => handleItemChange(idx, 'retailerPrice', Number(e.target.value))}
                                  className="w-24 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-2 font-bold text-amber-700 dark:text-amber-300 outline-none"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={item.officialAgencyPrice}
                                  onChange={e => handleItemChange(idx, 'officialAgencyPrice', Number(e.target.value))}
                                  className="w-24 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-2 font-bold text-emerald-700 dark:text-emerald-300 outline-none"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemRow(idx)}
                                  className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* آپلود فایل رسمی PDF */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-gray-400 flex items-center gap-1.5">
                      <FileText size={16} className="text-red-500" />
                      <span>فایل PDF نرخنامه ممهور به مهر رسمی شرکت (اختیاری)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.fileUrl}
                        onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                        placeholder="https://.../pricelist.pdf"
                        className="grow border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                      />
                      <label className="bg-gray-100 dark:bg-gray-800 hover:bg-amber-400 hover:text-gray-950 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shrink-0">
                        <Upload size={14} /> آپلود PDF
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const fd = new FormData();
                            fd.append('file', f);
                            const r = await fetch('/api/upload', { method: 'POST', body: fd });
                            const d = await r.json();
                            if (d.success) {
                              setFormData({ ...formData, fileUrl: d.url });
                              showToast("فایل PDF نرخنامه با موفقیت آپلود شد.", "success");
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                </div>

                <div className="mt-auto border-t border-gray-100 dark:border-gray-800 p-4 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-white dark:hover:bg-gray-800 text-sm cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-amber-400 hover:bg-amber-500 text-gray-950 px-6 py-2.5 rounded-xl font-black flex items-center gap-2 text-sm shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    <span>{editMode ? "بروزرسانی نرخنامه" : "انتشار رسمی نرخنامه"}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
