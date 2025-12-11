import { createContext, useContext, useState } from "react";

const EVagaDesktopContext = createContext();

export const useEVagaDesktop = () => {
  const context = useContext(EVagaDesktopContext);
  if (!context) {
    throw new Error("useEVagaDesktop must be used within EVagaDesktopProvider");
  }
  return context;
};

export const EVagaDesktopProvider = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedMobilePackage, setSelectedMobilePackage] = useState(null);

  // Desktop paketi
  const desktopPackages = [
    {
      id: "starter",
      name: "Starter paket",
      price: 89990,
      recommended: false,
      features: [
        "eVaga Desktop - Serverska strana",
        "eVaga Desktop - Klijentska strana (1 licenca)",
        "SQL Server Express integracija",
        "Osnovne funkcionalnosti merenja",
        "Evidencija fizičkih i pravnih lica",
        "Upravljanje vozilima i robom",
        "Štampanje izveštaja",
        "Email podrška",
        "1 mesec besplatne podrške",
      ],
      description: "Idealan za male firme i individualne preduzetnike",
    },
    {
      id: "professional",
      name: "Professional paket",
      price: 149990,
      recommended: true,
      features: [
        "Sve iz Starter paketa",
        "eVaga Desktop - Klijentske stanice (do 5 licenci)",
        "Client-Server arhitektura",
        "WebSocket komunikacija u realnom vremenu",
        "Kontrola pristupa sa 2 nivoa korisnika",
        "Postavke firme sa logoima",
        "Automatska sinhronizacija podataka",
        "Remote pristup podacima",
        "Email i telefon podrška",
        "3 meseca besplatne podrške",
        "Obuka korisnika (2h)",
      ],
      description: "Najpopularniji izbor za srednje firme",
    },
    {
      id: "enterprise",
      name: "Enterprise paket",
      price: 249990,
      recommended: false,
      features: [
        "Sve iz Professional paketa",
        "Neograničen broj klijentskih stanica",
        "SQL Server Standard/Enterprise integracija",
        "Prilagođeni izveštaji i štampanje",
        "Backup i restore automatizacija",
        "VPN pristup za remote konekcije",
        "Integracija sa drugim sistemima (API)",
        "Monitoring i alerting sistem",
        "Dedikovan account manager",
        "6 meseci besplatne podrške",
        "Obuka korisnika (5h)",
        "On-site instalacija i setup",
      ],
      description: "Kompletno rešenje za velike firme",
    },
  ];

  // Mobilni paketi
  const mobilePackages = [
    {
      id: "basic",
      name: "Osnovni paket",
      price: 79990,
      recommended: false,
      platform: "Android ili iOS",
      features: [
        "Mobilna aplikacija po vašoj želji",
        "Osnovna funkcionalnost po zahtevu",
        "Prijava i registracija korisnika",
        "Obaveštenja na telefon",
        "Dizajn u bojama vašeg brenda",
        "1 platforma (Android ili iOS)",
        "2 meseca besplatne podrške",
        "Uputstvo za korišćenje",
        "Testiranje na do 3 telefona",
      ],
      description: "Odličan početak za vašu aplikaciju po meri",
    },
    {
      id: "standard",
      name: "Standardni paket",
      price: 149990,
      recommended: true,
      platform: "Android + iOS",
      features: [
        "Sve iz Osnovnog paketa",
        "Obe platforme (Android + iOS)",
        "Napredniji dizajn po vašoj želji",
        "Rad bez interneta",
        "Povezivanje sa vašim sistemom",
        "Praćenje statistike korišćenja",
        "Plaćanje u aplikaciji (opciono)",
        "Sinhronizacija podataka",
        "4 meseca besplatne podrške",
        "Obuka za administratore",
        "Testiranje na do 10 uređaja",
      ],
      description: "Najpopularniji izbor za ozbiljne projekte",
    },
    {
      id: "premium",
      name: "Premium paket",
      price: 249990,
      recommended: false,
      platform: "Android + iOS + Web",
      features: [
        "Sve iz Standardnog paketa",
        "Web aplikacija (dostupna u browseru)",
        "Chat i komunikacija uživo",
        "Povezivanje sa spoljnim servisima",
        "Izrada servera po vašim potrebama",
        "Kontrolna tabla za upravljanje",
        "Podrška za više jezika",
        "Najviši nivo bezbednosti",
        "Optimizacija brzine i performansi",
        "6 meseci besplatne podrške",
        "Posvećen tim za vas",
        "Neograničeno testiranje",
        "Postavljanje na App Store i Play Store",
      ],
      description: "Kompletno rešenje sa svim mogućnostima",
    },
  ];

  // Dodatne usluge za desktop
  const desktopAdditionalServices = [
    {
      name: "Dodatna klijentska licenca",
      price: 15000,
      unit: "po licenci",
    },
    {
      name: "Tehnička podrška - mesečna",
      price: 5000,
      unit: "mesečno",
    },
    {
      name: "Tehnička podrška - godišnja",
      price: 50000,
      unit: "godišnje (ušteda 17%)",
    },
    {
      name: "Dodatna obuka korisnika",
      price: 8000,
      unit: "po satu",
    },
    {
      name: "Prilagođavanje softvera",
      price: 12000,
      unit: "po satu",
    },
    {
      name: "On-site instalacija",
      price: 20000,
      unit: "jednokratno",
    },
  ];

  // Dodatne usluge za mobilnu aplikaciju
  const mobileAdditionalServices = [
    {
      name: "Još jedna platforma (Android ili iOS)",
      price: 35000,
      unit: "jednokratno",
    },
    {
      name: "Održavanje i podrška",
      price: 8000,
      unit: "mesečno",
    },
    {
      name: "Održavanje i podrška - godišnje",
      price: 80000,
      unit: "godišnje (ušteda 17%)",
    },
    {
      name: "Dodavanje novih mogućnosti",
      price: 10000,
      unit: "po satu rada",
    },
    {
      name: "Promena izgleda aplikacije",
      price: 25000,
      unit: "jednokratno",
    },
    {
      name: "Povezivanje sa drugim servisima",
      price: 15000,
      unit: "po povezivanju",
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS").format(price) + " RSD";
  };

  const value = {
    selectedPackage,
    setSelectedPackage,
    selectedMobilePackage,
    setSelectedMobilePackage,
    desktopPackages,
    mobilePackages,
    desktopAdditionalServices,
    mobileAdditionalServices,
    formatPrice,
  };

  return (
    <EVagaDesktopContext.Provider value={value}>
      {children}
    </EVagaDesktopContext.Provider>
  );
};
