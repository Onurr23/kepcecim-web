import { getSalesMachineById } from "@/services/sales";
import { getRentalMachineById } from "@/services/rental";
import { getPartById } from "@/services/parts";
import { getFeaturesByIds, getAttachmentsByIds } from "@/services/categories";
import { incrementViewCount } from "@/services/view-count";
import ListingDetailClient from "@/components/listing/ListingDetailClient";

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ListingDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const typeParam = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : null;

  let machine = null;
  let type: 'sale' | 'rental' | 'part' = 'sale';
  let table: 'sales_machines' | 'rental_machines' | 'parts' = 'sales_machines';

  try {
    // 1. Determine Type and Fetch Main Data
    if (typeParam === 'rental') {
      machine = await getRentalMachineById(slug);
      type = 'rental';
      table = 'rental_machines';
    } else if (typeParam === 'sale') {
      machine = await getSalesMachineById(slug);
      type = 'sale';
      table = 'sales_machines';
    } else if (typeParam === 'part') {
      machine = await getPartById(slug);
      type = 'part';
      table = 'parts';
    } else {
      // Unknown type: Parallel attempt
      const [saleResult, rentalResult, partResult] = await Promise.allSettled([
        getSalesMachineById(slug),
        getRentalMachineById(slug),
        getPartById(slug)
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
    incrementViewCount(table, slug).catch(err => console.error("View count error", err));

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

    return <ListingDetailClient listing={enrichedMachine} type={type} />;

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
