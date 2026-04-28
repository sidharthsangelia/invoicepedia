 
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { InvoiceForPDF, UserCompany } from "@/types/invoice";
// ── Identity: "Freelancer" ───────────────────────────────────────────────────
// Target: Solo developers, technical contractors, independent consultants who
// want something professional without being corporate. Inspired by technical
// documentation — structured, dense, functional.
//
// Layout signature:
//   • Full-bleed deep navy header band with company + invoice number reversed out
//   • Three-column meta strip (client | dates | status) on a pale tint
//   • Clean ruled table, spacing does the work — no zebra fills
//   • Subtotal row + filled navy total chip, right-aligned
//   • Notes in a ruled inset box
//   • Absolute footer: thank you · ref · client name

const C = {
  bg: "#FDFCFA",
  ink: "#18181B",
  muted: "#71717A",
  faint: "#E4E4E7",
  rule: "#D4D4D8",
  headerBg: "#1E3A5F",
  headerText: "#FFFFFF",
  headerMuted: "#93B4D4",
  accent: "#1E3A5F",
  accentLight: "#EEF3F9",
};

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function fmtDate(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const S = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    fontSize: 9.5,
    backgroundColor: C.bg,
    color: C.ink,
  },

  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: 44,
    paddingTop: 36,
    paddingBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  companyName: {
    fontFamily: "Courier-Bold",
    fontSize: 16,
    color: C.headerText,
    letterSpacing: 1,
    marginBottom: 4,
  },

  companyDetail: {
    fontSize: 8.5,
    color: C.headerMuted,
    marginBottom: 2,
  },

  invoiceWord: {
    fontSize: 8,
    letterSpacing: 4,
    color: C.headerMuted,
    marginBottom: 6,
    textAlign: "right",
  },

  invoiceNumber: {
    fontFamily: "Courier-Bold",
    fontSize: 20,
    color: C.headerText,
    letterSpacing: 0.5,
    textAlign: "right",
  },

  metaStrip: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 44,
    paddingVertical: 16,
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: C.faint,
  },

  metaCol: { flex: 1 },

  metaColRight: { flex: 1, alignItems: "flex-end" },

  metaDivider: {
    width: 1,
    backgroundColor: C.rule,
    marginHorizontal: 20,
    marginVertical: 2,
  },

  metaLabel: {
    fontSize: 6.5,
    letterSpacing: 2,
    color: C.muted,
    marginBottom: 5,
  },

  metaValue: {
    fontFamily: "Courier-Bold",
    fontSize: 9.5,
    color: C.ink,
  },

  metaSub: {
    fontSize: 8.5,
    color: C.muted,
    marginTop: 2,
  },

  body: {
    paddingHorizontal: 44,
    paddingTop: 28,
    paddingBottom: 80,
  },

  tableHead: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: C.ink,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 11,
    borderBottomWidth: 0.75,
    borderBottomColor: C.rule,
  },

  colDesc: { flex: 3 },
  colQty: { flex: 0.6, textAlign: "center" },
  colRate: { flex: 1.3, textAlign: "right" },
  colAmt: { flex: 1.3, textAlign: "right" },

  thText: {
    fontFamily: "Courier-Bold",
    fontSize: 7,
    letterSpacing: 1.5,
    color: C.muted,
  },

  tdDesc: { fontSize: 9.5, color: C.ink },
  tdMuted: { fontSize: 9.5, color: C.muted },
  tdBold: { fontFamily: "Courier-Bold", fontSize: 9.5, color: C.ink },

  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },

  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 210,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: C.rule,
  },

  subLabel: { fontSize: 8.5, color: C.muted },
  subValue: { fontSize: 8.5, color: C.muted },

  totalBox: {
    backgroundColor: C.accent,
    width: 210,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  totalBoxLabel: {
    fontFamily: "Courier-Bold",
    fontSize: 8,
    letterSpacing: 2,
    color: C.headerMuted,
  },

  totalBoxValue: {
    fontFamily: "Courier-Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  notesSection: {
    marginTop: 32,
    borderWidth: 0.75,
    borderColor: C.rule,
    padding: 14,
  },

  notesLabel: {
    fontFamily: "Courier-Bold",
    fontSize: 6.5,
    letterSpacing: 2,
    color: C.muted,
    marginBottom: 7,
  },

  notesText: {
    fontSize: 9,
    color: C.muted,
    lineHeight: 1.6,
  },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: C.rule,
    paddingTop: 8,
  },

  footerText: { fontSize: 7.5, color: C.muted, letterSpacing: 0.3 },
  footerRight: { fontSize: 7.5, color: C.muted },
});

