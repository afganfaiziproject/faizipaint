"use server";

import dbConnect from "@/lib/mongodb";
import PriceList, { PriceUserRole } from "@/models/PriceList";
import { revalidatePath } from "next/cache";
import { getAfghanShamsiNow } from "@/lib/dateUtils";

/**
 * دریافت لیست نرخنامه‌ها با فیلتر ولایت، نقش کاربر و وضعیت
 */
export async function getPriceLists(filter: {
  province?: string;
  role?: PriceUserRole;
  status?: string;
  includeArchived?: boolean;
} = {}) {
  try {
    await dbConnect();
    const dbFilter: any = {};

    if (filter.status && filter.status !== 'all') {
      dbFilter.status = filter.status;
    } else if (!filter.includeArchived) {
      dbFilter.status = { $ne: 'archived' };
      dbFilter.isArchived = false;
    }

    if (filter.role) {
      dbFilter.allowedRoles = filter.role;
    }

    if (filter.province && filter.province !== 'all') {
      dbFilter.$or = [
        { isAllProvinces: true },
        { allowedProvinces: filter.province }
      ];
    }

    const priceLists = await PriceList.find(dbFilter)
      .populate('items.productId', 'faTitle enTitle images specs')
      .sort({ publishedAtDate: -1, createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(priceLists)) };
  } catch (error: any) {
    console.error("❌ [BACKEND] خطا در دریافت نرخنامه‌ها:", error.message || error);
    return { success: false, error: "خطا در دریافت نرخنامه‌ها", details: error.message };
  }
}

/**
 * دریافت نرخنامه بر اساس شناسه
 */
export async function getPriceListById(id: string) {
  try {
    await dbConnect();
    const priceList = await PriceList.findById(id)
      .populate('items.productId', 'faTitle enTitle images specs')
      .lean();

    if (!priceList) {
      return { success: false, error: "نرخنامه مورد نظر یافت نشد" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(priceList)) };
  } catch (error: any) {
    console.error("❌ [BACKEND] خطا در دریافت جزئیات نرخنامه:", error.message || error);
    return { success: false, error: "خطا در دریافت جزئیات نرخنامه" };
  }
}

/**
 * ایجاد نرخنامه جدید با ثبت تاریخ شمسی دری افغانستان
 */
export async function createPriceList(data: any) {
  try {
    await dbConnect();
    
    if (!data.publishedAtShamsi) {
      data.publishedAtShamsi = getAfghanShamsiNow(true);
    }
    if (!data.publishedAtDate) {
      data.publishedAtDate = new Date();
    }

    const newPriceList = await PriceList.create(data);
    revalidatePath("/", "layout");
    return { success: true, data: JSON.parse(JSON.stringify(newPriceList)) };
  } catch (error: any) {
    console.error("❌ [BACKEND] خطا در ثبت نرخنامه:", error.message || error);
    return { success: false, error: error.message || "خطا در ثبت نرخنامه" };
  }
}

/**
 * ویرایش نرخنامه
 */
export async function updatePriceList(id: string, data: any) {
  try {
    await dbConnect();
    const updated = await PriceList.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    revalidatePath("/", "layout");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("❌ [BACKEND] خطا در ویرایش نرخنامه:", error.message || error);
    return { success: false, error: "خطا در ویرایش نرخنامه" };
  }
}

/**
 * بایگانی کردن یا بازگردانی نسخه نرخنامه با ثبت علت و تاریخ
 */
export async function archivePriceList(id: string, shouldArchive: boolean | string = true, reason: string = "انتشار نسخه جدید") {
  try {
    await dbConnect();
    const isArchiving = typeof shouldArchive === 'boolean' ? shouldArchive : true;
    const archiveReason = typeof shouldArchive === 'string' ? shouldArchive : reason;

    const updateData: any = isArchiving
      ? { status: 'archived', isArchived: true, archivedAt: new Date(), archiveReason }
      : { status: 'published', isArchived: false, archivedAt: null, archiveReason: "" };

    const archived = await PriceList.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();

    revalidatePath("/", "layout");
    return { success: true, data: JSON.parse(JSON.stringify(archived)) };
  } catch (error: any) {
    console.error("❌ [BACKEND] خطا در تغییر وضعیت بایگانی نرخنامه:", error.message || error);
    return { success: false, error: "خطا در تغییر وضعیت بایگانی نرخنامه" };
  }
}

/**
 * حذف نرخنامه
 */
export async function deletePriceList(id: string) {
  try {
    await dbConnect();
    await PriceList.findByIdAndDelete(id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("❌ [BACKEND] خطا در حذف نرخنامه:", error.message || error);
    return { success: false, error: "خطا در حذف نرخنامه" };
  }
}
