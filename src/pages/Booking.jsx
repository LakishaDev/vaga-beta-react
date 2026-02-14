// src/pages/Booking.jsx
// Booking stranica sa Stepper komponentom
// 4 koraka: Usluga, Detalji, Datum, Potvrda
// Full-width moderna verzija sa Cobalt Navy paletom

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import Stepper from "@/components/DesignSystem/Stepper";
import Button from "@/components/DesignSystem/Button";
import Input from "@/components/DesignSystem/Input";
import Card, { CardBody, CardHeader } from "@/components/DesignSystem/Card";
import Badge from "@/components/DesignSystem/Badge";
import toast from "react-hot-toast";
import { createBooking } from "@/services/bookingService";
import { FaCheckCircle } from "react-icons/fa";
import SEO from "@/components/SEO";
import { designTokens } from "@/configs/designTokens";
import { motion as Motion } from "framer-motion";

const SERVICES = [
  {
    id: "servis",
    label: "Servis",
    description: "Dijagnostika i popravka vage",
  },
  {
    id: "zigosanje",
    label: "Žigosanje",
    description: "Legalizacija i certifikacija vage",
  },
  {
    id: "kalibracija",
    label: "Kalibracija",
    description: "Provera i kalibriranje vage",
  },
];

const SCALE_TYPES = [
  { id: "paletna", label: "Paletna vaga" },
  { id: "laboratorijska", label: "Laboratorijska vaga" },
  { id: "desktop", label: "Desktop vaga" },
  { id: "druga", label: "Druga vrsta" },
];