export function MinimalMonoInvoice({ invoice, user }: { invoice: InvoiceForPDF;
  user: UserCompany;}) {
  const subtotal = invoice.lineItems.reduce(
    (s: number, i: any) => s + i.quantity * i.unitAmount,
    0
  );
  const invoiceLabel =
    invoice.invoiceNumber || `#${invoice.id?.slice(-8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={S.page}>
        <View style={S.header}>
          <View>
            <Text style={S.companyName}>{user.companyName}</Text>
            <Text style={S.companyDetail}>{user.companyEmail}</Text>
            <Text style={S.companyDetail}>{user.companyWebsite}</Text>
          </View>
          <View>
            <Text style={S.invoiceWord}>INVOICE</Text>
            <Text style={S.invoiceNumber}>{invoiceLabel}</Text>
          </View>
        </View>

        <View style={S.metaStrip}>
          <View style={S.metaCol}>
            <Text style={S.metaLabel}>BILLED TO</Text>
            <Text style={S.metaValue}>{invoice.customer.name}</Text>
            <Text style={S.metaSub}>{invoice.customer.email}</Text>
            {invoice.customer.phone && (
              <Text style={S.metaSub}>{invoice.customer.phone}</Text>
            )}
            {invoice.customer.address && (
              <Text style={S.metaSub}>{invoice.customer.address}</Text>
            )}
          </View>
          <View style={S.metaDivider} />
          <View style={S.metaCol}>
            <Text style={S.metaLabel}>ISSUE DATE</Text>
            <Text style={S.metaValue}>{fmtDate(invoice.createdAt)}</Text>
            <View style={{ marginTop: 10 }}>
              <Text style={S.metaLabel}>DUE DATE</Text>
              <Text style={S.metaValue}>{fmtDate(invoice.dueDate)}</Text>
            </View>
          </View>
          <View style={S.metaDivider} />
          <View style={S.metaColRight}>
            <Text style={S.metaLabel}>CURRENCY</Text>
            <Text style={S.metaValue}>{invoice.currency}</Text>
            <View style={{ marginTop: 10 }}>
              <Text style={S.metaLabel}>STATUS</Text>
              <Text style={S.metaValue}>
                {invoice.status?.toUpperCase() ?? "UNPAID"}
              </Text>
            </View>
          </View>
        </View>

        <View style={S.body}>
          <View style={S.tableHead}>
            <Text style={[S.thText, S.colDesc]}>DESCRIPTION</Text>
            <Text style={[S.thText, S.colQty]}>QTY</Text>
            <Text style={[S.thText, S.colRate]}>RATE</Text>
            <Text style={[S.thText, S.colAmt]}>AMOUNT</Text>
          </View>

          {invoice.lineItems.map((item: any, i: number) => (
            <View key={i} style={S.tableRow}>
              <Text style={[S.tdDesc, S.colDesc]}>{item.description}</Text>
              <Text style={[S.tdMuted, S.colQty]}>{item.quantity}</Text>
              <Text style={[S.tdMuted, S.colRate]}>
                {fmt(item.unitAmount, invoice.currency)}
              </Text>
              <Text style={[S.tdBold, S.colAmt]}>
                {fmt(item.quantity * item.unitAmount, invoice.currency)}
              </Text>
            </View>
          ))}

          <View style={S.totalsSection}>
            <View style={S.subRow}>
              <Text style={S.subLabel}>Subtotal</Text>
              <Text style={S.subValue}>{fmt(subtotal, invoice.currency)}</Text>
            </View>
            <View style={S.totalBox}>
              <Text style={S.totalBoxLabel}>TOTAL DUE</Text>
              <Text style={S.totalBoxValue}>{fmt(subtotal, invoice.currency)}</Text>
            </View>
          </View>

          {invoice.notes && (
            <View style={S.notesSection}>
              <Text style={S.notesLabel}>NOTES</Text>
              <Text style={S.notesText}>{invoice.notes}</Text>
            </View>
          )}
        </View>

        <View style={S.footer} fixed>
          <Text style={S.footerText}>Thank you for your business.</Text>
          <Text style={S.footerRight}>
            {invoiceLabel} · {invoice.customer.name}
          </Text>
        </View>
      </Page>
    </Document>
  );
}