"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, Trash2, FileText, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createInvoiceAction } from "@/actions/createInvoice";
import { updateInvoiceAction } from "@/actions/updateInvoice";

// -----------------------------------------------------------------------
// Zod Schema
// -----------------------------------------------------------------------

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z
    .number({ message: "Enter a valid quantity" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  unitAmount: z
    .number({ message: "Enter a valid amount" })
    .positive("Amount must be greater than 0"),
});

const invoiceFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  invoiceNumber: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

const CURRENCIES = [
  { label: "USD – US Dollar", value: "USD" },
  { label: "EUR – Euro", value: "EUR" },
  { label: "GBP – British Pound", value: "GBP" },
  { label: "INR – Indian Rupee", value: "INR" },
  { label: "CAD – Canadian Dollar", value: "CAD" },
  { label: "AUD – Australian Dollar", value: "AUD" },
];

const DEFAULT_LINE_ITEM = { description: "", quantity: 1, unitAmount: 0 };

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

function currencySymbol(currency: string) {
  return CURRENCY_SYMBOLS[currency] ?? "$";
}

function formatCurrency(amount: number, currency: string) {
  if (!amount || isNaN(amount)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// -----------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------

function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}

// -----------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------

interface InvoiceFormProps {
  mode?: "create" | "edit";
  invoiceId?: string; // required when mode === "edit"
  defaultValues?: Partial<InvoiceFormValues>;
}

// -----------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------

export function InvoiceForm({
  mode = "create",
  invoiceId,
  defaultValues,
}: InvoiceFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const isEdit = mode === "edit";

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      invoiceNumber: "",
      currency: "USD",
      dueDate: "",
      notes: "",
      lineItems: [{ ...DEFAULT_LINE_ITEM }],
      ...defaultValues,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "lineItems" });

  const watchedLineItems = watch("lineItems");
  const watchedCurrency = watch("currency");

  const subtotal = watchedLineItems.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unitAmount) || 0);
  }, 0);

  async function onSubmit(values: InvoiceFormValues) {
    setServerError(null);

    const formData = new FormData();

    if (isEdit && invoiceId) {
      formData.set("invoiceId", invoiceId);
    }

    formData.set("customerName", values.customerName);
    formData.set("customerEmail", values.customerEmail);
    if (values.customerPhone) formData.set("customerPhone", values.customerPhone);
    if (values.customerAddress) formData.set("customerAddress", values.customerAddress);
    if (values.invoiceNumber) formData.set("invoiceNumber", values.invoiceNumber);
    formData.set("currency", values.currency);
    if (values.dueDate) formData.set("dueDate", values.dueDate);
    if (values.notes) formData.set("notes", values.notes);

    values.lineItems.forEach((item, i) => {
      formData.set(`lineItems[${i}][description]`, item.description);
      formData.set(`lineItems[${i}][quantity]`, String(item.quantity));
      formData.set(`lineItems[${i}][unitAmount]`, String(item.unitAmount));
    });

    const action = isEdit ? updateInvoiceAction : createInvoiceAction;
    const result = await action(formData);

    // redirect() inside the action throws NEXT_REDIRECT — only land here on error
    if (result && !result.success) {
      if (result.error === "UNAUTHENTICATED") {
        window.location.href = "/sign-in";
        return;
      }
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Server error banner */}
      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* ── Customer Details ── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Customer Details</CardTitle>
          <CardDescription>Who is this invoice for?</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="customerName"
            control={control}
            render={({ field }) => (
              <FormField label="Full Name" htmlFor="customerName" required error={errors.customerName?.message}>
                <Input {...field} id="customerName" placeholder="Acme Corp"
                  aria-invalid={!!errors.customerName}
                  className={errors.customerName ? "border-destructive focus-visible:ring-destructive/30" : ""}
                />
              </FormField>
            )}
          />
          <Controller
            name="customerEmail"
            control={control}
            render={({ field }) => (
              <FormField label="Email Address" htmlFor="customerEmail" required error={errors.customerEmail?.message}>
                <Input {...field} id="customerEmail" type="email" placeholder="billing@acmecorp.com"
                  aria-invalid={!!errors.customerEmail}
                  className={errors.customerEmail ? "border-destructive focus-visible:ring-destructive/30" : ""}
                />
              </FormField>
            )}
          />
          <Controller
            name="customerPhone"
            control={control}
            render={({ field }) => (
              <FormField label="Phone" htmlFor="customerPhone" error={errors.customerPhone?.message}>
                <Input {...field} id="customerPhone" type="tel" placeholder="+1 (555) 000-0000" />
              </FormField>
            )}
          />
          <Controller
            name="customerAddress"
            control={control}
            render={({ field }) => (
              <FormField label="Billing Address" htmlFor="customerAddress" error={errors.customerAddress?.message}>
                <Input {...field} id="customerAddress" placeholder="123 Main St, New York, NY 10001" />
              </FormField>
            )}
          />
        </CardContent>
      </Card>

      {/* ── Invoice Details ── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Invoice Details</CardTitle>
          <CardDescription>Invoice meta information and settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Controller
            name="invoiceNumber"
            control={control}
            render={({ field }) => (
              <FormField label="Invoice Number" htmlFor="invoiceNumber"
                hint="Auto-generated if left blank" error={errors.invoiceNumber?.message}>
                <Input {...field} id="invoiceNumber" placeholder="INV-001" />
              </FormField>
            )}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <FormField label="Currency" htmlFor="currency" required error={errors.currency?.message}>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <FormField label="Due Date" htmlFor="dueDate" error={errors.dueDate?.message}>
                <Input {...field} id="dueDate" type="date"
                  min={new Date().toISOString().split("T")[0]} />
              </FormField>
            )}
          />
        </CardContent>
      </Card>

      {/* ── Line Items ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Line Items</CardTitle>
              <CardDescription className="mt-0.5">Services or products being billed.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm"
              onClick={() => append({ ...DEFAULT_LINE_ITEM })} className="gap-1.5 shrink-0">
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {errors.lineItems?.root?.message && (
            <p className="text-xs text-destructive font-medium">{errors.lineItems.root.message}</p>
          )}

          <div className="hidden sm:grid sm:grid-cols-[1fr_100px_120px_40px] gap-3 px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Qty</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit Price</span>
            <span />
          </div>

          <div className="space-y-2">
            {fields.map((field, index) => {
              const qty = Number(watchedLineItems[index]?.quantity) || 0;
              const unit = Number(watchedLineItems[index]?.unitAmount) || 0;
              const lineTotal = qty * unit;

              return (
                <div key={field.id}
                  className="rounded-lg border border-border bg-muted/30 p-3 sm:p-0 sm:bg-transparent sm:border-0 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-[1fr_100px_120px_40px] sm:gap-3 sm:items-start"
                >
                  <Controller
                    name={`lineItems.${index}.description`}
                    control={control}
                    render={({ field: f }) => (
                      <div className="space-y-1">
                        <Label className="sm:hidden text-xs text-muted-foreground">Description</Label>
                        <Input {...f} placeholder="Website design & development"
                          aria-invalid={!!errors.lineItems?.[index]?.description}
                          className={errors.lineItems?.[index]?.description ? "border-destructive focus-visible:ring-destructive/30" : ""}
                        />
                        {errors.lineItems?.[index]?.description && (
                          <p className="text-xs text-destructive">{errors.lineItems[index].description.message}</p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name={`lineItems.${index}.quantity`}
                    control={control}
                    render={({ field: f }) => (
                      <div className="space-y-1">
                        <Label className="sm:hidden text-xs text-muted-foreground">Qty</Label>
                        <Input {...f} type="number" min={1} placeholder="1"
                          onChange={(e) => f.onChange(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                          aria-invalid={!!errors.lineItems?.[index]?.quantity}
                          className={errors.lineItems?.[index]?.quantity ? "border-destructive focus-visible:ring-destructive/30" : ""}
                        />
                        {errors.lineItems?.[index]?.quantity && (
                          <p className="text-xs text-destructive">{errors.lineItems[index].quantity.message}</p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name={`lineItems.${index}.unitAmount`}
                    control={control}
                    render={({ field: f }) => (
                      <div className="space-y-1">
                        <Label className="sm:hidden text-xs text-muted-foreground">Unit Price</Label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            {currencySymbol(watchedCurrency)}
                          </span>
                          <Input {...f} type="number" min={0} step={0.01} placeholder="0.00"
                            className={["pl-7", errors.lineItems?.[index]?.unitAmount ? "border-destructive focus-visible:ring-destructive/30" : ""].join(" ")}
                            onChange={(e) => f.onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
                            aria-invalid={!!errors.lineItems?.[index]?.unitAmount}
                          />
                        </div>
                        {errors.lineItems?.[index]?.unitAmount && (
                          <p className="text-xs text-destructive">{errors.lineItems[index].unitAmount.message}</p>
                        )}
                      </div>
                    )}
                  />
                  <div className="flex sm:block items-center justify-between">
                    <span className="text-xs text-muted-foreground sm:hidden">
                      Line total: <span className="font-medium text-foreground">{formatCurrency(lineTotal, watchedCurrency)}</span>
                    </span>
                    <Button type="button" variant="ghost" size="icon"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length === 1}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      aria-label="Remove line item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-2" />
          <div className="flex justify-end">
            <div className="space-y-1.5 text-sm min-w-[200px]">
              <div className="flex justify-between gap-8 text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatCurrency(subtotal, watchedCurrency)}
                </span>
              </div>
              <div className="flex justify-between gap-8 font-semibold text-base border-t border-border pt-1.5 mt-1.5">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(subtotal, watchedCurrency)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Notes ── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Notes</CardTitle>
          <CardDescription>Optional notes visible to your customer on the invoice.</CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <FormField label="Internal / Customer Notes" htmlFor="notes"
                error={errors.notes?.message}
                hint="Payment terms, thank-you message, bank details, etc.">
                <Textarea {...field} id="notes" rows={4}
                  placeholder="Payment due within 30 days. Thank you for your business!"
                  className="resize-none"
                />
              </FormField>
            )}
          />
        </CardContent>
      </Card>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pb-8">
        {!isEdit && (
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
            Reset
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px] gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : (
            <>
              {isEdit ? <Pencil className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              {isEdit ? "Save Changes" : "Create Invoice"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}