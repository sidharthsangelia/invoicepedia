import Link from 'next/link'
import React from 'react'

function FinalCta() {
  return (
    <section className="w-full bg-gradient-to-br from-muted via-background to-muted py-16 px-6 text-center rounded-xl shadow-inner dark:shadow-md">
  <div className="max-w-3xl mx-auto space-y-6">
    <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
      Tired of chasing invoices like it's 1999?
    </h2>
    <p className="text-muted-foreground text-lg md:text-xl">
      Let Invoicedpedia do the heavy lifting. Smart, sleek, and powered by AI — so you can bill faster, stress less, and actually enjoy getting paid.
    </p>
    <div className="flex justify-center gap-4 flex-wrap">
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:scale-[1.02] hover:shadow-md"
      >
        Try It Now — It's Invoice Magic ✨
      </Link>
    
    </div>
  </div>
</section>

  )
}

export default FinalCta