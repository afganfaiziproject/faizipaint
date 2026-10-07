"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Search, Edit3, Trash2, Image as ImageIcon, GripVertical,
  X, Upload, CheckCircle2, Wand2, Loader2, Star, ChevronLeft, ChevronRight,
  LayoutGrid, List as ListIcon, AlignJustify, Filter, ArrowDownAZ, ArrowUpZA, ArrowUpDown,
  FileText, ShieldAlert, Layers, Droplets, Clock, Paintbrush, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminShortcuts } from "../hooks/useAdminShortcuts";
import { getProducts, createProduct, updateProduct, deleteProduct, updateProductsOrder } from "@/actions/product";
import { getBrands } from "@/actions/brand";
import { getCategories } from "@/actions/category";
import { useToast } from "../components/ToastProvider";

export default function ProductsManager() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [editMode, setEditMode] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [translatingField, setTranslatingField] = useState<string | null>(null);

  // استیت‌های فیلتر مرحله‌ای
  const [filterMain, setFilterMain] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterSub, setFilterSub] = useState("all");

  // استیت‌های سورت و حالت ترتیب دستی
  const [sortBy, setSortBy] = useState("custom");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [originalProductsBackup, setOriginalProductsBackup] = useState<any[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "compact" | "grid">("list");

  // فرم محصولات تخصصی رنگ افغان فیضی
  const initialFormState = {
    _id: "",
    brandId: "",
    slug: "",
    faTitle: "",
    enTitle: "",
    psTitle: "",
    mainCat: "oil",
    category: "",
    faDesc: "",
    enDesc: "",
    psDesc: "",
    visibilityStatus: "published",
    isFeatured: false,
    
    // مشخصات فنی مهندسی رنگ
    resinBaseFa: "",
    resinBaseEn: "",
    thinnerTypeFa: "",
    thinnerTypeEn: "",
    surfaceDryFa: "",
    surfaceDryEn: "",
    fullDryFa: "",
    fullDryEn: "",
    recoatIntervalFa: "",
    recoatIntervalEn: "",
    coverageFa: "",
    coverageEn: "",
    coverageRate: 10,
    colorCode: "",
    standardCodes: "",
    glossLevelFa: "",
    glossLevelEn: "",
    applicationMethodFa: "",
    applicationMethodEn: "",
    packagingSizes: "۱ لیتری، گالن ۴ لیتری، حلب ۲۰ لیتری",
    density: "",
    viscosity: "",
    washabilityFa: "",
    shelfLifeFa: "",
    vocLevel: "",
    
    // هشدارها و ایمنی
    hasWarning: false,
    warningMessageFa: "",
    warningMessageEn: "",
    warningMessagePs: "",
    
    // تصاویر و اسناد فنی (TDS)
    mainImage: "",
    colorSwatchImage: "",
    datasheetPdf: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  const tabList = ["basic", "specs", "media"];

  const fetchData = async () => {
    setIsLoading(true);
    const [productsRes, brandsRes, catsRes] = await Promise.all([
      getProducts({ status: 'all' }),
      getBrands(),
      getCategories()
    ]);
    if (productsRes.success) setProducts(productsRes.data);
    if (brandsRes?.success) setBrandsList(brandsRes.data);
    if (catsRes?.success) setCategoriesList(catsRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useAdminShortcuts({
    activeTab: activeTab,
    setActiveTab: setActiveTab,
    tabsList: isModalOpen ? tabList : [],
    closeModal: () => setIsModalOpen(false),
    onAddNew: () => { if (!isModalOpen) handleAddNew(); }
  });

  const mainCategories = categoriesList.filter(c => c.iconName === 'main');
  const subCategories = categoriesList.filter(c => c.parent === formData.mainCat && c.iconName !== 'main');
  const statusOptions = categoriesList.filter(c => c.iconName === 'status');

  const handleEdit = (product: any) => {
    setEditMode(true);
    setFormData({
      _id: product._id,
      brandId: product.brandId?._id || product.brandId || "",
      slug: product.slug || "",
      faTitle: product.faTitle || product.title?.fa || "",
      enTitle: product.enTitle || product.title?.en || "",
      psTitle: product.psTitle || product.title?.ps || "",
      mainCat: product.mainCat || "oil",
      category: product.category || "",
      visibilityStatus: product.status || "published",
      isFeatured: product.isFeatured || false,
      faDesc: product.faDesc || product.description?.fa || "",
      enDesc: product.enDesc || product.description?.en || "",
      psDesc: product.psDesc || product.description?.ps || "",
      
      resinBaseFa: product.specs?.resinBase?.fa || "",
      resinBaseEn: product.specs?.resinBase?.en || "",
      thinnerTypeFa: product.specs?.thinnerType?.fa || "",
      thinnerTypeEn: product.specs?.thinnerType?.en || "",
      surfaceDryFa: product.specs?.dryingTime?.surfaceDry?.fa || "",
      surfaceDryEn: product.specs?.dryingTime?.surfaceDry?.en || "",
      fullDryFa: product.specs?.dryingTime?.fullDry?.fa || "",
      fullDryEn: product.specs?.dryingTime?.fullDry?.en || "",
      recoatIntervalFa: product.specs?.dryingTime?.recoatInterval?.fa || "",
      recoatIntervalEn: product.specs?.dryingTime?.recoatInterval?.en || "",
      coverageFa: product.specs?.coverage?.fa || "",
      coverageEn: product.specs?.coverage?.en || "",
      coverageRate: product.specs?.coverageRate || 10,
      colorCode: product.specs?.colorCode || "",
      standardCodes: Array.isArray(product.specs?.standardCodes) ? product.specs.standardCodes.join(', ') : (product.specs?.standardCodes || ""),
      glossLevelFa: product.specs?.glossLevel?.fa || "",
      glossLevelEn: product.specs?.glossLevel?.en || "",
      applicationMethodFa: product.specs?.applicationMethod?.fa || "",
      applicationMethodEn: product.specs?.applicationMethod?.en || "",
      packagingSizes: Array.isArray(product.specs?.packagingSizes) ? product.specs.packagingSizes.join('، ') : (product.specs?.packagingSizes || "۱ لیتری، گالن ۴ لیتری، حلب ۲۰ لیتری"),
      density: product.specs?.density || "",
      viscosity: product.specs?.viscosity || "",
      washabilityFa: product.specs?.washability?.fa || "",
      shelfLifeFa: product.specs?.shelfLife?.fa || "",
      vocLevel: product.specs?.vocLevel || "",
      
      hasWarning: product.hasWarning || false,
      warningMessageFa: product.warningMessageFa || product.warningMessage?.fa || "",
      warningMessageEn: product.warningMessageEn || product.warningMessage?.en || "",
      warningMessagePs: product.warningMessagePs || product.warningMessage?.ps || "",
      
      mainImage: product.images?.main || "",
      colorSwatchImage: product.images?.colorSwatch || "",
      datasheetPdf: product.images?.datasheetPdf || ""
    });
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditMode(false);
    const firstMainCat = mainCategories.length > 0 ? mainCategories[0].slug : "oil";
    setFormData({
      ...initialFormState,
      mainCat: firstMainCat
    });
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.faTitle.trim() || !formData.slug.trim() || !formData.brandId || !formData.mainCat || !formData.category) {
      showToast("لطفاً تمامی فیلدهای ستاره‌دار (نام، شناسه، برند، گروه و دسته‌بندی) را تکمیل کنید.", "warning");
      return;
    }

    const standardCodesArr = formData.standardCodes
      ? formData.standardCodes.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const packagingSizesArr = formData.packagingSizes
      ? formData.packagingSizes.split(/[,،]/).map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      brandId: formData.brandId,
      title: {
        fa: formData.faTitle,
        en: formData.enTitle,
        ps: formData.psTitle
      },
      faTitle: formData.faTitle,
      enTitle: formData.enTitle,
      psTitle: formData.psTitle,
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
      mainCat: formData.mainCat,
      category: formData.category,
      status: formData.visibilityStatus,
      isFeatured: formData.isFeatured,
      hasWarning: formData.hasWarning,
      warningMessage: {
        fa: formData.warningMessageFa,
        en: formData.warningMessageEn,
        ps: formData.warningMessagePs
      },
      warningMessageFa: formData.warningMessageFa,
      warningMessageEn: formData.warningMessageEn,
      warningMessagePs: formData.warningMessagePs,
      description: {
        fa: formData.faDesc,
        en: formData.enDesc,
        ps: formData.psDesc
      },
      faDesc: formData.faDesc,
      enDesc: formData.enDesc,
      psDesc: formData.psDesc,
      order: editMode ? undefined : products.length,
      specs: {
        resinBase: { fa: formData.resinBaseFa, en: formData.resinBaseEn },
        thinnerType: { fa: formData.thinnerTypeFa, en: formData.thinnerTypeEn },
        dryingTime: {
          surfaceDry: { fa: formData.surfaceDryFa, en: formData.surfaceDryEn },
          fullDry: { fa: formData.fullDryFa, en: formData.fullDryEn },
          recoatInterval: { fa: formData.recoatIntervalFa, en: formData.recoatIntervalEn }
        },
        coverage: { fa: formData.coverageFa, en: formData.coverageEn },
        coverageRate: Number(formData.coverageRate) || 10,
        standardCodes: standardCodesArr,
        colorCode: formData.colorCode,
        glossLevel: { fa: formData.glossLevelFa, en: formData.glossLevelEn },
        applicationMethod: { fa: formData.applicationMethodFa, en: formData.applicationMethodEn },
        packagingSizes: packagingSizesArr,
        density: formData.density,
        viscosity: formData.viscosity,
        washability: { fa: formData.washabilityFa, en: "" },
        shelfLife: { fa: formData.shelfLifeFa, en: "" },
        vocLevel: formData.vocLevel
      },
      images: {
        main: formData.mainImage || "https://placehold.co/500x500/png?text=Afghan+Faizi+Paint",
        gallery: [],
        colorSwatch: formData.colorSwatchImage || "",
        datasheetPdf: formData.datasheetPdf || ""
      }
    };

    if (editMode && formData._id) {
      const res = await updateProduct(formData._id, payload);
      if (res.success) {
        showToast("محصول رنگ با موفقیت ویرایش شد.", "success");
        setIsModalOpen(false);
        fetchData();
      } else showToast(res.error || "خطا در ویرایش محصول.", "error");
    } else {
      const res = await createProduct(payload);
      if (res.success) {
        showToast("محصول رنگ جدید با موفقیت ثبت شد.", "success");
        setIsModalOpen(false);
        fetchData();
      } else showToast("خطا در ثبت: " + res.error, "error");
    }
  };

  const handleAutoTranslate = async (sourceText: string, targetKey: string, targetLang = 'en') => {
    if (!sourceText.trim()) return;
    setTranslatingField(targetKey);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fa&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
      const res = await fetch(url);
      const data = await res.json();
      const translatedText = data[0].map((item: any) => item[0]).join('');
      setFormData(prev => ({ ...prev, [targetKey]: translatedText }));
    } catch (error) {
      showToast("خطا در ارتباط با سرویس ترجمه هوشمند.", "error");
    } finally {
      setTranslatingField(null);
    }
  };

  const handleDelete = async (id: string) => {
    const customConfirm = confirm("آیا از حذف این محصول رنگ اطمینان دارید؟");
    if (customConfirm) {
      const res = await deleteProduct(id);
      if (res.success) {
        showToast("محصول با موفقیت حذف شد.", "success");
        fetchData();
      } else {
        showToast(res.error || "خطا در حذف محصول", "error");
      }
    }
  };

  // چیدمان و سورت دستی
  const handleStartReorder = () => {
    setOriginalProductsBackup([...products]);
    setFilterMain("all");
    setFilterBrand("all");
    setFilterSub("all");
    setSearchQuery("");
    setSortBy("custom");
    setSortOrder("asc");
    setIsReorderMode(true);
    showToast("حالت ترتیب دستی فعال شد. کارت‌ها را جابجا کرده و «تایید چیدمان» را بزنید.", "success");
  };

  const handleCancelReorder = () => {
    setProducts(originalProductsBackup);
    setIsReorderMode(false);
    setDraggedItemIndex(null);
  };

  const handleSaveReorder = async () => {
    setIsSavingOrder(true);
    try {
      const orderedIds = products.map(p => String(p._id));
      const res = await updateProductsOrder(orderedIds);
      if (res.success) {
        const updatedLocal = products.map((p, idx) => ({ ...p, order: idx }));
        setProducts(updatedLocal);
        setIsReorderMode(false);
        showToast("چیدمان جدید محصولات در دیتابیس ذخیره شد.", "success");
      } else {
        showToast(res.error || "خطا در ذخیره چیدمان.", "error");
      }
    } catch (error) {
      showToast("خطا در ارتباط با سرور هنگام ذخیره چیدمان.", "error");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDragStart = (index: number) => {
    if (!isReorderMode) return;
    setDraggedItemIndex((currentPage - 1) * itemsPerPage + index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!isReorderMode) return;
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    if (draggedItemIndex === null || draggedItemIndex === absoluteIndex) return;

    const newProducts = [...products];
    const draggedItem = newProducts[draggedItemIndex];
    newProducts.splice(draggedItemIndex, 1);
    newProducts.splice(absoluteIndex, 0, draggedItem);
    setDraggedItemIndex(absoluteIndex);
    setProducts(newProducts);
  };

  const handleDragEnd = () => {
    if (!isReorderMode) return;
    setDraggedItemIndex(null);
  };

  const handleMainCatChange = (val: string) => {
    setFilterMain(val);
    setFilterBrand("all");
    setFilterSub("all");
  };

  const handleBrandChange = (val: string) => {
    setFilterBrand(val);
    setFilterSub("all");
  };

  const availableBrands = brandsList.filter(b => {
    if (filterMain === "all") return true;
    return products.some(p => (p.brandId?._id === b._id || p.brandId === b._id) && p.mainCat === filterMain);
  });

  const availableSubCats = categoriesList.filter(c => {
    if (c.iconName === 'main') return false;
    if (filterMain !== "all" && c.parent !== filterMain) return false;
    if (filterBrand !== "all") {
      const hasProduct = products.some(p => p.category === c.slug && (p.brandId?._id === filterBrand || p.brandId === filterBrand));
      if (!hasProduct) return false;
    }
    return true;
  });

  let filteredProducts = products.filter(p => {
    const mSearch = (p.faTitle && p.faTitle.includes(searchQuery)) || 
                    (p.enTitle && p.enTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (p.specs?.colorCode && p.specs.colorCode.toLowerCase().includes(searchQuery.toLowerCase()));
    const mMain = filterMain === "all" || p.mainCat === filterMain;
    const mBrand = filterBrand === "all" || p.brandId?._id === filterBrand || p.brandId === filterBrand;
    const mSub = filterSub === "all" || p.category === filterSub;
    return mSearch && mMain && mBrand && mSub;
  });

  if (!isReorderMode) {
    filteredProducts.sort((a, b) => {
      let valA, valB;
      if (sortBy === "name") {
        valA = a.faTitle || "";
        valB = b.faTitle || "";
        return sortOrder === "asc" ? valA.localeCompare(valB, 'fa-IR') : valB.localeCompare(valA, 'fa-IR');
      } else if (sortBy === "date") {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else if (sortBy === "custom") {
        valA = typeof a.order === "number" ? a.order : 0;
        valB = typeof b.order === "number" ? b.order : 0;
        return valA - valB;
      }
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage, viewMode, filterMain, filterBrand, filterSub, sortBy, sortOrder]);

  const getCatName = (slug: string) => {
    const cat = categoriesList.find(c => c.slug === slug);
    return cat ? cat.faName : slug || "نامشخص";
  };

  const getMainCatLabel = (slug: string) => {
    const mapping: Record<string, string> = {
      oil: "رنگ روغنی / آلکیدی",
      plastic: "رنگ پلاستیک و اکریلیک",
      instant: "رنگ‌های فوری و نیتروسلولزی",
      industrial: "رنگ‌های صنعتی و اپوکسی",
      primers: "آستری، پرایمر و سیلر",
      decorative: "رنگ‌های دکوراتیو و بافت‌دار",
      tools: "تینر، حلال‌ها و ابزار"
    };
    return mapping[slug] || getCatName(slug);
  };

  const hasActiveFilters = filterMain !== "all" || filterBrand !== "all" || filterSub !== "all" || sortBy !== "custom" || searchQuery !== "";

  return (
    <div className="flex flex-col gap-6">

      {/* هدر بخش مدیریت محصولات */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            کاتالوگ و لیست محصولات رنگ افغان فیضی
          </h1>
          <p className="text-xs text-gray-500 mt-2 font-medium flex items-center gap-2">
            مدیریت مشخصات فنی مهندسی رنگ، زمان خشک شدن، کدهای رال، پوشش‌دهی و برگه اطلاعات فنی (TDS)
          </p>
        </div>

        <button
          onClick={handleAddNew}
          disabled={isReorderMode}
          className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-gray-950 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-amber-400/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>افزودن رنگ / محصول جدید</span>
        </button>
      </div>

      {/* نوار فیلتر و جستجو */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative grow max-w-md">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              disabled={isReorderMode}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی رنگ (نام، کد رال RAL، پایه رزین)..."
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} title="نمایش لیست با عکس">
                <ListIcon size={18} />
              </button>
              <button onClick={() => setViewMode("compact")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'compact' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} title="نمایش لیست فشرده">
                <AlignJustify size={18} />
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} title="نمایش کارتی">
                <LayoutGrid size={18} />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 hidden sm:block">نمایش:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-amber-400"
              >
                <option value={5}>۵</option>
                <option value={10}>۱۰</option>
                <option value={20}>۲۰</option>
                <option value={50}>۵۰</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className={`flex flex-wrap sm:flex-nowrap items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-opacity ${isReorderMode ? 'opacity-40 pointer-events-none' : ''}`}>
            <Filter size={16} className="text-amber-500 ml-1 shrink-0" />
            <select
              value={filterMain}
              onChange={(e) => handleMainCatChange(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none text-gray-700 dark:text-gray-300 w-full sm:w-auto"
            >
              <option value="all">۱. همه دسته‌های اصلی رنگ</option>
              {mainCategories.length > 0 ? mainCategories.map(c => (
                <option key={c.slug} value={c.slug}>{c.faName}</option>
              )) : (
                <>
                  <option value="oil">رنگ‌های روغنی و آلکیدی</option>
                  <option value="plastic">رنگ‌های پلاستیک و اکریلیک</option>
                  <option value="instant">رنگ‌های فوری و سلولزی</option>
                  <option value="industrial">پوشش‌های صنعتی و اپوکسی</option>
                  <option value="primers">آستری‌ها و پرایمر</option>
                  <option value="decorative">رنگ‌های دکوراتیو</option>
                  <option value="tools">تینر و حلال‌ها</option>
                </>
              )}
            </select>

            <span className="text-gray-300 dark:text-gray-600 hidden sm:block">|</span>

            <select
              value={filterBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none text-gray-700 dark:text-gray-300 w-full sm:w-auto mt-2 sm:mt-0"
            >
              <option value="all">۲. همه برندها</option>
              {availableBrands.map(b => <option key={b._id} value={b._id}>{b.faName}</option>)}
            </select>

            <span className="text-gray-300 dark:text-gray-600 hidden sm:block">|</span>

            <select
              value={filterSub}
              onChange={(e) => setFilterSub(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none text-gray-700 dark:text-gray-300 w-full sm:w-auto mt-2 sm:mt-0"
            >
              <option value="all">۳. همه زیردسته‌ها</option>
              {availableSubCats.map(c => <option key={c.slug} value={c.slug}>{c.faName}</option>)}
            </select>
          </div>

          <div className={`flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 mt-2 lg:mt-0 transition-opacity ${isReorderMode ? 'opacity-40 pointer-events-none' : ''}`}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold focus:outline-none text-gray-700 dark:text-gray-300"
            >
              <option value="custom">سورت: پیش‌فرض کاتالوگ</option>
              <option value="name">سورت: نام رنگ</option>
              <option value="date">سورت: جدیدترین</option>
            </select>

            {sortBy !== "custom" && (
              <>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                  title={sortOrder === "asc" ? "صعودی (A-Z)" : "نزولی (Z-A)"}
                >
                  {sortOrder === "asc" ? <ArrowDownAZ size={16} /> : <ArrowUpZA size={16} />}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mr-auto mt-2 lg:mt-0">
            {hasActiveFilters && !isReorderMode && (
              <button
                onClick={() => { setFilterMain("all"); setFilterBrand("all"); setFilterSub("all"); setSortBy("custom"); setSortOrder("asc"); setSearchQuery(""); }}
                className="text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 border border-red-100 dark:border-red-900/50 cursor-pointer"
              >
                <X size={14} /> ریست فیلتر
              </button>
            )}

            {!isReorderMode ? (
              <button
                type="button"
                onClick={handleStartReorder}
                className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-400 hover:text-gray-950 border border-amber-200/60 dark:border-amber-500/30 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <ArrowUpDown size={15} />
                <span>ترتیب دستی</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={handleSaveReorder}
                  disabled={isSavingOrder}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isSavingOrder ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  <span>تایید چیدمان</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelReorder}
                  disabled={isSavingOrder}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-gray-600 dark:text-gray-300 hover:text-red-500 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  <X size={15} />
                  <span>انصراف</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* نمایش لیست محصولات */}
      <div className={`bg-white dark:bg-gray-900 border ${isReorderMode ? 'border-amber-400 dark:border-amber-500/60 ring-2 ring-amber-400/10' : 'border-gray-100 dark:border-gray-800'} rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${isSavingOrder ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {isLoading ? (
          <div className="flex justify-center items-center py-16 w-full">
            <Loader2 className="animate-spin text-amber-500" size={40} />
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/20">
            {currentProducts.map((product, index) => (
              <div
                key={product._id}
                draggable={isReorderMode}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white dark:bg-gray-900 border ${isReorderMode ? 'border-amber-300 dark:border-amber-500/40' : 'border-gray-200 dark:border-gray-800'} rounded-2xl p-4 flex flex-col gap-3 relative shadow-sm hover:border-amber-400 dark:hover:border-amber-500 transition-colors group ${draggedItemIndex === ((currentPage - 1) * itemsPerPage + index) ? 'opacity-50 border-dashed' : ''} ${isReorderMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
              >
                {isReorderMode && (
                  <div className="absolute top-2 left-2 bg-amber-400 text-gray-950 p-1.5 rounded-lg shadow-md z-20 flex items-center justify-center">
                    <GripVertical size={16} />
                  </div>
                )}

                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-gray-900 p-1.5 rounded-full shadow-sm z-10" title="محصول ویژه">
                    <Star size={12} className="fill-current" />
                  </div>
                )}

                <div className="w-full h-36 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-amber-50 dark:group-hover:bg-amber-900/10 transition-colors">
                  {product.images?.main ? (
                    <img src={product.images.main} alt={product.faTitle} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <ImageIcon size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <h3 className="font-black text-gray-900 dark:text-white text-sm truncate" title={product.faTitle}>{product.faTitle}</h3>
                  <span className="text-xs text-gray-500 font-mono truncate" title={product.enTitle}>{product.enTitle || "---"}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg" dir="ltr">
                    {product.specs?.colorCode || product.specs?.resinBase?.fa || "رنگ صنعتی"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(product)} disabled={isReorderMode} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-amber-500 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(String(product._id))} disabled={isReorderMode} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
            {currentProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 font-bold">هیچ محصولی یافت نشد.</div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold text-xs border-b border-gray-100 dark:border-gray-800">
                <tr>
                  {isReorderMode && <th className="px-4 py-5 w-10 text-amber-500">جابجایی</th>}
                  {viewMode === "list" && <th className="px-6 py-5">تصویر</th>}
                  <th className="px-6 py-5">عنوان رنگ (فارسی / انگلیسی)</th>
                  <th className="px-6 py-5">برند</th>
                  <th className="px-6 py-5">پایه رزین / حلال</th>
                  <th className="px-6 py-5">گروه رنگ</th>
                  <th className="px-6 py-5">وضعیت</th>
                  <th className="px-6 py-5">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 relative">
                {currentProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    draggable={isReorderMode}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group ${draggedItemIndex === ((currentPage - 1) * itemsPerPage + index) ? 'opacity-50 bg-amber-50/30 dark:bg-gray-800' : ''} ${isReorderMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  >
                    {isReorderMode && (
                      <td className="px-4 py-4 text-amber-500 cursor-grab active:cursor-grabbing" title="برای جابجایی بکشید و رها کنید">
                        <GripVertical size={20} />
                      </td>
                    )}

                    {viewMode === "list" && (
                      <td className="px-6 py-4 relative">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden p-1 border border-gray-200 dark:border-gray-700">
                          {product.images?.main ? (
                            <img src={product.images.main} alt="Product" className="w-full h-full object-contain" />
                          ) : (
                            <ImageIcon size={20} />
                          )}
                        </div>
                        {product.isFeatured && (
                          <div className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 p-1 rounded-full shadow-sm" title="محصول ویژه">
                            <Star size={10} className="fill-current" />
                          </div>
                        )}
                      </td>
                    )}

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{product.faTitle}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">{product.enTitle || "---"}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                      {product.brandId?.faName || "افغان فیضی"}
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600 dark:text-amber-500 text-xs">
                      {product.specs?.resinBase?.fa || product.specs?.thinnerType?.fa || "پایه آب / اکریلیک"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-1 rounded text-[10px] w-fit font-bold shadow-sm border border-blue-100 dark:border-blue-800/30">
                          گروه: {getMainCatLabel(product.mainCat)}
                        </span>
                        <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded text-[10px] w-fit font-bold shadow-sm border border-gray-200 dark:border-gray-700">
                          دسته: {getCatName(product.category)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 whitespace-nowrap shadow-sm">
                        {product.status === "published" ? "فعال در کاتالوگ" : product.status === "draft" ? "پیش‌نویس" : "بایگانی شده"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={isReorderMode}
                          className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                          title="ویرایش"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(String(product._id))}
                          disabled={isReorderMode}
                          className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentProducts.length === 0 && (
                  <tr>
                    <td colSpan={viewMode === "list" ? (isReorderMode ? 8 : 7) : (isReorderMode ? 7 : 6)} className="text-center py-12 text-gray-400 font-bold">هیچ محصولی یافت نشد.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 gap-4">
            <span className="text-xs font-bold text-gray-500">
              نمایش {(currentPage - 1) * itemsPerPage + 1} تا {Math.min(currentPage * itemsPerPage, filteredProducts.length)} از {filteredProducts.length} محصول
            </span>
            <div className="flex items-center gap-2" dir="ltr">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer ${currentPage === page
                    ? 'bg-amber-400 text-gray-950 shadow-md shadow-amber-400/20'
                    : 'hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 border border-transparent'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* مودال افزودن / ویرایش محصول تخصصی رنگ */}
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
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">
                    {editMode ? `ویرایش رنگ: ${formData.faTitle}` : "ثبت محصول جدید در سبد تولید رنگ افغان فیضی"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* تب‌های فرم */}
              <div className="flex border-b border-gray-100 dark:border-gray-800 px-6 pt-4 gap-6 bg-gray-50/50 dark:bg-gray-900 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("basic")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${activeTab === "basic"
                    ? "border-amber-400 text-amber-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  <Layers size={16} />
                  <span>اطلاعات پایه و شناسنامه</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${activeTab === "specs"
                    ? "border-amber-400 text-amber-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  <Paintbrush size={16} />
                  <span>مشخصات مهندسی و فنی رنگ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("media")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${activeTab === "media"
                    ? "border-amber-400 text-amber-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  <FileText size={16} />
                  <span>رسانه، کالیته و برگه فنی TDS</span>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col grow overflow-hidden bg-white dark:bg-gray-950">
                <div className="p-6 overflow-y-auto grow custom-scrollbar">

                  {/* تب ۱: اطلاعات پایه */}
                  {activeTab === "basic" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">نام رنگ / محصول (فارسی دری) <span className="text-red-500">*</span></label>
                        <input
                          autoFocus
                          type="text"
                          value={formData.faTitle}
                          onChange={(e) => setFormData({ ...formData, faTitle: e.target.value })}
                          placeholder="مثال: رنگ روغنی براق آلکیدی سوپر"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">Product Name (انگلیسی)</label>
                        <div className="relative">
                          <input
                            type="text"
                            dir="ltr"
                            value={formData.enTitle}
                            onChange={(e) => setFormData({ ...formData, enTitle: e.target.value })}
                            placeholder="Example: Super Gloss Alkyd Enamel"
                            className="w-full border border-gray-200 dark:border-gray-800 rounded-xl py-3 pr-4 pl-12 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleAutoTranslate(formData.faTitle, 'enTitle', 'en')}
                            disabled={translatingField === 'enTitle' || !formData.faTitle}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-amber-400/10 text-amber-600 hover:bg-amber-400 hover:text-gray-950 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                            title="ترجمه خودکار به انگلیسی"
                          >
                            {translatingField === 'enTitle' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-emerald-500">د رنګ نوم (پښتو - اختیاري)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.psTitle}
                            onChange={(e) => setFormData({ ...formData, psTitle: e.target.value })}
                            placeholder="بېلګه: سوپر روښانه الکایډ غوړ رنګ"
                            className="w-full border border-emerald-200 dark:border-emerald-900/50 rounded-xl py-3 pr-4 pl-12 bg-emerald-50/20 dark:bg-emerald-950/10 text-sm font-bold outline-none focus:border-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleAutoTranslate(formData.faTitle, 'psTitle', 'ps')}
                            disabled={translatingField === 'psTitle' || !formData.faTitle}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-400/10 text-emerald-600 hover:bg-emerald-400 hover:text-gray-950 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                            title="ترجمه خودکار به پشتو"
                          >
                            {translatingField === 'psTitle' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">شناسه URL (اسلاگ) <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          dir="ltr"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="super-gloss-alkyd-paint"
                          className="w-full border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">گروه اصلی رنگ <span className="text-red-500">*</span></label>
                        <select
                          value={formData.mainCat}
                          onChange={(e) => setFormData({ ...formData, mainCat: e.target.value, category: "" })}
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400 text-gray-900 dark:text-white"
                        >
                          <option value="oil">رنگ‌های روغنی و آلکیدی</option>
                          <option value="plastic">رنگ‌های پلاستیک و اکریلیک پایه آب</option>
                          <option value="instant">رنگ‌های فوری، سیلر و کیلر نیتروسلولزی</option>
                          <option value="industrial">پوشش‌های صنعتی، زینک‌ریچ و اپوکسی</option>
                          <option value="primers">آستری‌ها، پرایمر و ضد زنگ</option>
                          <option value="decorative">رنگ‌های دکوراتیو و بافت‌دار (تکسچر)</option>
                          <option value="tools">تینرها، حلال‌ها و ابزار اجرا</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-blue-500">زیردسته تخصصی محصول <span className="text-red-500">*</span></label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="border border-blue-200 dark:border-blue-900 rounded-xl px-4 py-3 bg-blue-50/30 dark:bg-blue-900/10 text-sm font-bold outline-none focus:border-blue-400 text-blue-700 dark:text-blue-400"
                        >
                          <option value="">انتخاب زیردسته...</option>
                          {subCategories.length > 0 ? (
                            subCategories.map(cat => (
                              <option key={cat.slug} value={cat.slug}>{cat.faName}</option>
                            ))
                          ) : (
                            <>
                              <option value="gloss">براق</option>
                              <option value="matt">مات</option>
                              <option value="semi-gloss">نیمه‌براق</option>
                              <option value="anti-rust">ضد زنگ صنعتی</option>
                              <option value="primer">پرایمر نفوذگر</option>
                              <option value="polyurethane">پلی‌اورتان ۲ جزیی</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">برند یا خط تولید <span className="text-red-500">*</span></label>
                        <select
                          value={formData.brandId}
                          onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400 text-gray-900 dark:text-white"
                        >
                          <option value="" className="text-gray-500">انتخاب برند...</option>
                          {brandsList.map(b => (
                            <option key={b._id} value={b._id}>{b.faName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">وضعیت نمایش در کاتالوگ</label>
                        <select
                          value={formData.visibilityStatus}
                          onChange={(e) => setFormData({ ...formData, visibilityStatus: e.target.value })}
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400 text-gray-900 dark:text-white"
                        >
                          <option value="published">منتشر شده (فعال در سایت)</option>
                          <option value="draft">پیش‌نویس (مخفی)</option>
                          <option value="archived">بایگانی شده</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2 justify-center md:col-span-2 mt-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <div className="flex flex-wrap items-center gap-8">
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-black text-gray-600 dark:text-gray-300">محصول ویژه (نمایش در صفحه اصلی کاتالوگ)</label>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${formData.isFeatured ? 'bg-amber-400' : 'bg-gray-200 dark:bg-gray-800'}`}
                            >
                              <motion.div
                                className="w-4 h-4 bg-white rounded-full shadow-sm absolute top-1"
                                animate={{ left: formData.isFeatured ? '4px' : '28px' }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 border-r border-gray-200 dark:border-gray-700 pr-8">
                            <label className="text-xs font-black text-red-600 dark:text-red-400 flex items-center gap-1.5">
                              <ShieldAlert size={14} />
                              <span>هشدار ایمنی و قابلیت اشتعال</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, hasWarning: !formData.hasWarning })}
                              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${formData.hasWarning ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-800'}`}
                            >
                              <motion.div
                                className="w-4 h-4 bg-white rounded-full shadow-sm absolute top-1"
                                animate={{ left: formData.hasWarning ? '4px' : '28px' }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {formData.hasWarning && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2 overflow-hidden bg-red-50/50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/50 mb-2 mt-2"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-black text-red-600 dark:text-red-400">متن هشدار ایمنی (فارسی)</label>
                              <textarea
                                rows={2}
                                value={formData.warningMessageFa}
                                onChange={e => setFormData({ ...formData, warningMessageFa: e.target.value })}
                                placeholder="مثال: مایع و بخار بسیار قابل اشتعال. در محیط دارای تهویه مناسب استفاده شود و دور از شعله مستقیم نگهداری شود."
                                className="border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3 bg-white dark:bg-gray-950 text-sm font-bold outline-none focus:border-red-400 resize-none"
                              ></textarea>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-black text-red-600 dark:text-red-400">Safety Warning (انگلیسی)</label>
                              <div className="relative">
                                <textarea
                                  rows={2}
                                  dir="ltr"
                                  value={formData.warningMessageEn}
                                  onChange={e => setFormData({ ...formData, warningMessageEn: e.target.value })}
                                  placeholder="Highly flammable liquid and vapor. Keep away from heat and open flames."
                                  className="w-full border border-red-200 dark:border-red-800/50 rounded-xl py-3 pr-4 pl-12 bg-white dark:bg-gray-950 text-sm font-mono outline-none focus:border-red-400 resize-none"
                                ></textarea>
                                <button
                                  type="button"
                                  onClick={() => handleAutoTranslate(formData.warningMessageFa, 'warningMessageEn', 'en')}
                                  disabled={translatingField === 'warningMessageEn' || !formData.warningMessageFa}
                                  className="absolute left-2 top-3 p-2 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  {translatingField === 'warningMessageEn' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-col gap-2 md:col-span-2 mt-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                        <label className="text-xs font-black text-gray-400">معرفی و توضیحات کلی رنگ (فارسی)</label>
                        <textarea
                          rows={2}
                          value={formData.faDesc}
                          onChange={e => setFormData({ ...formData, faDesc: e.target.value })}
                          placeholder="توضیح کاربردها، سطوح هدف (گچ، سیمان، فلز، چوب) و ویژگی‌های کلیدی..."
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-gray-50/50 dark:bg-gray-900/30 text-sm font-medium outline-none focus:border-amber-400 resize-none"
                        ></textarea>
                      </div>

                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-black text-gray-400">Product Overview (انگلیسی)</label>
                        <div className="relative">
                          <textarea
                            rows={2}
                            dir="ltr"
                            value={formData.enDesc}
                            onChange={e => setFormData({ ...formData, enDesc: e.target.value })}
                            placeholder="Premium grade paint designed for high durability and excellent opacity on interior and exterior surfaces..."
                            className="w-full border border-gray-200 dark:border-gray-800 rounded-xl py-3 pr-4 pl-12 bg-gray-50/50 dark:bg-gray-900/30 text-sm font-mono outline-none focus:border-amber-400 resize-none"
                          ></textarea>
                          <button
                            type="button"
                            onClick={() => handleAutoTranslate(formData.faDesc, 'enDesc', 'en')}
                            disabled={translatingField === 'enDesc' || !formData.faDesc}
                            className="absolute left-2 top-3 p-2 bg-amber-400/10 text-amber-600 hover:bg-amber-400 hover:text-gray-950 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                          >
                            {translatingField === 'enDesc' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* تب ۲: مشخصات تخصصی و مهندسی رنگ */}
                  {activeTab === "specs" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">

                      {/* پایه رزین */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400 flex items-center gap-1.5">
                          <Layers size={14} className="text-amber-500" />
                          <span>پایه رزین (فارسی)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.resinBaseFa}
                          onChange={e => setFormData({ ...formData, resinBaseFa: e.target.value })}
                          placeholder="مثال: رزین آلکیدی پایه بلند، اکریلیک خالص"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">Resin Base (انگلیسی)</label>
                        <div className="relative">
                          <input
                            type="text"
                            dir="ltr"
                            value={formData.resinBaseEn}
                            onChange={e => setFormData({ ...formData, resinBaseEn: e.target.value })}
                            placeholder="Long Oil Alkyd Resin / Pure Acrylic"
                            className="w-full border border-gray-200 dark:border-gray-800 rounded-xl py-3 pr-4 pl-12 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleAutoTranslate(formData.resinBaseFa, 'resinBaseEn', 'en')}
                            disabled={translatingField === 'resinBaseEn' || !formData.resinBaseFa}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-400/10 text-amber-600 hover:bg-amber-400 hover:text-gray-950 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                          >
                            {translatingField === 'resinBaseEn' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* نوع حلال و تینر */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400 flex items-center gap-1.5">
                          <Droplets size={14} className="text-blue-500" />
                          <span>نوع حلال / تینر (فارسی)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.thinnerTypeFa}
                          onChange={e => setFormData({ ...formData, thinnerTypeFa: e.target.value })}
                          placeholder="مثال: تینر روغنی مخصوص / تینر فوری ۱۰۰۰۰ / آب"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* پوشش‌دهی */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">میزان پوشش‌دهی (m²/Liter)</label>
                        <input
                          type="text"
                          value={formData.coverageFa}
                          onChange={e => setFormData({ ...formData, coverageFa: e.target.value })}
                          placeholder="مثال: ۱۰ الی ۱۲ متر مربع بر لیتر"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* زمان خشک شدن سطحی */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400 flex items-center gap-1.5">
                          <Clock size={14} className="text-amber-500" />
                          <span>زمان خشک شدن سطحی (لمسی)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.surfaceDryFa}
                          onChange={e => setFormData({ ...formData, surfaceDryFa: e.target.value })}
                          placeholder="مثال: ۱۵ الی ۳۰ دقیقه در دمای ۲۵°C"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* زمان خشک شدن نهایی */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400 flex items-center gap-1.5">
                          <Clock size={14} className="text-emerald-500" />
                          <span>زمان خشک شدن نهایی (عمقی)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.fullDryFa}
                          onChange={e => setFormData({ ...formData, fullDryFa: e.target.value })}
                          placeholder="مثال: ۲۴ ساعت کامل"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* کد رنگ / شید رال */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">کد استاندارد رنگ / رال (RAL Code)</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={formData.colorCode}
                          onChange={e => setFormData({ ...formData, colorCode: e.target.value })}
                          placeholder="RAL 9010 / سفید براق"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* استانداردهای ملی و بین‌المللی */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400 flex items-center gap-1.5">
                          <Award size={14} className="text-amber-500" />
                          <span>استانداردها (با کاما جدا کنید)</span>
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={formData.standardCodes}
                          onChange={e => setFormData({ ...formData, standardCodes: e.target.value })}
                          placeholder="ISO 12944, ASTM D3359, ANSA AF"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* درجه براقیت */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">درجه براقیت (Gloss Level)</label>
                        <select
                          value={formData.glossLevelFa}
                          onChange={e => setFormData({ ...formData, glossLevelFa: e.target.value })}
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400 text-gray-900 dark:text-white"
                        >
                          <option value="">انتخاب درجه براقیت...</option>
                          <option value="سوپر براق (>85 GU)">سوپر براق (Super Gloss)</option>
                          <option value="براق (60-80 GU)">براق (Gloss)</option>
                          <option value="نیمه‌براق (30-50 GU)">نیمه‌براق (Semi-Gloss)</option>
                          <option value="مات (10-25 GU)">مات (Matt / Eggshell)</option>
                          <option value="فوق‌العاده مات (<5 GU)">فوق‌العاده مات (Dead Matt)</option>
                        </select>
                      </div>

                      {/* روش اجرا */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">روش اجرا (Application Method)</label>
                        <input
                          type="text"
                          value={formData.applicationMethodFa}
                          onChange={e => setFormData({ ...formData, applicationMethodFa: e.target.value })}
                          placeholder="قلم‌مو، غلطک پشمی، پیستوله کاسه‌رو، ایرلس صنعتی"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* اندازه‌های بسته‌بندی */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">اندازه‌های بسته‌بندی موجود</label>
                        <input
                          type="text"
                          value={formData.packagingSizes}
                          onChange={e => setFormData({ ...formData, packagingSizes: e.target.value })}
                          placeholder="۱ لیتری، ۴ لیتری (گالن)، ۲۰ لیتری (حلب)"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* دانسیته و ویسکوزیته */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400">وزن مخصوص / دانسیته (Density)</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={formData.density}
                          onChange={e => setFormData({ ...formData, density: e.target.value })}
                          placeholder="1.25 ± 0.05 g/cm³"
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 bg-transparent text-sm font-mono outline-none focus:border-amber-400"
                        />
                      </div>

                    </div>
                  )}

                  {/* تب ۳: رسانه، کالیته و برگه اطلاعات فنی TDS */}
                  {activeTab === "media" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                      
                      {/* تصویر اصلی محصول */}
                      <div className="flex flex-col gap-4">
                        <label className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                          <ImageIcon size={16} className="text-amber-500" />
                          <span>تصویر اصلی قوطی / سطل رنگ</span>
                        </label>
                        {formData.mainImage && (
                          <img src={formData.mainImage} className="w-full h-44 object-contain rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-2" alt="Main" />
                        )}
                        <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl h-44 flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-gray-100 dark:bg-gray-900/30 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              if (formData.mainImage && !formData.mainImage.startsWith('http')) {
                                await fetch('/api/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileUrl: formData.mainImage }) }).catch(err => console.error(err));
                              }
                              const fd = new FormData(); fd.append('file', f);
                              const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json();
                              if (d.success) {
                                setFormData({ ...formData, mainImage: d.url });
                                showToast("تصویر اصلی رنگ با موفقیت آپلود شد.", "success");
                              }
                            }}
                          />
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload size={18} className="text-gray-400 group-hover:text-amber-500" />
                          </div>
                          <span className="text-xs font-bold text-gray-500">آپلود عکس قوطی با پس‌زمینه شفاف</span>
                        </label>
                      </div>

                      {/* کالیته یا بافت رنگ */}
                      <div className="flex flex-col gap-4">
                        <label className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                          <Paintbrush size={16} className="text-blue-500" />
                          <span>کالیته رنگ یا تصویر بافت اجرا</span>
                        </label>
                        {formData.colorSwatchImage && (
                          <img src={formData.colorSwatchImage} className="w-full h-44 object-cover rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-1" alt="Swatch" />
                        )}
                        <label className="border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-2xl h-44 flex flex-col items-center justify-center gap-3 bg-blue-50/20 hover:bg-blue-50/50 dark:bg-blue-900/10 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const fd = new FormData(); fd.append('file', f);
                              const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json();
                              if (d.success) {
                                setFormData({ ...formData, colorSwatchImage: d.url });
                                showToast("کالیته / بافت رنگ آپلود شد.", "success");
                              }
                            }}
                          />
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload size={18} className="text-blue-400 group-hover:text-blue-500" />
                          </div>
                          <span className="text-xs font-bold text-blue-500/80">آپلود شید رنگ یا بافت سمپل</span>
                        </label>
                      </div>

                      {/* برگه مشخصات فنی مهندسی TDS */}
                      <div className="flex flex-col gap-4">
                        <label className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                          <FileText size={16} className="text-emerald-500" />
                          <span>برگه اطلاعات فنی (TDS) یا PDF</span>
                        </label>
                        {formData.datasheetPdf && (
                          <div className="w-full h-44 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 p-4 flex flex-col items-center justify-center text-center gap-2">
                            <FileText size={32} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono truncate max-w-full">
                              {formData.datasheetPdf.split('/').pop()}
                            </span>
                            <a href={formData.datasheetPdf} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-600 underline">
                              مشاهده و دانلود فایل
                            </a>
                          </div>
                        )}
                        <label className="border-2 border-dashed border-emerald-200 dark:border-emerald-900/50 rounded-2xl h-44 flex flex-col items-center justify-center gap-3 bg-emerald-50/20 hover:bg-emerald-50/50 dark:bg-emerald-950/10 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const fd = new FormData(); fd.append('file', f);
                              const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json();
                              if (d.success) {
                                setFormData({ ...formData, datasheetPdf: d.url });
                                showToast("فایل برگه مشخصات فنی TDS آپلود شد.", "success");
                              }
                            }}
                          />
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload size={18} className="text-emerald-500 group-hover:text-emerald-600" />
                          </div>
                          <span className="text-xs font-bold text-emerald-600/80">آپلود برگه فنی TDS رسمی (PDF)</span>
                        </label>
                      </div>

                    </div>
                  )}

                </div>

                <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-5 flex justify-end gap-3 sticky bottom-0 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors text-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm cursor-pointer"
                  >
                    انصراف (Esc)
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-500 text-gray-950 px-8 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 text-sm cursor-pointer"
                  >
                    <CheckCircle2 size={18} /> {editMode ? "بروزرسانی مشخصات فنی رنگ" : "ذخیره رنگ جدید در سامانه"}
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