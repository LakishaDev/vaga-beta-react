import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
  Badge,
  Modal,
  Stepper,
} from "../components/DesignSystem";

/**
 * Design System Demo Page
 *
 * Showcase and testing page for all design system components
 * Use this page to:
 * - Visually test all components
 * - Test responsive behavior
 * - Test accessibility (keyboard navigation, screen readers)
 * - Demonstrate design system to team/stakeholders
 */
const DesignSystemDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");

  // Email validation
  const validateEmail = (email) => {
    if (!email) {
      setEmailError("Email je obavezan");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Unesite validnu email adresu");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Stepper example steps
  const stepperSteps = [
    {
      id: 1,
      label: "Izbor usluge",
      component: ({ nextStep }) => (
        <div className="space-y-4">
          <h3 className="font-heading text-2xl font-bold text-text-primary">
            Izaberite vrstu usluge
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="outlined" hoverable clickable onClick={nextStep}>
              <CardBody className="text-center py-8">
                <div className="text-4xl mb-3">🔧</div>
                <h4 className="font-semibold text-lg mb-2">Servis</h4>
                <p className="text-sm text-text-secondary">
                  Popravka i održavanje
                </p>
              </CardBody>
            </Card>
            <Card variant="outlined" hoverable clickable onClick={nextStep}>
              <CardBody className="text-center py-8">
                <div className="text-4xl mb-3">✓</div>
                <h4 className="font-semibold text-lg mb-2">Overavanje</h4>
                <p className="text-sm text-text-secondary">Žigosanje i overa</p>
              </CardBody>
            </Card>
            <Card variant="outlined" hoverable clickable onClick={nextStep}>
              <CardBody className="text-center py-8">
                <div className="text-4xl mb-3">🔄</div>
                <h4 className="font-semibold text-lg mb-2">Održavanje</h4>
                <p className="text-sm text-text-secondary">
                  Redovno održavanje
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      label: "Detalji",
      component: () => (
        <div className="space-y-6">
          <h3 className="font-heading text-2xl font-bold text-text-primary">
            Detalji zahteva
          </h3>
          <div className="space-y-4">
            <Input
              id="scale-type"
              label="Tip vage"
              placeholder="npr. Paletna vaga"
            />
            <Input
              id="serial-number"
              label="Serijski broj"
              placeholder="Unesite serijski broj"
            />
            <div className="relative">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Opis problema
              </label>
              <textarea
                id="description"
                rows="4"
                className="w-full px-4 py-3 text-base bg-neutral-surface border-2 border-neutral-border rounded-md 
                         focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 
                         transition-all duration-base"
                placeholder="Opišite problem ili potrebu..."
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      label: "Potvrda",
      component: () => (
        <div className="space-y-6">
          <h3 className="font-heading text-2xl font-bold text-text-primary">
            Potvrda zahteva
          </h3>
          <Card variant="outlined">
            <CardBody className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-neutral-border">
                <span className="text-text-secondary">Usluga:</span>
                <span className="font-semibold">Servis</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-border">
                <span className="text-text-secondary">Tip vage:</span>
                <span className="font-semibold">Paletna vaga</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text-secondary">Status:</span>
                <Badge variant="info">Na čekanju</Badge>
              </div>
            </CardBody>
          </Card>
          <div className="bg-success-bg border border-success-main/20 rounded-lg p-4">
            <p className="text-success-text text-sm">
              ✓ Vaš zahtev će biti obrađen u roku od 24h. Dobićete email
              potvrdu.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-5xl font-extrabold text-text-primary mb-4">
            Design System Demo
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Cobalt Navy paleta • WCAG AA Compliant • Pristupačno
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Badge variant="primary">Inter + Manrope</Badge>
            <Badge variant="success">8pt Grid</Badge>
            <Badge variant="info">Ready for Production</Badge>
          </div>
        </div>

        {/* Color Swatches */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            🎨 Paleta boja
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-brand-primary rounded-lg shadow-md flex items-center justify-center">
                <span className="text-white font-medium text-sm">Primary</span>
              </div>
              <p className="text-sm text-text-secondary text-center">#0B3A8D</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-brand-secondary rounded-lg shadow-md flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  Secondary
                </span>
              </div>
              <p className="text-sm text-text-secondary text-center">#1D4ED8</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-brand-accent rounded-lg shadow-md flex items-center justify-center">
                <span className="text-white font-medium text-sm">Accent</span>
              </div>
              <p className="text-sm text-text-secondary text-center">#0E7490</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-neutral-surface border-2 border-neutral-border rounded-lg shadow-md flex items-center justify-center">
                <span className="text-text-primary font-medium text-sm">
                  Surface
                </span>
              </div>
              <p className="text-sm text-text-secondary text-center">#FFFFFF</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-neutral-bg border-2 border-neutral-border rounded-lg shadow-md flex items-center justify-center">
                <span className="text-text-primary font-medium text-sm">
                  Background
                </span>
              </div>
              <p className="text-sm text-text-secondary text-center">#F8FAFC</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            🔘 Buttons
          </h2>

          {/* Variants */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-text-secondary">
              Varijante
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-text-secondary">
              Veličine
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>

          {/* States */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-text-secondary">
              Stanja
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button loading>Loading...</Button>
              <Button disabled>Disabled</Button>
              <Button leftIcon={<span>←</span>}>Sa ikonom levo</Button>
              <Button rightIcon={<span>→</span>}>Sa ikonom desno</Button>
            </div>
          </div>

          {/* Full Width */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-text-secondary">
              Full Width
            </h3>
            <Button fullWidth variant="primary">
              Full Width Button
            </Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            📝 Inputs
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <Input
              id="demo-name"
              label="Ime i prezime"
              placeholder="Unesite ime i prezime"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              id="demo-email"
              type="email"
              label="Email adresa"
              placeholder="primer@email.com"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              onBlur={() => validateEmail(emailValue)}
              error={emailError}
              helperText={!emailError && "Unesite validnu email adresu"}
            />
            <Input
              id="demo-phone"
              type="tel"
              label="Telefon"
              placeholder="+381 60 123 4567"
              leftIcon={<span>📞</span>}
            />
            <Input
              id="demo-disabled"
              label="Disabled Input"
              value="Cannot edit"
              disabled
            />
            <Input id="demo-date" type="date" label="Datum" />
            <Input
              id="demo-password"
              type="password"
              label="Lozinka"
              placeholder="••••••••"
            />
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            🎴 Cards
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <h3 className="font-heading text-xl font-semibold">
                  Default Card
                </h3>
              </CardHeader>
              <CardBody>
                <p className="text-text-secondary">
                  Border sa default stilom. Standardan card za većinu slučajeva.
                </p>
              </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
              <CardHeader>
                <h3 className="font-heading text-xl font-semibold">
                  Elevated Card
                </h3>
              </CardHeader>
              <CardBody>
                <p className="text-text-secondary">
                  Shadowed card sa hover lift efektom. Preporuka za proizvode.
                </p>
              </CardBody>
              <CardFooter divided>
                <Button size="sm" variant="primary">
                  Detalji
                </Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <h3 className="font-heading text-xl font-semibold">
                  Outlined Card
                </h3>
              </CardHeader>
              <CardBody>
                <p className="text-text-secondary">
                  Outlined card sa deblim border-om. Dobro za emphasis.
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Card with Image */}
          <div className="mt-6 max-w-sm">
            <Card variant="elevated" hoverable padding="none">
              <CardImage
                src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop"
                alt="Industrial scale"
                aspectRatio="4/3"
              />
              <div className="p-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold">
                      Paletna vaga
                    </h3>
                    <Badge variant="success">Dostupno</Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-text-secondary mb-2">
                    Profesionalna paletna vaga za industrijske potrebe.
                  </p>
                  <p className="text-2xl font-bold text-brand-primary">
                    150.000 RSD
                  </p>
                </CardBody>
                <CardFooter divided>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" fullWidth>
                      Dodaj u korpu
                    </Button>
                    <Button variant="outline" size="sm">
                      Detalji
                    </Button>
                  </div>
                </CardFooter>
              </div>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            🏷️ Badges
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-text-secondary">
                Varijante
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-text-secondary">
                Veličine
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-text-secondary">
                Sa dot indikatorom
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success" dot>
                  Dostupno
                </Badge>
                <Badge variant="warning" dot>
                  Na čekanju
                </Badge>
                <Badge variant="error" dot>
                  Nedostupno
                </Badge>
                <Badge variant="info" dot>
                  Novo
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-text-secondary">
                Removable
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="primary"
                  removable
                  onRemove={() => alert("Removed!")}
                >
                  Paletna vaga
                </Badge>
                <Badge
                  variant="info"
                  removable
                  onRemove={() => alert("Removed!")}
                >
                  Kamionska vaga
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Modal */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            🪟 Modal
          </h2>
          <Button onClick={() => setIsModalOpen(true)}>Otvori Modal</Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Primer Modal Dialoga"
            size="md"
            footer={
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Otkaži
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Potvrdi
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-text-secondary">
                Ovo je primer modal dialoga sa pristupačnim fokus trap-om.
                Pritisnite{" "}
                <kbd className="px-2 py-1 bg-neutral-bg border border-neutral-border rounded text-sm">
                  ESC
                </kbd>{" "}
                za zatvaranje ili kliknite van dialoga.
              </p>
              <Input
                id="modal-input"
                label="Test Input u Modalu"
                placeholder="Probajte Tab navigaciju..."
              />
              <p className="text-sm text-text-tertiary">
                ♿ Accessibility: Focus je ograničen na modal,{" "}
                <kbd className="px-1.5 py-0.5 bg-neutral-bg border border-neutral-border rounded text-xs">
                  Tab
                </kbd>{" "}
                kruži kroz elemente.
              </p>
            </div>
          </Modal>
        </section>

        {/* Stepper */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            📊 Stepper (Booking Flow)
          </h2>
          <Card variant="elevated" padding="lg">
            <Stepper
              steps={stepperSteps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onComplete={() => {
                alert("Zahtev poslat! ✓");
                setCurrentStep(1);
              }}
              allowStepClick={true}
            />
          </Card>
          <p className="mt-4 text-sm text-text-tertiary text-center">
            ♿ Keyboard: Koristite{" "}
            <kbd className="px-1.5 py-0.5 bg-neutral-bg border border-neutral-border rounded text-xs">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-neutral-bg border border-neutral-border rounded text-xs">
              →
            </kbd>{" "}
            za navigaciju između koraka
          </p>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            ✍️ Tipografija
          </h2>
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="font-heading text-5xl font-extrabold text-text-primary mb-2">
                Heading 1 - Manrope Bold
              </h1>
              <p className="text-sm text-text-tertiary">
                font-heading text-5xl font-extrabold
              </p>
            </div>
            <div>
              <h2 className="font-heading text-4xl font-bold text-text-primary mb-2">
                Heading 2 - Manrope Bold
              </h2>
              <p className="text-sm text-text-tertiary">
                font-heading text-4xl font-bold
              </p>
            </div>
            <div>
              <h3 className="font-heading text-3xl font-bold text-text-primary mb-2">
                Heading 3 - Manrope Bold
              </h3>
              <p className="text-sm text-text-tertiary">
                font-heading text-3xl font-bold
              </p>
            </div>
            <div>
              <p className="font-body text-base text-text-primary mb-2 leading-relaxed">
                Body text - Inter Regular. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris.
              </p>
              <p className="text-sm text-text-tertiary">
                font-body text-base (16px)
              </p>
            </div>
            <div>
              <p className="font-body text-sm text-text-secondary mb-2">
                Small text - Inter Regular. Perfect for captions and secondary
                information.
              </p>
              <p className="text-sm text-text-tertiary">
                font-body text-sm (14px)
              </p>
            </div>
          </div>
        </section>

        {/* Accessibility Notes */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            ♿ Accessibility Features
          </h2>
          <Card variant="outlined" padding="lg">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold mb-1">WCAG AA Color Contrast</h4>
                  <p className="text-sm text-text-secondary">
                    Svi parovi boja imaju minimum 4.5:1 kontrast za normalni
                    tekst
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold mb-1">Keyboard Navigation</h4>
                  <p className="text-sm text-text-secondary">
                    Sve komponente su dostupne samo sa tastaturom (Tab, Enter,
                    Esc, Arrow keys)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold mb-1">Focus Indicators</h4>
                  <p className="text-sm text-text-secondary">
                    Vidljivi fokus ringovi na svim interaktivnim elementima
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold mb-1">ARIA Attributes</h4>
                  <p className="text-sm text-text-secondary">
                    Pravilno označavanje za screen reader-e (aria-label,
                    aria-describedby, role)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold mb-1">Semantic HTML</h4>
                  <p className="text-sm text-text-secondary">
                    Korišćenje pravilnih HTML elemenata (button, nav, main,
                    etc.)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Testing Instructions */}
        <section className="mb-16">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            🧪 Testing Checklist
          </h2>
          <Card variant="default" padding="lg">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-text-primary">
                  Testiraj sa{" "}
                  <kbd className="px-2 py-1 bg-neutral-bg border border-neutral-border rounded text-xs">
                    Tab
                  </kbd>{" "}
                  key navigacijom
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-text-primary">
                  Proveri responsive na mobilnom (375px, 768px, 1024px)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-text-primary">
                  Testiraj sa screen reader-om (NVDA/JAWS)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-text-primary">
                  Proveri kontrast sa WebAIM Contrast Checker
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-text-primary">
                  Run Lighthouse accessibility audit (trebalo bi 95+)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-text-primary">
                  Testiraj hover/focus states na svim komponentama
                </span>
              </label>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
