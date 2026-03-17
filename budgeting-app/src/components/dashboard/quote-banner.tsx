"use client";

import { getDailyQuote } from "@/lib/quotes";
import { Sparkles } from "lucide-react";

export function QuoteBanner() {
  const quote = getDailyQuote();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00D632]/10 via-[#7B61FF]/10 to-[#FF6B9D]/10 border border-white/[0.06] p-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D632]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7B61FF]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="relative flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D632] to-[#A8FF00] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-black" />
        </div>
        <div>
          <p className="text-lg font-medium leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-sm text-muted-foreground mt-1">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
