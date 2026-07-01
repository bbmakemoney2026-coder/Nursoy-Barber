import { supabase } from "@/integrations/supabase/client";

export type BarberSlug = "nurullah" | "ismail";

export const BARBERS: Record<
  BarberSlug,
  { slug: BarberSlug; name: string; phone: string; phoneDisplay: string; whatsapp: string }
> = {
  nurullah: {
    slug: "nurullah",
    name: "Nurullah Aksoy",
    phone: "+905364946147",
    phoneDisplay: "+90 536 494 61 47",
    whatsapp: "905364946147",
  },
  ismail: {
    slug: "ismail",
    name: "İsmail Aksoy",
    phone: "+905546516147",
    phoneDisplay: "+90 554 651 61 47",
    whatsapp: "905546516147",
  },
};

export const SERVICES = [
  { name: "Saç Tıraşı", price: "350₺", duration: 30 },
  { name: "Sakal Tıraşı", price: "200₺", duration: 20 },
  { name: "Saç + Sakal", price: "500₺", duration: 45 },
  { name: "Ustura Tıraşı", price: "250₺", duration: 25 },
  { name: "Çocuk Tıraşı", price: "250₺", duration: 25 },
  { name: "Cilt Bakımı", price: "400₺", duration: 30 },
  { name: "Kaş Alımı", price: "100₺", duration: 10 },
  { name: "Saç Yıkama & Fön", price: "150₺", duration: 20 },
] as const;

// Opening hours by JS day (0 = Sunday). null = closed.
// Sunday closed; Sat 09-23; others 09-21.
export const HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 9, close: 21 },
  2: { open: 9, close: 21 },
  3: { open: 9, close: 21 },
  4: { open: 9, close: 21 },
  5: { open: 9, close: 21 },
  6: { open: 9, close: 23 },
};

export function generateSlots(date: Date): { hour: number; minute: number }[] {
  const day = date.getDay();
  const hours = HOURS[day];
  if (!hours) return [];
  const slots: { hour: number; minute: number }[] = [];
  for (let h = hours.open; h < hours.close; h++) {
    slots.push({ hour: h, minute: 0 });
    slots.push({ hour: h, minute: 30 });
  }
  return slots;
}

export async function fetchTakenSlots(barber: BarberSlug, date: Date): Promise<Set<string>> {
  const from = new Date(date);
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 1);

  const { data, error } = await supabase
    .from("bookings")
    .select("appointment_at")
    .eq("barber_slug", barber)
    .gte("appointment_at", from.toISOString())
    .lt("appointment_at", to.toISOString());

  if (error) throw error;
  return new Set((data ?? []).map((r) => new Date(r.appointment_at).toISOString()));
}

export function buildWhatsAppUrl(params: {
  barber: BarberSlug;
  customerName: string;
  phone: string;
  service: string;
  appointmentAt: Date;
  note?: string;
}) {
  const b = BARBERS[params.barber];
  const date = params.appointmentAt.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = params.appointmentAt.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const lines = [
    "Merhaba, yeni bir randevu talebim var.",
    "",
    `Ad Soyad: ${params.customerName}`,
    `Telefon: ${params.phone}`,
    `Berber: ${b.name}`,
    `Hizmet: ${params.service}`,
    `Tarih: ${date}`,
    `Saat: ${time}`,
  ];
  if (params.note?.trim()) {
    lines.push(`Not: ${params.note.trim()}`);
  }
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${b.whatsapp}?text=${text}`;
}