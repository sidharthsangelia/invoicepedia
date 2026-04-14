import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Base
        "relative overflow-hidden rounded-md",

        // Color (FIX: proper contrast in both themes)
        "bg-muted dark:bg-muted/60",

        // Subtle pulse (keep it but softer)
        "animate-pulse",

        className
      )}
      {...props}
    >
      {/* Shimmer layer */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "translate-x-[-100%]",
          "bg-gradient-to-r",
          // shimmer gradient tuned for both themes
          "from-transparent via-white/60 dark:via-white/10 to-transparent",
          "animate-[shimmer_1.6s_infinite]"
        )}
      />
    </div>
  );
}

export { Skeleton };