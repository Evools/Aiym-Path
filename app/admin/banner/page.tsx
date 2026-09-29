import { AdminBannerManager } from "@/components/features/admin/AdminBannerManager";

export const metadata = {
  title: "Управление баннером | Админ-панель Aiym Path",
  description: "Редактирование главного баннера, текстов и графических ресурсов платформы Aiym Path",
};

export default function AdminBannerPage() {
  return <AdminBannerManager />;
}
