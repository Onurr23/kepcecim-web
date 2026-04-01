import { getSalesMachineById } from "@/services/sales";
import { getRentalMachineById } from "@/services/rental";
import { getPartById } from "@/services/parts";
import { getFeaturesByIds, getAttachmentsByIds } from "@/services/categories";
import { incrementViewCount } from "@/services/view-count";
import ListingDetailClient from "@/components/listing/ListingDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { getCanonicalUrl } from "@/lib/seo";
import { Metadata } from "next";

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Helper for image URLs
const getStorageUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${baseUrl}/storage/v1/object/public/machine-images/${path}`;
};


export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {

  const { slug } = await params;

  // Extract ID
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slug.match(uuidRegex);
  const extractedId = match ? match[0] : slug.split('-').pop();
  const id = extractedId || '';

  const resolvedSearchParams = await searchParams;
  const typeParam = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : null;

  let machine = null;
  let type = 'sale';

  try {
    if (typeParam === 'rental') {
      machine = await getRentalMachineById(id);
      type = 'rental';
    } else if (typeParam === 'sale') {
      machine = await getSalesMachineById(id);
      type = 'sale';
    } else if (typeParam === 'part') {
      machine = await getPartById(id);
      type = 'part';
    } else {
      const [saleResult, rentalResult, partResult] = await Promise.allSettled([
        getSalesMachineById(id),
        getRentalMachineById(id),
        getPartById(id)
      ]);
      if (saleResult.status === 'fulfilled' && saleResult.value) {
        machine = saleResult.value;
        type = 'sale';
      } else if (rentalResult.status === 'fulfilled' && rentalResult.value) {
        machine = rentalResult.value;
        type = 'rental';
      } else if (partResult.status === 'fulfilled' && partResult.value) {
        machine = partResult.value;
        type = 'part';
      }
    }

    if (!machine) {
      return {
        title: 'İlan Bulunamadı | Kepçecim',
        description: 'Aradığınız ilan yayından kaldırılmış veya mevcut değil.'
      };
    }

    // Construct Data
    // Sales/Rental use aliases: machine_brands, machine_models, machine_categories
    // Parts use aliases: brand (for parts_brands), category (for parts_categories)

    const brandName = machine.machine_brands?.name || machine.brand?.name || machine.custom_brand_text || '';
    const modelName = machine.machine_models?.name || '';
    const categoryName = machine.machine_categories?.name || machine.category?.name || '';

    // Location
    let cityName = '';
    if (machine.location) {
      try {
        const loc = typeof machine.location === 'string' ? JSON.parse(machine.location) : machine.location;
        cityName = loc.city || '';
      } catch (e) { /* ignore */ }
    }
    if (!cityName && machine.city) cityName = machine.city;
    if (!cityName) cityName = 'Türkiye';

    // Title: Caterpillar 320 Ekskavatör - Ankara | Kepçecim
    const title = `${brandName} ${modelName} ${categoryName} - ${cityName} | Kepçecim`.replace(/\s+/g, ' ').trim();

    // Description: [Year] Model, [Hours] Saatte. Fiyat: [Price] [Currency].
    const year = machine.year || machine.production_year || '';
    const hours = machine.hours_meter ? `${machine.hours_meter} Saatte` : '';

    let priceStr = '';
    try {
      const pricing = machine.pricing ? (typeof machine.pricing === 'string' ? JSON.parse(machine.pricing) : machine.pricing) : null;
      if (pricing) {
        const amount = type === 'rental' ? pricing.dailyRate : (pricing.price || pricing.salePrice);
        if (amount) {
          priceStr = `Fiyat: ${Number(amount).toLocaleString('tr-TR')} ${pricing.currency || '₺'}`;
        }
      }
    } catch (e) { /* ignore */ }

    const shortDesc = machine.description ? (machine.description.substring(0, 150) + '...') : '';

    const descriptionRaw = `${year ? `${year} Model, ` : ''}${hours ? `${hours}. ` : ''}${priceStr ? `${priceStr}. ` : ''}${shortDesc}`.trim();
    const description =
      (descriptionRaw || `${brandName} ${modelName} ${categoryName} - ${cityName}. Kepçecim'de inceleyin.`).substring(0, 160);

    const imageUrl = getStorageUrl(machine.images?.[0] || machine.image_url);
    const canonical = getCanonicalUrl(`/ilan/${slug}`);

    return {
      title,
      description: description || "İş makinesi ilan detayı. Kepçecim.",
      alternates: { canonical },
      openGraph: {
        title,
        description: description || "İş makinesi ilan detayı. Kepçecim.",
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description || "İş makinesi ilan detayı. Kepçecim.",
        images: imageUrl ? [imageUrl] : [],
      },
    };

  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: 'İlan Detayı | Kepçecim',
      description: 'İkinci el satılık ve kiralık iş makineleri.'
    };
  }
}

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  // Extract ID (Handle UUIDs which contain hyphens, or legacy integer IDs)
  // UUID pattern: 8-4-4-4-12 hex chars
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slug.match(uuidRegex);
  // If UUID found at the end, use it. Otherwise assume it's a simple ID (last part)
  const extractedId = match ? match[0] : slug.split('-').pop();

  // Ensure id is a string, if not return 404 handled by check below
  const id = extractedId || '';

  const resolvedSearchParams = await searchParams;
  const typeParam = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : null;

  let machine = null;
  let type: 'sale' | 'rental' | 'part' = 'sale';
  let table: 'sales_machines' | 'rental_machines' | 'parts' = 'sales_machines';

  try {
    // 1. Determine Type and Fetch Main Data
    if (typeParam === 'rental') {
      machine = await getRentalMachineById(id);
      type = 'rental';
      table = 'rental_machines';
    } else if (typeParam === 'sale') {
      machine = await getSalesMachineById(id);
      type = 'sale';
      table = 'sales_machines';
    } else if (typeParam === 'part') {
      machine = await getPartById(id);
      type = 'part';
      table = 'parts';
    } else {
      // Unknown type: Parallel attempt
      const [saleResult, rentalResult, partResult] = await Promise.allSettled([
        getSalesMachineById(id),
        getRentalMachineById(id),
        getPartById(id)
      ]);

      if (saleResult.status === 'fulfilled' && saleResult.value) {
        machine = saleResult.value;
        type = 'sale';
        table = 'sales_machines';
      } else if (rentalResult.status === 'fulfilled' && rentalResult.value) {
        machine = rentalResult.value;
        type = 'rental';
        table = 'rental_machines';
      } else if (partResult.status === 'fulfilled' && partResult.value) {
        machine = partResult.value;
        type = 'part';
        table = 'parts';
      }
    }

    if (!machine) {
      return (
        <div className="flex h-[50vh] flex-col items-center justify-center text-white">
          <h1 className="text-2xl font-bold">İlan Bulunamadı</h1>
          <p className="text-neutral-400">Aradığınız ilan yayından kaldırılmış veya mevcut değil.</p>
        </div>
      );
    }

    // 2. Fetch Auxiliary Data (Features, Attachments) & Increment View Count
    // We do this in parallel to main thread if possible, but here we await to pass data to client.
    // View count can be non-blocking.
    incrementViewCount(table, id).catch(err => console.error("View count error", err));

    const featureIds = machine.features || [];
    const attachmentIds = machine.attachments || [];

    const [features, attachments] = await Promise.all([
      getFeaturesByIds(featureIds),
      getAttachmentsByIds(attachmentIds)
    ]);

    // Attach resolved names to the machine object for the client
    const enrichedMachine = {
      ...machine,
      resolvedFeatures: features,
      resolvedAttachments: attachments
    };

    const brandName =
      machine.machine_brands?.name ||
      machine.brand?.name ||
      machine.custom_brand_text ||
      "";
    const modelName = machine.machine_models?.name || "";
    const categoryName =
      machine.machine_categories?.name || machine.category?.name || "";
    let cityName = "";
    if (machine.location) {
      try {
        const loc =
          typeof machine.location === "string"
            ? JSON.parse(machine.location)
            : machine.location;
        cityName = loc.city || "";
      } catch {
        /* ignore */
      }
    }
    if (!cityName && machine.city) cityName = machine.city;
    if (!cityName) cityName = "Türkiye";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kepcecim.com";
    const productUrl = `${baseUrl.replace(/\/$/, "")}/ilan/${slug}`;
    const productName =
      `${brandName} ${modelName} ${categoryName}`.replace(/\s+/g, " ").trim() ||
      machine.title ||
      "İş Makinesi";
    const productImage = getStorageUrl(machine.images?.[0] || machine.image_url);
    let price: number | null = null;
    let priceCurrency = "TRY";
    try {
      const pricing =
        machine.pricing &&
        (typeof machine.pricing === "string"
          ? JSON.parse(machine.pricing)
          : machine.pricing);
      if (pricing) {
        price =
          type === "rental"
            ? pricing.dailyRate ?? pricing.monthlyRate
            : pricing.price ?? pricing.salePrice;
        priceCurrency = pricing.currency || "TRY";
      }
    } catch {
      /* ignore */
    }
    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      description: (machine.description || "").substring(0, 500),
      image: productImage || undefined,
      url: productUrl,
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency,
        availability: "https://schema.org/InStock",
        ...(price != null && price > 0 && { price: Number(price) }),
      },
    };

    const typeLabel = type === "rental" ? "Kiralık" : type === "part" ? "Yedek Parça" : "Satılık";
    const listingSlug = type === "rental" ? "kiralik" : type === "part" ? "yedek-parca" : "satilik";
    const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kepcecim.com";
    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: siteBaseUrl },
        { "@type": "ListItem", position: 2, name: `${typeLabel} İş Makineleri`, item: `${siteBaseUrl}/ilanlar/${listingSlug}` },
        { "@type": "ListItem", position: 3, name: productName, item: productUrl },
      ],
    };

    return (
      <>
        <JsonLd data={productJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
        <ListingDetailClient listing={enrichedMachine} type={type} />
      </>
    );

  } catch (error) {
    console.error("Error fetching listing:", error);
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Bir Hata Oluştu</h1>
        <p className="text-neutral-400">İlan detayları yüklenirken bir sorun oluştu.</p>
      </div>
    );
  }
}
