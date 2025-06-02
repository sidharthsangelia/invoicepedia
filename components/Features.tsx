"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function Features() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="One-Click Setup"
        description="Connect your tools in under a minute.."
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
        title=" One-Click Reminders"
        description="Yes, it's true. I'm not even kidding. Ask my mom if you don't believe me."
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Secure & Synced"
        description="It's the best money you'll ever spend"
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Auto-Fill Details"
        description="Let AI handle client and item info."
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Real-Time Insights"
        description="Track payments and trends instantly."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
  <li className={`min-h-[14rem] list-none ${area} group`}>
  <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
    <GlowingEffect
      spread={40}
      glow={true}
      disabled={false}
      proximity={64}
      inactiveZone={0.01}
    />
    <div className="border-0.75 relative rounded-2xl bg-gradient-to-br from-[#0f0f11] via-[#1a1a1d] to-[#0f0f11] border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all hover:shadow-[0_12px_45px_rgba(93,88,255,0.25)] overflow-hidden flex h-full flex-col justify-between gap-6 rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
      <div className="relative flex flex-1 flex-col justify-between gap-3">
        <div className="w-fit rounded-lg border border-gray-600 p-2">
          {icon}
        </div>
        <div className="space-y-3 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:[text-shadow:0_0_6px_rgba(245,153,27,0.25)]">
          <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white transition-all duration-300 ease-out">
            {title}
          </h3>
          <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold transition-all duration-300 ease-out">
            {description}
          </h2>
        </div>
      </div>
    </div>
  </div>
</li>

  );
};