export default function Booking() {
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Prosledi korisnika iz Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const [formData, setFormData] = useState({
    // Korak 1: Usluga
    service: "",
    serviceDetails: "",

    // Korak 2: Detalji vage
    scaleType: "",
    scaleModel: "",
    scaleSerialNumber: "",
    location: "",
    deliveryRequired: false,

    // Korak 3: Datum
    preferredDate: "",
    notes: "",

    // Korak 4: Potvrda
    // (samo prikaz)
  });

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    // Validacija po koraku
    if (currentStep === 1) {
      if (!formData.service) {
        toast.error("Molim odaberite uslugu");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.scaleType || !formData.scaleModel || !formData.location) {
        toast.error("Molim popunite sve obavezne podatke");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.preferredDate) {
        toast.error("Molim odaberite željeni datum");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Molim prijavite se prvo");
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        userId: user.uid,
        userName: user.displayName || "Korisnik",
        userEmail: user.email,
        userPhone: user.phoneNumber || "",

        service: formData.service,
        serviceDetails: formData.serviceDetails,

        scaleType: formData.scaleType,
        scaleModel: formData.scaleModel,
        scaleSerialNumber: formData.scaleSerialNumber || "",

        location: formData.location,
        deliveryRequired: formData.deliveryRequired,

        preferredDate: new Date(formData.preferredDate),
        notes: formData.notes || "",
      };

      const newBookingId = await createBooking(bookingData);
      setBookingId(newBookingId);
      toast.success("✅ Zahtev je uspešno poslан!");

      // Setuj korak na 4 (završetak) nakon što se uspešno pošalje
      setCurrentStep(4);
    } catch (error) {
      console.error("Greška pri slanju zahteva:", error);
      toast.error("❌ Greška pri slanju zahteva. Pokušajte ponovo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = SERVICES.find((s) => s.id === formData.service);
  const selectedScaleType = SCALE_TYPES.find(
    (s) => s.id === formData.scaleType,
  );

  return (
    <>
      <SEO
        title="Zahtev za Servis - Vaga Beta"
        description="Pošalji zahtev za servis, žigosanje ili kalibraciju vage. Brz odgovor u roku od 24 časa."
        url="/booking"
        type="form"
      />

      <main className="w-full bg-neutral-bg">
        {/* HERO SEKCIJA */}
        <section
          className="w-full px-4 sm:px-8 md:px-16 py-16"
          style={{
            background: `linear-gradient(135deg, ${designTokens.colors.brand.primary}, ${designTokens.colors.brand.secondary})`,
          }}
        >
          <div className="max-w-2xl mx-auto text-white">
            <Motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-extrabold mb-4"
            >
              Zahtev za Servis
            </Motion.h1>
            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl opacity-90"
            >
              Ispunite formu u 4 koraka. Odgovoriće vam naš tim u roku od 24
              časa.
            </Motion.p>
          </div>
        </section>

        {/* FORMA SEKCIJA */}
        <section className="w-full px-4 sm:px-8 md:px-16 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Stepper */}
            <div className="mb-12">
              <Stepper
                steps={[
                  { id: 1, label: "Usluga" },
                  { id: 2, label: "Detalji" },
                  { id: 3, label: "Datum" },
                  { id: 4, label: "Potvrda" },
                ]}
                currentStep={currentStep}
                showStepNumbers
                allowStepClick={false}
              />
            </div>

            {/* Sadržaj po koraku */}
            <Card variant="elevated">
              <CardBody className="space-y-6">
                {/* KORAK 1: Usluga */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-text-primary">
                      Odaberite uslugu
                    </h2>

                    {/* Opcije usluga */}
                    <div className="grid gap-4">
                      {SERVICES.map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => {
                            handleFormChange("service", srv.id);
                            handleFormChange("serviceDetails", "");
                          }}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            formData.service === srv.id
                              ? "border-brand-primary bg-brand-primary/5"
                              : "border-neutral-border hover:border-brand-secondary"
                          }`}
                        >
                          <h3 className="font-semibold text-text-primary">
                            {srv.label}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {srv.description}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Dodatne napomene */}
                    {formData.service && (
                      <Input
                        label="Napomene o usluzi"
                        placeholder="Detaljniji opis onoga što vam treba..."
                        value={formData.serviceDetails}
                        onChange={(e) =>
                          handleFormChange("serviceDetails", e.target.value)
                        }
                        multiline
                        rows={3}
                      />
                    )}
                  </div>
                )}

                {/* KORAK 2: Detalji vage */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-text-primary">
                      Detalji o vagi
                    </h2>

                    {/* Tip vage */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-3">
                        Tip vage *
                      </label>
                      <select
                        value={formData.scaleType}
                        onChange={(e) =>
                          handleFormChange("scaleType", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <option value="">Izaberite tip vage...</option>
                        {SCALE_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Model vage */}
                    <Input
                      label="Model / Marka vage *"
                      placeholder="npr. KERN EOB, A&D GX..."
                      value={formData.scaleModel}
                      onChange={(e) =>
                        handleFormChange("scaleModel", e.target.value)
                      }
                    />

                    {/* Serijski broj */}
                    <Input
                      label="Serijski broj (opciono)"
                      placeholder="SN-XXXXXXXX"
                      value={formData.scaleSerialNumber}
                      onChange={(e) =>
                        handleFormChange("scaleSerialNumber", e.target.value)
                      }
                    />

                    {/* Lokacija */}
                    <Input
                      label="Lokacija vage *"
                      placeholder="Vaša adresa ili mesto gde je vaga..."
                      value={formData.location}
                      onChange={(e) =>
                        handleFormChange("location", e.target.value)
                      }
                    />

                    {/* DostavanjeRequired */}
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.deliveryRequired}
                        onChange={(e) =>
                          handleFormChange("deliveryRequired", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-text-primary">
                        Potrebna je dostava / vožnja do lokacije
                      </span>
                    </label>
                  </div>
                )}

                {/* KORAK 3: Datum */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-2xl font-bold text-text-primary">
                      Datum i dodatne napomene
                    </h2>

                    {/* Željeni datum */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Željeni datum *
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          handleFormChange("preferredDate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>

                    {/* Napomene */}
                    <Input
                      label="Dodatne napomene"
                      placeholder="Bilo šta što želite da znamo..."
                      value={formData.notes}
                      onChange={(e) =>
                        handleFormChange("notes", e.target.value)
                      }
                      multiline
                      rows={4}
                    />

                    {/* Rezime */}
                    <Card variant="outlined">
                      <CardBody className="space-y-3">
                        <h3 className="font-semibold text-text-primary">
                          Rezime zahteva:
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Usluga:</span>
                            <span className="font-medium">
                              {selectedService?.label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">
                              Tip vage:
                            </span>
                            <span className="font-medium">
                              {selectedScaleType?.label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Model:</span>
                            <span className="font-medium">
                              {formData.scaleModel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Datum:</span>
                            <span className="font-medium">
                              {formData.preferredDate
                                ? new Date(
                                    formData.preferredDate,
                                  ).toLocaleDateString("sr-RS")
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {/* KORAK 4: Potvrda */}
                {currentStep === 4 && (
                  <div className="space-y-6 text-center">
                    <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto" />

                    <div>
                      <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
                        Zahtev je primljen!
                      </h2>
                      <p className="text-text-secondary mb-4">
                        Hvala što ste se obratili Vaga Beta-i. Odgovoriće vam
                        naš tim u roku od 24 časa.
                      </p>
                      {bookingId && (
                        <Badge variant="success" className="inline-block">
                          ID: {bookingId.slice(0, 8).toUpperCase()}...
                        </Badge>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        📧 Potvrda je poslata na: <strong>{user?.email}</strong>
                      </p>
                    </div>

                    <div className="pt-4 space-y-3">
                      <p className="text-sm text-text-secondary">
                        Možete pratiti status zahteva na stranici{" "}
                        <strong>"Moji zahtevi"</strong> u profilu.
                      </p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Dugmići za navigaciju */}
            <div className="mt-8 flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 1 || currentStep === 4}
              >
                ← Nazad
              </Button>

              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={currentStep === 3 ? handleSubmit : handleNextStep}
                  loading={isSubmitting}
                >
                  {currentStep === 3 ? "Pošalji zahtev" : "Dalje →"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    // Reset forma
                    setCurrentStep(1);
                    setBookingId(null);
                    setFormData({
                      service: "",
                      serviceDetails: "",
                      scaleType: "",
                      scaleModel: "",
                      scaleSerialNumber: "",
                      location: "",
                      deliveryRequired: false,
                      preferredDate: "",
                      notes: "",
                    });
                  }}
                >
                  Novi zahtev
                </Button>
              )}
            </div>

            {!user && currentStep !== 4 && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Molim <strong>prijavite se</strong> pre nego što pošaljete
                  zahtev.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
