import BuiltForEveryone from "@/components/BuiltForEveryone";
import Hero from "@/components/Hero";
import { DotPattern } from "@/components/magicui/dot-pattern";
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

        <div className="mt-20 mx-auto flex justify-center">
          <BuiltForEveryone />
        </div>
      </div>
    </>
  );
}
