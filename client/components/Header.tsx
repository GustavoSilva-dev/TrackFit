"use client";

import { useEffect, useState } from "react";

function Header() {
  const [today, setToday] = useState<Date | null>(null);
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  useEffect(() => {
    setToday(new Date());
  }, []);

  return (
    <header className="w-full border-b border-slate-700 bg-[#20242d] text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <span className="text-xl font-bold tracking-tight sm:text-2xl">
          Track
          <span className="text-yellow-300">Fit</span>
        </span>

        <div className="flex items-center gap-4 sm:gap-6">
          <time
            dateTime={today?.toISOString().slice(0, 10)}
            className="text-sm font-medium text-slate-200 sm:text-base"
          >
            {today ? dateFormatter.format(today) : ""}
          </time>
          <div
            role="img"
            aria-label="Avatar do usuário"
            className="size-9 rounded-full border-2 border-yellow-500 bg-yellow-300"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;