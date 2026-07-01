import { createFileRoute } from "@tanstack/react-router";
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Scissors,
  Star,
  MessageCircle,
} from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import { BookingForm } from "@/components/booking-form";
import { BARBERS, SERVICES } from "@/lib/booking";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

const NAV = [
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#fiyatlar", label: "Fiyatlar" },
  { href: "#randevu", label: "Randevu" },
  { href: "#yorumlar", label: "Yorumlar" },
  { href: "#iletisim", label: "İletişim" },
];

const REVIEWS = [
  {
    name: "Murat Can Sarıbaş",
    text: "Bu kadar ilgili ve istenilen traşı birebir yapan berber daha Beylikdüzü'nde bulamadım. Yeni açılmış, iyi deneyim oldu; artık her zaman burdayım.",
  },
  {
    name: "Recep Bilir",
    text: "Uzun zamandır böyle kaliteli tıraş olmamıştım. Kafa yapınıza göre uygun kesim yapıyorlar, kesinlikle tavsiye ederim.",
  },
  {
    name: "Ahmet Bedirhan Bayhan",
    text: "6 yıla aşkın güvenle keyifle traş olduğum İsmail kardeşimi herkese tavsiye ederim. Fiyat/kalite mükemmel.",
  },
];

const HOURS_ROWS = [
  { day: "Pazartesi", val: "09:00 – 21:00" },
  { day: "Salı", val: "09:00 – 21:00" },
  { day: "Çarşamba", val: "09:00 – 21:00" },
  { day: "Perşembe", val: "09:00 – 21:00" },
  { day: "Cuma", val: "09:00 – 21:00" },
  { day: "Cumartesi", val: "09:00 – 23:00" },
  { day: "Pazar", val: "Kapalı" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <About />
      <Services />
      <Prices />
      <Booking />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-narrow flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          <span className="font-display text-lg tracking-tight">Nursoy Barber</span>
        </a>
        <nav className="hidden gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#randevu">
          <Button size="sm" className="rounded-none">Randevu Al</Button>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <img
        src={heroImg}
        alt="Nursoy Barber iç mekanı"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      <div className="container-narrow relative z-10 py-24">
        <div className="max-w-3xl animate-fade-in">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Beylikdüzü · İstanbul
          </p>
          <h1 className="mb-6 text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
            Klasik ustalık.<br />
            <span className="italic text-muted-foreground">Modern deneyim.</span>
          </h1>
          <p className="mb-10 max-w-xl text-lg text-muted-foreground">
            Nurullah ve İsmail Aksoy tarafından işletilen Nursoy Barber'da her tıraş özenle, hijyenle ve tarza dair sezgiyle şekillendirilir.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#randevu">
              <Button size="lg" className="h-12 rounded-none px-8">
                Online Randevu Al
              </Button>
            </a>
            <a href="#hizmetler">
              <Button size="lg" variant="outline" className="h-12 rounded-none px-8">
                Hizmetleri Gör
              </Button>
            </a>
          </div>
          <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
              ))}
            </div>
            <span>5,0 · Google'da 28 yorum</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="hakkimizda" className="border-t border-border py-24 md:py-32">
      <div className="container-narrow grid gap-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">Hakkımızda</p>
          <h2 className="mb-6 text-4xl md:text-5xl">Zanaata dair bir hikaye.</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Nursoy Barber, iki kardeşin — Nurullah ve İsmail Aksoy — yıllara dayanan tecrübesiyle Beylikdüzü'nde açılmış modern bir erkek berberidir. Her müşteriye, kafa yapısına ve stiline uygun kesim sunmayı ilke ediniriz.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Hijyen, profesyonellik ve dostane bir ortam — burada sadece tıraş olmuyorsunuz; kendinize ait bir mola alıyorsunuz.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <Stat number="10+" label="Yıl Tecrübe" />
            <Stat number="5,0" label="Google Puanı" />
            <Stat number="1000+" label="Mutlu Müşteri" />
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={aboutImg}
            alt="Berber elleri, ustura ile tıraş anı"
            width={1200}
            height={1400}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl">{number}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Services() {
  const items = [
    { title: "Saç Tıraşı", desc: "Kişiye özel makine + makas kesim, yıkama dahil." },
    { title: "Sakal Şekillendirme", desc: "Ustura hassasiyetinde profesyonel sakal tıraşı." },
    { title: "Ustura Tıraşı", desc: "Sıcak havlu, köpük ve klasik ustura ritüeli." },
    { title: "Cilt Bakımı", desc: "Temizleme, peeling ve nemlendirme uygulaması." },
    { title: "Çocuk Tıraşı", desc: "Küçük müşteriler için sabırlı, güvenli kesim." },
    { title: "Kaş & Detay", desc: "İnce dokunuşlarla tamamlanmış bir bakım." },
  ];
  return (
    <section id="hizmetler" className="border-t border-border bg-muted/20 py-24 md:py-32">
      <div className="container-narrow">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">Hizmetler</p>
          <h2 className="text-4xl md:text-5xl">Her detayda ustalık.</h2>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group relative bg-background p-8 transition-colors hover:bg-card"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-xs text-muted-foreground">
                  0{i + 1}
                </span>
                <Scissors className="h-5 w-5 opacity-40 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-3 text-xl">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Prices() {
  return (
    <section id="fiyatlar" className="border-t border-border py-24 md:py-32">
      <div className="container-narrow">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">Fiyat Listesi</p>
          <h2 className="text-4xl md:text-5xl">Şeffaf, sabit fiyatlar.</h2>
        </div>
        <div className="mx-auto max-w-3xl">
          <ul className="divide-y divide-border border-y border-border">
            {SERVICES.map((s) => (
              <li
                key={s.name}
                className="flex items-baseline justify-between gap-4 py-5"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-lg md:text-xl">{s.name}</span>
                  <span className="hidden flex-1 border-b border-dashed border-border md:block" />
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-muted-foreground">{s.duration} dk</span>
                  <span className="font-display text-xl md:text-2xl">{s.price}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="randevu" className="border-t border-border bg-muted/20 py-24 md:py-32">
      <div className="container-narrow grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">Online Randevu</p>
          <h2 className="mb-6 text-4xl md:text-5xl">Randevunu şimdi al.</h2>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Berberini, hizmetini ve uygun saati seç. Onayladıktan sonra WhatsApp'ta hazır bir mesajla berberine ulaşacaksın — sadece "Gönder"e basman yeterli.
          </p>
          <div className="space-y-4">
            {Object.values(BARBERS).map((b) => (
              <div key={b.slug} className="flex items-center justify-between rounded-md border border-border p-4">
                <div>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.phoneDisplay}</div>
                </div>
                <a href={`tel:${b.phone}`}>
                  <Button variant="outline" size="sm" className="rounded-none">
                    <Phone className="mr-2 h-4 w-4" /> Ara
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="yorumlar" className="border-t border-border py-24 md:py-32">
      <div className="container-narrow">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">Yorumlar</p>
            <h2 className="text-4xl md:text-5xl">Müşterilerimiz ne diyor?</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-foreground text-foreground" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">5,0 · 28 Google yorumu</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <blockquote
              key={r.name}
              className="flex flex-col justify-between rounded-md border border-border bg-card p-6"
            >
              <div>
                <div className="mb-4 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">"{r.text}"</p>
              </div>
              <footer className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
                — {r.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="iletisim" className="border-t border-border bg-muted/20 py-24 md:py-32">
      <div className="container-narrow grid gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">İletişim</p>
          <h2 className="mb-8 text-4xl md:text-5xl">Bizi ziyaret edin.</h2>

          <div className="space-y-6">
            <ContactRow icon={<MapPin className="h-5 w-5" />} label="Adres">
              <a
                href="https://maps.google.com/?q=Nursoy+Barber+Beylikduzu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Barış, Samsun Cd. 23/A, 34520 Beylikdüzü / İstanbul
              </a>
            </ContactRow>

            <ContactRow icon={<Phone className="h-5 w-5" />} label="Telefon">
              <div className="flex flex-col gap-1">
                {Object.values(BARBERS).map((b) => (
                  <a
                    key={b.slug}
                    href={`tel:${b.phone}`}
                    className="hover:underline"
                  >
                    {b.name} — {b.phoneDisplay}
                  </a>
                ))}
              </div>
            </ContactRow>

            <ContactRow icon={<MessageCircle className="h-5 w-5" />} label="WhatsApp">
              <div className="flex flex-wrap gap-2">
                {Object.values(BARBERS).map((b) => (
                  <a
                    key={b.slug}
                    href={`https://wa.me/${b.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="rounded-none">
                      {b.name.split(" ")[0]}
                    </Button>
                  </a>
                ))}
              </div>
            </ContactRow>

            <ContactRow icon={<Clock className="h-5 w-5" />} label="Çalışma Saatleri">
              <ul className="space-y-1 text-sm">
                {HOURS_ROWS.map((r) => (
                  <li key={r.day} className="flex justify-between gap-8">
                    <span>{r.day}</span>
                    <span className={r.val === "Kapalı" ? "text-muted-foreground" : ""}>
                      {r.val}
                    </span>
                  </li>
                ))}
              </ul>
            </ContactRow>
          </div>
        </div>

        <div className="aspect-square overflow-hidden rounded-md border border-border md:aspect-auto">
          <iframe
            title="Nursoy Barber konum"
            src="https://www.google.com/maps?q=Baris,+Samsun+Cd.+23%2FA,+34520+Beylikduzu%2FIstanbul&output=embed"
            className="h-full min-h-[400px] w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 shrink-0 text-muted-foreground">{icon}</div>
      <div>
        <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="text-sm md:text-base">{children}</div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-narrow grid gap-8 md:grid-cols-3 md:items-center">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          <span className="font-display text-lg">Nursoy Barber</span>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nursoy Barber. Tüm hakları saklıdır.
        </p>
        <div className="flex justify-start gap-4 md:justify-end">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
