/**
 * SEO Configurations
 * Pre-defined SEO configs za različite stranice
 */

export const SEO_CONFIGS = {
  home: {
    title: "Vaga Beta | Žigosanje, Overavanje i Servis Vaga | Srbija",
    description:
      "Profesionalan servis za vage - žigosanje, overavanje, kalibrisanje i softverska rešenja. Ovlašćeni servis sa 35+ godina iskustva. Pozovite nas danas!",
    keywords:
      "vaga beta, servis vaga, žigosanje vaga, overavanje vaga, digitalne vage, industrijske vage, laboratorijske vage",
    url: "https://vagabeta.rs",
  },

  usluge: {
    title:
      "Akreditovano kontrolno telo ATC 06-373 — SRPS ISO/IEC 17020 | Vaga Beta",
    description:
      "Akreditovano kontrolno telo (ATC 06-373) po SRPS ISO/IEC 17020 — zakonsko overavanje, žigosanje, servis i kalibracija vaga klasa II, III i IIII. Sopstveni park 25+ tona etaloniranih tegova. Brz odziv 24h, pokrivamo celu Srbiju.",
    keywords: [
      "overavanje vaga",
      "žigosanje vaga",
      "servis vaga",
      "kalibracija vaga",
      "akreditovano kontrolno telo",
      "SRPS ISO/IEC 17020",
      "ATC 06-373",
      "kontrolno telo tipa C",
      "etalonirani tegovi",
      "25 tona tegova",
      "kamionska vaga overa",
      "kamionske vage",
      "industrijske vage",
      "trgovinske vage",
      "klasa tačnosti vage",
      "verifikacija vage Srbija",
      "Vaga Beta usluge",
      "metrološki servis",
      "etaloniranje vaga",
      "MKO modul kontrole overe",
      "eVaga",
    ].join(", "),
    url: "https://vagabeta.rs/usluge",
    image: "https://vagabeta.rs/imgs/usluge/og-usluge.jpg",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Vaga Beta — Akreditovano kontrolno telo",
        url: "https://vagabeta.rs/usluge",
        image: "https://vagabeta.rs/imgs/usluge/og-usluge.jpg",
        telephone: "+381638106322",
        email: "vaga.beta@yahoo.com",
        priceRange: "$$",
        areaServed: { "@type": "Country", name: "Srbija" },
        foundingDate: "1991",
        slogan: "Tačnost koja ima zakonsku težinu.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Ive Andrića 14",
          addressLocality: "Niš",
          addressCountry: "RS",
        },
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "ATS Accreditation No.",
            value: "06-373",
          },
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            name: "SRPS ISO/IEC 17020",
            identifier: "ATC 06-373",
          },
        ],
        serviceType: [
          "Zakonsko overavanje vaga",
          "Žigosanje vaga",
          "Servis vaga",
          "Kalibracija vaga",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Usluge Vaga Beta",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Zakonsko overavanje i žigosanje vaga",
                serviceType: "Metrološka verifikacija",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Servis i kalibracija vaga",
                serviceType: "Tehničko održavanje",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "eVaga MKO — Modul kontrole overe",
                serviceType: "Digitalno praćenje overe",
              },
            },
          ],
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Početna",
            item: "https://vagabeta.rs/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Usluge",
            item: "https://vagabeta.rs/usluge",
          },
        ],
      },
    ],
  },

  kontakt: {
    title: "Kontakt - Pozovite Nas | Vaga Beta",
    description:
      "Kontaktirajte Vaga Beta za sve informacije o servisiranju, žigosanju i prodaji vaga. Brzi odgovor, profesionalna pomoć.",
    keywords: "kontakt vaga beta, telefon, email, adresa, poziv",
    url: "https://vagabeta.rs/kontakt",
  },

  onama: {
    title: "O Nama - Naša Priča i Misija | Vaga Beta",
    description:
      "Saznajte više o Vaga Beta - našoj istoriji, vrednostima i timu koji čini razliku u industriji vaga. 35+ godina iskustva.",
    keywords: "o nama, vaga beta tim, istorija, misija, vizija",
    url: "https://vagabeta.rs/onama",
  },

  prodavnica: {
    title: "Online Prodavnica - Softver i Oprema za Vage | Vaga Beta",
    description:
      "Kupujte profesionalan softver, opremu i delove za vage online. Brza dostava, sigurna kupovina, tehnička podrška.",
    keywords: "prodavnica vaga, softver za vage, kupovina online, oprema",
    url: "https://vagabeta.rs/prodavnica",
  },

  aplikacija: {
    title: "eVaga Aplikacija - Mobilno Rešenje | Vaga Beta",
    description:
      "Preuzmite eVaga aplikaciju za upravljanje vagama sa mobilnog uređaja. Jednostavno, brzo, efikasno.",
    keywords: "evaga, aplikacija, mobilna aplikacija, vage, android, ios",
    url: "https://vagabeta.rs/aplikacija",
  },

  evagaDesktop: {
    title: "eVaga Desktop - Desktop Softver za Vage | Vaga Beta",
    description:
      "Profesionalan desktop softver za upravljanje vagama, skladištem i poslovnim procesima. Probna verzija dostupna.",
    keywords:
      "evaga desktop, desktop softver, windows, vage softver, poslovna aplikacija",
    url: "https://vagabeta.rs/evaga-desktop",
  },
};
