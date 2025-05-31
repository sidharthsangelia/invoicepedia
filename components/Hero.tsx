import { Button } from "./ui/button";
import { Cover } from "./ui/cover";
import { ShinyButton } from "./magicui/shiny-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative mx-auto  flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-8 md:py-10">
        <span className="mx-auto flex justify-center mb-6">
          <ShinyButton>✨ Powered By AI</ShinyButton>
        </span>
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          Build Your Inovices At A <Cover>Blazing Fast Speed</Cover>
        </h1>
        <p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400">
          With AI, send invoices in minutes, not hours. Our smart tools simplify
          billing so you can focus on what matters—getting paid.
        </p>
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="">
            <Link className="flex flex-row " href="/dashboard">
              Explore Now
              <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant={"outline"} className="">
            Contact Support
          </Button>
        </div>
        <div className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <Image
              src="https://assets.aceternity.com/pro/aceternity-landing.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
