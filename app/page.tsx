import BuiltForEveryone from "@/components/BuiltForEveryone";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import FinalCta from "@/components/FinallCta";

import Hero from "@/components/Hero";
import { DotPattern } from "@/components/magicui/dot-pattern";
import Pricing from "@/components/Pricing";
import TrustedPartners from "@/components/TrustedPartners";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <div className="">
        <Hero />
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
        <TrustedPartners />

        <div className=" mx-auto flex  justify-center">
          <BuiltForEveryone />
        </div>
        <div className=" flex min-h-screen justify-center mx-auto max-w-5xl">
          <Features />
        </div>
        <div className=" flex min-h-screen justify-center mx-auto max-w-5xl">
         <Pricing/>
        </div>
        <div className=" flex min-h-screen justify-center mx-auto max-w-5xl">
         <Faq/>
        </div>
        <div className=" flex justify-center mx-auto max-w-5xl">
        <FinalCta/>
        </div>
      </div>
    </>
  );
}
