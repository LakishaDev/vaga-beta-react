export const USLUGE_CONFIG = {
  foundedYear: 1991,
  responseTimeHours: 24,
  coverage: "celu Srbiju",
  contact: {
    phones: [
      { label: "Telefon 1", value: "063 810 63 22", href: "tel:+38163810632" },
      { label: "Telefon 2", value: "063 833 9686", href: "tel:+381638339686" },
      { label: "Telefon 3", value: "066 887 8889", href: "tel:+381668878889" },
    ],
    email: "vaga.beta@yahoo.com",
    location: "Niš · Ive Andrića 14",
    address: {
      streetAddress: "Ive Andrića 14",
      addressLocality: "Niš",
      addressCountry: "RS",
    },
  },

  hero: {
    eyebrow: "Akreditovano kontrolno telo · SRPS ISO/IEC 17020 · ATC 06-373",
    primaryCta: { label: "Zakaži intervenciju", href: "#kontakt" },
    secondaryCta: { label: "Pogledaj usluge", href: "#usluge" },
  },

  standards: [
    {
      code: "SRPS ISO/IEC 17020",
      title: "Akreditovano kontrolno telo · ATC 06-373",
      body: "Vaga Beta posluje kao akreditovano kontrolno telo tipa C po standardu SRPS ISO/IEC 17020. Akreditaciju dodeljuje Akreditaciono telo Srbije (ATS), registarski broj 06-373 — potvrda nezavisnosti, nepristrasnosti i tehničke kompetentnosti za inspekcijske aktivnosti nad mernom opremom.",
      authority: "ATS · Akreditaciono telo Srbije",
      accent: "primary",
    },
    {
      code: "Klase tačnosti",
      title: "Verifikacija vaga klasa II–IIII",
      body: "Inspekcijske aktivnosti pokrivaju verifikaciju neautomatskih merila mase u svim klasama tačnosti — od precizne (II) do industrijske (IIII). Klasa I (analitička/etalon) je u pripremi za uskoro proširenje akreditovanog opsega.",
      authority: "Opseg inspekcije · SRPS ISO/IEC 17020",
    },
    {
      code: "Zakonski okvir",
      title: "Pravilnici DMDM i Zakon o metrologiji",
      body: "Sve inspekcijske radnje sprovode se u skladu sa važećim Zakonom o metrologiji Republike Srbije i pravilnicima Direkcije za mere i dragocene metale (DMDM). Rok važenja žiga je po pravilu 24 meseca.",
      authority: "DMDM · Republika Srbija",
    },
  ],

  zigExplainer: {
    image: "/imgs/usluge/slika1.jpg",
    imageAlt:
      "Vaga sa zakonskim žigom akreditovanog kontrolnog tela — Vaga Beta",
    frames: [
      {
        label: "01 — Tipska pločica",
        title: "Svaka legalna vaga nosi pločicu",
        body: "Identitet vage: tip, fabrički broj, klasa tačnosti, opseg. Bez ovoga — vaga nije u zakonskoj upotrebi.",
        scale: 1.0,
        x: 0,
        y: 0,
        box: { left: 34, top: 43, width: 60, height: 31 },
        mob: {
          scale: 1.2,
          x: -12,
          y: 5,
          box: { left: 30, top: 27, width: 72, height: 28 },
        },
      },
      {
        label: "02 — Žig overavanja",
        title: "Ovo je žig.",
        body: "Holografska nalepnica sa brojevima 1–12 oko mernog simbola. Brojevi označavaju mesec i godinu kada je vaga overena. Skidanje žiga ugrožava zakonski identitet vage.",
        scale: 1.8,
        x: 30,
        y: -15,
        box: { left: 3, top: 43, width: 30, height: 34 },
        mob: {
          scale: 2.2,
          x: 30,
          y: -10,
          box: { left: 0, top: 40, width: 30, height: 20 },
        },
      },
      {
        label: "03 — Klasa tačnosti",
        title: "Klasa III — tržišna preciznost.",
        body: "Klase tačnosti idu od I (laboratorijska) do IIII (gruba industrijska). Vaše obaveze zavise od klase i namene.",
        scale: 2.3,
        x: -25,
        y: -20,
        box: { left: 73, top: 63, width: 17, height: 7 },
        mob: {
          scale: 3.0,
          x: -30,
          y: -15,
          box: { left: 79, top: 57, width: 17, height: 8 },
        },
      },
    ],
    frameMs: 6500,
  },

  klase: [
    {
      roman: "I",
      title: "Specijalna tačnost",
      body: "Analitičke i etalon vage — laboratorijska upotreba.",
      status: "soon",
      statusLabel: "Uskoro · u pripremi",
      note: "U procesu proširenja akreditovanog opsega.",
    },
    {
      roman: "II",
      title: "Visoka tačnost",
      body: "Zlatarske i precizne tehničke vage. Tehnologija i istraživanja.",
    },
    {
      roman: "III",
      title: "Srednja tačnost",
      body: "Trgovinske, kontrolne i automatske vage. Najčešće u prometu.",
    },
    {
      roman: "IIII",
      title: "Obična tačnost",
      body: "Kamionske, stočarske i grube industrijske vage velikih opterećenja.",
      highlight: "25+ tona etaloniranih tegova",
      note: "Sopstveni park tegova preko 25 t za overu kamionskih i industrijskih vaga na licu mesta.",
    },
  ],

  services: [
    {
      num: "01 / Overavanje",
      iconType: "seal",
      title: "Zakonska verifikacija i žigosanje",
      lead: "Akreditovani smo za zakonsko overavanje i žigosanje vaga svih klasa. Brinemo o tačnosti i zakonitosti svakog javnog merenja.",
      bullets: [
        "Akreditovani za sva održavanja i žigosanja",
        "Zakonska verifikacija po SRPS ISO/IEC 17020",
        "Klase vaga II, III i IIII (Klasa I uskoro)",
        "Brzo i efikasno — bez nepotrebnog čekanja",
      ],
      screenLabel: "card-overavanje",
    },
    {
      num: "02 / Servis",
      iconType: "wrench",
      title: "Stručno servisiranje i kalibracija",
      lead: "Stručno servisiranje, kalibracija i održavanje vaga — od trgovinskih do industrijskih i kamionskih sistema. Naš tim obezbeđuje preciznost i dugotrajnost svakog merila.",
      bullets: [
        "Stručan i brz servis uz originalne delove",
        "Sve vrste vaga — industrijske, trgovinske, kamionske",
        "Redovno održavanje i kalibracija",
        "Garant na sve servisne intervencije",
      ],
      screenLabel: "card-servis",
    },
  ],

  steps: [
    {
      n: "Step 01",
      t: "Prijava",
      b: "Pošaljete tip vage, lokaciju i razlog (overa, kvar, kalibracija). Odgovaramo u toku radnog dana.",
    },
    {
      n: "Step 02",
      t: "Pregled",
      b: "Tehničar dolazi na lokaciju ili vagu primamo u radionicu. Dijagnostika i procena obima posla.",
    },
    {
      n: "Step 03",
      t: "Intervencija",
      b: "Servis, podešavanje, kalibracija sa etaloniranim tegovima. Sve sa originalnim delovima.",
    },
    {
      n: "Step 04",
      t: "Žigosanje",
      b: "Akreditovano overavanje, izdavanje uverenja i postavljanje žiga sa rokom važenja.",
    },
  ],

  faq: [
    {
      q: "Koliko važi žig na vagi?",
      a: "Po pravilu 24 meseca od datuma overavanja, ali rok zavisi od klase i namene merila.",
    },
    {
      q: "Da li dolazite na lokaciju?",
      a: "Da, pokrivamo celu Srbiju. Tehničar dolazi na lokaciju ili vagu primamo u radionicu.",
    },
    {
      q: "Šta ako mi je istekao žig?",
      a: "Vaga ne sme biti u javnom prometu dok se ne izvrši ponovno overavanje. Pozovite nas — zakazujemo u toku radnog dana.",
    },
    {
      q: "Koje klase vaga overavate?",
      a: "Klase II (precizne tehničke), III (trgovinske) i IIII (industrijske/kamionske, sa sopstvenim parkom 25+ tona tegova). Klasa I (analitičke/etalon) uskoro u akreditovanom opsegu.",
    },
    {
      q: "Da li ste akreditovani?",
      a: "Da. Akreditovani smo kao kontrolno telo tipa C po standardu SRPS ISO/IEC 17020, registarski broj ATC 06-373 (Akreditaciono telo Srbije).",
    },
  ],
};
