import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Faq() {
  return (
    <section className="w-full max-w-3xl mx-auto py-16 px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-300">
        Frequently Asked Questions
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="item-1"
      >
        <AccordionItem
          value="item-1"
          className="border border-border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <AccordionTrigger className="cursor-pointer px-4 py-3 text-lg font-medium transition-all hover:text-primary">
            Product Information
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0 text-muted-foreground leading-relaxed space-y-4">
            <p>
              Our flagship product combines cutting-edge technology with sleek
              design. Built with premium materials, it offers unparalleled
              performance and reliability.
            </p>
            <p>
              Key features include advanced processing capabilities and an
              intuitive user interface designed for both beginners and experts.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="border border-border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <AccordionTrigger className="cursor-pointer px-4 py-3 text-lg font-medium transition-all hover:text-primary">
            Shipping Details
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0 text-muted-foreground leading-relaxed space-y-4">
            <p>
              We offer worldwide shipping through trusted courier partners.
              Standard delivery takes 3–5 business days, while express shipping
              ensures delivery within 1–2 business days.
            </p>
            <p>
              All orders are carefully packaged and fully insured. Track your
              shipment in real-time through our dedicated tracking portal.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="border border-border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <AccordionTrigger className="cursor-pointer px-4 py-3 text-lg font-medium transition-all hover:text-primary">
            Return Policy
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0 text-muted-foreground leading-relaxed space-y-4">
            <p>
              We stand behind our products with a comprehensive 30-day return
              policy. If you're not completely satisfied, simply return the item
              in its original condition.
            </p>
            <p>
              Our hassle-free return process includes free return shipping and
              full refunds processed within 48 hours of receiving the returned
              item.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
