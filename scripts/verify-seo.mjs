#!/usr/bin/env node
/**
 * SEO doğrulama script'i.
 * Kullanım: node scripts/verify-seo.mjs [BASE_URL]
 * Örnek:   node scripts/verify-seo.mjs https://kepcecim.com
 *          node scripts/verify-seo.mjs http://localhost:3000
 *
 * BASE_URL verilmezse NEXT_PUBLIC_BASE_URL veya http://localhost:3000 kullanılır.
 */

const BASE =
  process.argv[2] ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";
const baseUrl = BASE.replace(/\/$/, "");

const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const fail = (msg) => console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
const info = (msg) => console.log(`  \x1b[36m?\x1b[0m ${msg}`);

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  return { status: res.status, text: await res.text(), url: res.url };
}

async function checkSitemap() {
  console.log("\n1. Sitemap");
  try {
    const { status, text } = await fetchText(`${baseUrl}/sitemap.xml`);
    if (status !== 200) {
      fail(`sitemap.xml status ${status}`);
      return;
    }
    ok(`sitemap.xml erişilebilir (${status})`);
    // Sitemap local'de farklı base URL ile üretilebilir (örn. NEXT_PUBLIC_BASE_URL yokken kepcecim.com)
    const hasLoc = text.includes("<loc>");
    const hasBase =
      text.includes(baseUrl) ||
      (baseUrl.includes("localhost") && text.includes("kepcecim.com")) ||
      /<loc>https?:\/\/[^<]+<\/loc>/.test(text);
    const hasGaleriler = text.includes("/galeriler");
    if (hasLoc && hasBase) ok("Ana sayfa / URL'ler sitemap'te");
    else if (hasLoc) ok("Sitemap'te URL'ler var (base farklı olabilir)");
    else fail("Sitemap'te <loc> bulunamadı");
    if (hasGaleriler) ok("/galeriler sitemap'te");
    else fail("/galeriler sitemap'te bulunamadı");
  } catch (e) {
    fail(`sitemap: ${e.message}`);
  }
}

async function checkRobots() {
  console.log("\n2. Robots.txt");
  try {
    const { status, text } = await fetchText(`${baseUrl}/robots.txt`);
    if (status !== 200) {
      fail(`robots.txt status ${status}`);
      return;
    }
    ok(`robots.txt erişilebilir (${status})`);
    const hasSitemap = text.includes("Sitemap:") && text.includes("sitemap.xml");
    const hasDisallow = text.includes("Disallow:");
    if (hasSitemap) ok("Sitemap satırı doğru");
    else fail("Sitemap satırı eksik veya yanlış");
    if (hasDisallow) ok("Disallow kuralları var");
    else info("Disallow kuralı yok (opsiyonel)");
  } catch (e) {
    fail(`robots: ${e.message}`);
  }
}

async function checkPage(path, checks) {
  try {
    const { status, text } = await fetchText(`${baseUrl}${path}`);
    if (status !== 200) {
      fail(`${path} → status ${status}`);
      return;
    }
    for (const { name, test } of checks) {
      if (test(text)) ok(`${path} → ${name}`);
      else fail(`${path} → ${name}`);
    }
  } catch (e) {
    fail(`${path} → ${e.message}`);
  }
}

async function main() {
  console.log(`\nSEO doğrulama: ${baseUrl}\n`);

  await checkSitemap();
  await checkRobots();

  console.log("\n3. Sayfa meta / JSON-LD");

  await checkPage("/", [
    { name: "title", test: (t) => /<title>[^<]+<\/title>/.test(t) },
    {
      name: "description",
      test: (t) => /<meta[^>]+name="description"[^>]+content="[^"]+"/.test(t),
    },
    {
      name: "canonical veya meta",
      test: (t) =>
        /<link[^>]+rel="canonical"/.test(t) ||
        /<meta[^>]+property="og:url"/.test(t),
    },
    {
      name: "WebSite JSON-LD",
      test: (t) =>
        /application\/ld\+json/.test(t) && /"@type"\s*:\s*"WebSite"/.test(t),
    },
  ]);

  await checkPage("/ilanlar/satilik", [
    {
      name: "title",
      test: (t) =>
        /<title>[^<]+<\/title>/.test(t) &&
        (t.includes("Satılık") || t.includes("satilik") || t.includes("İlan")),
    },
    {
      name: "canonical",
      test: (t) =>
        /<link[^>]+rel="canonical"[^>]+href="[^"]*\/ilanlar\/satilik/.test(t),
    },
  ]);

  await checkPage("/galeriler", [
    { name: "title", test: (t) => /<title>[^<]+Galeri[^<]*<\/title>/.test(t) },
    {
      name: "description",
      test: (t) => /<meta[^>]+name="description"[^>]+content="[^"]+"/.test(t),
    },
  ]);

  await checkPage("/kurumsal/sss", [
    { name: "title", test: (t) => /<title>[^<]+<\/title>/.test(t) },
    {
      name: "FAQPage JSON-LD",
      test: (t) =>
        /application\/ld\+json/.test(t) &&
        /"@type"\s*:\s*"FAQPage"/.test(t),
    },
  ]);

  await checkPage("/indir", [
    { name: "title", test: (t) => /<title>[^<]+İndir[^<]*<\/title>/.test(t) },
    {
      name: "SoftwareApplication JSON-LD",
      test: (t) =>
        /application\/ld\+json/.test(t) &&
        /"@type"\s*:\s*"SoftwareApplication"/.test(t),
    },
  ]);

  console.log("\n---\nDetaylı kontrol için: docs/SEO-VERIFICATION-CHECKLIST.md\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
