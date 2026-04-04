import type { Metadata } from "next";
import AdminPageClient from "./AdminPageClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin | Gavin Woodhouse",
  description: "Admin workspace for Gavin Woodhouse site management.",
  alternates: { canonical: `${SITE_URL}/admin` },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPageClient />;
}
