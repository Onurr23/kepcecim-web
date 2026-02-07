interface JsonLdProps {
  data: object | object[];
}

/**
 * Renders JSON-LD structured data as a script tag.
 * Use in server components for SEO (WebSite, Product, Organization, FAQPage, etc.).
 */
export default function JsonLd({ data }: JsonLdProps) {
  const jsonString = JSON.stringify(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
