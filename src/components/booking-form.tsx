import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  BARBERS,
  SERVICES,
  type BarberSlug,
  buildWhatsAppUrl,
  fetchTakenSlots,
  generateSlots,
  HOURS,
} from "@/lib/booking";

const bookingSchema = z.object({
  barber: z.enum(["nurullah", "ismail"]),
  service: z.string().min(2).max(80),
  customerName: z
    .string()
    .trim()
    .min(2, "Ad Soyad en az 2 karakter olmalı")
    .max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Geçerli bir telefon girin")
    .max(30)
    .regex(/^[\d+\s()-]+$/, "Telefon yalnızca rakam ve boşluk içerebilir"),
  note: z.string().trim().max(500).optional(),
});

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function buildDate(year: number, month: number, day: number, hour: number, minute: number) {
  return new Date(year, month, day, hour, minute, 0, 0);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function BookingForm() {
  const now = new Date();

  const [barber, setBarber] = useState<BarberSlug>("nurullah");
  const [service, setService] = useState<string>(SERVICES[0].name);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth());
  const [day, setDay] = useState<number>(now.getDate());
  const [time, setTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const years = [now.getFullYear(), now.getFullYear() + 1];
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = useMemo(
    () => Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1),
    [year, month],
  );

  const selectedDate = useMemo(
    () => buildDate(year, month, day, 0, 0),
    [year, month, day],
  );
  const dayOfWeek = selectedDate.getDay();
  const isClosed = HOURS[dayOfWeek] === null;

  const allSlots = useMemo(() => generateSlots(selectedDate), [selectedDate]);

  useEffect(() => {
    if (isClosed) {
      setTaken(new Set());
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    fetchTakenSlots(barber, selectedDate)
      .then((set) => {
        if (!cancelled) setTaken(set);
      })
      .catch(() => {
        if (!cancelled) setTaken(new Set());
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [barber, selectedDate, isClosed]);

  useEffect(() => {
    setTime("");
  }, [barber, year, month, day]);

  // Clamp day when month/year changes
  useEffect(() => {
    const max = daysInMonth(year, month);
    if (day > max) setDay(max);
  }, [year, month, day]);

  const isPastSlot = (h: number, m: number) => {
    const slotDate = buildDate(year, month, day, h, m);
    return slotDate.getTime() <= Date.now();
  };

  const isTaken = (h: number, m: number) => {
    const iso = buildDate(year, month, day, h, m).toISOString();
    return taken.has(iso);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) {
      toast.error("Lütfen bir saat seçin");
      return;
    }
    const [hStr, mStr] = time.split(":");
    const appointmentAt = buildDate(year, month, day, Number(hStr), Number(mStr));

    const parsed = bookingSchema.safeParse({
      barber,
      service,
      customerName,
      phone,
      note: note || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formu kontrol edin");
      return;
    }
    if (appointmentAt.getTime() <= Date.now()) {
      toast.error("Geçmiş bir saat seçilemez");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      barber_slug: barber,
      service,
      appointment_at: appointmentAt.toISOString(),
      customer_name: parsed.data.customerName,
      phone: parsed.data.phone,
      note: parsed.data.note ?? null,
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("Bu saat az önce dolduruldu. Lütfen başka bir saat seçin.");
        // refresh taken slots
        fetchTakenSlots(barber, selectedDate).then(setTaken).catch(() => {});
      } else {
        toast.error("Randevu oluşturulamadı. Lütfen tekrar deneyin.");
      }
      return;
    }

    const url = buildWhatsAppUrl({
      barber,
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      service,
      appointmentAt,
      note: parsed.data.note,
    });
    toast.success("Randevu oluşturuldu! WhatsApp açılıyor...");
    window.open(url, "_blank", "noopener,noreferrer");

    // Reset time and refresh
    setTime("");
    fetchTakenSlots(barber, selectedDate).then(setTaken).catch(() => {});
  }

  const monthLabels = [
    "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
    "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-border bg-card p-6 md:p-8 shadow-[var(--shadow-elegant)]"
    >
      <div className="grid gap-6">
        {/* Barber */}
        <div className="grid gap-2">
          <Label>Berber</Label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.values(BARBERS)).map((b) => (
              <button
                type="button"
                key={b.slug}
                onClick={() => setBarber(b.slug)}
                className={cn(
                  "rounded-md border px-4 py-3 text-left transition-all",
                  barber === b.slug
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/50",
                )}
              >
                <div className="text-sm font-medium">{b.name}</div>
                <div className="text-xs opacity-70">{b.phoneDisplay}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Service */}
        <div className="grid gap-2">
          <Label>Hizmet</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.name} — {s.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date pickers */}
        <div className="grid gap-2">
          <Label>Tarih</Label>
          <div className="grid grid-cols-3 gap-2">
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={String(m)}>{monthLabels[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d} value={String(d)}>{pad(d)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time slots */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>Saat</Label>
            {loadingSlots && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Yükleniyor
              </span>
            )}
          </div>
          {isClosed ? (
            <p className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Bu gün kapalıyız. Lütfen başka bir gün seçin.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {allSlots.map(({ hour, minute }) => {
                const value = `${pad(hour)}:${pad(minute)}`;
                const past = isPastSlot(hour, minute);
                const busy = isTaken(hour, minute);
                const disabled = past || busy;
                const selected = time === value;
                return (
                  <button
                    type="button"
                    key={value}
                    disabled={disabled}
                    onClick={() => setTime(value)}
                    className={cn(
                      "rounded-md border px-2 py-2 text-sm transition-all",
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/60",
                      disabled &&
                        "cursor-not-allowed line-through opacity-30 hover:border-border",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              required
              maxLength={100}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              required
              maxLength={30}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+90 5XX XXX XX XX"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="note">Not (opsiyonel)</Label>
          <Textarea
            id="note"
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Berbere iletmek istediğiniz bir not..."
            rows={3}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 text-base font-medium"
          size="lg"
        >
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gönderiliyor...</>
          ) : (
            <><Check className="mr-2 h-4 w-4" /> Randevuyu Onayla ve WhatsApp'a Gönder</>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Onayladıktan sonra WhatsApp otomatik olarak açılır — mesajınız hazır olacak, sadece "Gönder" tuşuna basın.
        </p>
      </div>
    </form>
  );
}