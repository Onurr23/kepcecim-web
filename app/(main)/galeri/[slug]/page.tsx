import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getStoreBySlugServer,
  getStoreListings,
  type Store,
  type StoreListingItem,
} from "@/services/store";
import StoreProfileClient from "./StoreProfileClient";
import JsonLd from "@/components/seo/JsonLd";
import { getCanonicalUrl, getBaseUrl } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getStorageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${base}/storage/v1/object/public/machine-images/${path}`;
}

function storeToSellerProfile(store: Store): {
  id: string;
  type: "corporate" | "individual";
  name: string;
  logo: string;
  coverImage?: string;
  memberSince: string;
  slogan?: string;
  phone: string;
  authorizedPerson?: string;
  taxNumber?: string;
  address?: string;
  location?: string;
} {
  const location = [store.city, store.district]
    .filter(Boolean)
    .join(", ") || "Türkiye";
  const rawAddress = store.address;
  let address: string | undefined;
  if (typeof rawAddress === "string") {
    address = rawAddress || undefined;
  } else if (rawAddress && typeof rawAddress === "object") {
    address = (rawAddress as { fullAddress?: string }).fullAddress || undefined;
  } else {
    address = undefined;
  }
  return {
    id: store.id,
    type: "corporate",
    name: store.name,
    logo: getStorageUrl(store.logoUrl) || "",
    coverImage: getStorageUrl(store.coverUrl) || undefined,
    memberSince: `${store.year} yılından beri`,
    slogan: store.description || undefined,
    phone: "",
    address,
    location,
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlugServer(slug);

  if (!store) {
    return {
      title: "Mağaza Bulunamadı | Kepçecim",
      description: "Aradığınız mağaza sistemimizde bulunamadı.",
      openGraph: {
        title: "Mağaza Bulunamadı | Kepçecim",
        description: "Aradığınız mağaza sistemimizde bulunamadı.",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Mağaza Bulunamadı | Kepçecim",
        description: "Aradığınız mağaza sistemimizde bulunamadı.",
      },
    };
  }

  const title = `${store.name} - İş Makineleri Galerisi | Kepçecim`;
  const description = `${store.name} mağazasının güncel iş makinesi ilanlarını, iletişim bilgilerini ve konumunu inceleyin.`;
  const logoUrl = getStorageUrl(store.logoUrl);
  const canonical = getCanonicalUrl(`/galeri/${slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      images: logoUrl ? [{ url: logoUrl, width: 1200, height: 630 }] : [],
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
  };
}

export default async function StoreProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const store = await getStoreBySlugServer(slug);
  if (!store) notFound();

  const products: StoreListingItem[] = await getStoreListings(
    store.id,
    store.name
  );
  const initialSeller = storeToSellerProfile(store);

  const baseUrl = getBaseUrl();
  const storeUrl = `${baseUrl}/galeri/${slug}`;
  const addressStr =
    typeof store.address === "string"
      ? store.address
      : store.address && typeof store.address === "object"
        ? (store.address as { fullAddress?: string }).fullAddress
        : undefined;
  const location = [store.city, store.district].filter(Boolean).join(", ");
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: store.name,
    url: storeUrl,
    description: store.description || `${store.name} - İş makinesi galerisi`,
    image: getStorageUrl(store.logoUrl) || undefined,
    address: addressStr
      ? { "@type": "PostalAddress", streetAddress: addressStr, addressCountry: "TR", ...(location ? { addressLocality: location } : {}) }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: getBaseUrl() },
      { "@type": "ListItem", position: 2, name: "Galericiler", item: `${getBaseUrl()}/galeriler` },
      { "@type": "ListItem", position: 3, name: store.name, item: storeUrl },
    ],
  };

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <StoreProfileClient
        initialSeller={initialSeller}
        initialProducts={products}
      />
    </>
  );
}
