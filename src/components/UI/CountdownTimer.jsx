export default function CountdownTimer({ timeLeft }) {
  if (!timeLeft) return null;

  const items = [
    { label: "Dana", value: timeLeft.days },
    { label: "Sati", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sek", value: timeLeft.seconds },
  ];

  return (
    <div
      className="flex items-center gap-1 sm:gap-2"
      aria-label="Countdown timer"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-[48px] rounded-lg border border-[#d8c4ea] bg-white/80 px-2 py-1 text-center shadow-sm"
        >
          <div className="text-sm sm:text-base font-bold text-[#6f4d8b] leading-none">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-[#8e6aad]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
