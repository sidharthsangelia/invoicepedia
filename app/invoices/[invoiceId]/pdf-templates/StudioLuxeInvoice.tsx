import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { InvoiceForPDF, UserCompany } from "@/types/invoice";

// ── Identity: "Consultant" ───────────────────────────────────────────────────
// Target: Independent consultants, coaches, lawyers, therapists, and other
// high-trust service providers. The invoice should feel like correspondence
// from someone authoritative — not a startup, not a corporation.
//
// Layout signature:
//   • Top rule in warm amber-brown, then company name flush left, invoice flush right
//   • FROM / TO side-by-side separated by a thin rule — bilateral, formal
//   • Three date/meta chips in a row on warm stone tint
//   • Table with generous vertical padding, no background fills
//   • Total block with amber-brown left border accent, right-aligned
//   • Notes section with understated label
//   • Footer: page number · ref centred

const C = {
  bg: "#FAFAF8",
  white: "#FFFFFF",
  ink: "#1C1A17",
  muted: "#7C7468",
  border: "#DDD8CF",
  rule: "#C8C3BA",
  chipBg: "#F3EFE9",
  accent: "#8B6340",          // warm amber-brown — trustworthy, premium
  accentRule: "#8B6340",
  accentLight: "#F7F1EA",
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
    month: "long",
    day: "numeric",
  });
}

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    padding: 52,
    backgroundColor: C.bg,
    color: C.ink,
  },

  // ── Top accent rule ──
  topRule: {
    height: 2.5,
    backgroundColor: C.accent,
    marginBottom: 24,
  },

  // ── Letterhead row ──
  letterhead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 36,
    paddingBottom: 20,
    borderBottomWidth: 0.75,
    borderBottomColor: C.border,
  },

  studioName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 17,
    color: C.ink,
    letterSpacing: 0.3,
    marginBottom: 3,
  },

  studioSub: {
    fontSize: 8.5,
    color: C.muted,
    letterSpacing: 0.2,
  },

  invoiceRight: {
    alignItems: "flex-end",
  },

  invoiceTag: {
    fontSize: 7,
    letterSpacing: 3.5,
    color: C.accent,
    marginBottom: 5,
  },

  invoiceNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: C.ink,
    letterSpacing: 0.5,
  },

  // ── Parties ──
  parties: {
    flexDirection: "row",
    marginBottom: 28,
  },

  party: {
    flex: 1,
  },

  partyDivider: {
    width: 0.75,
    backgroundColor: C.border,
    marginHorizontal: 28,
  },

  partyRole: {
    fontSize: 6.5,
    letterSpacing: 2.5,
    color: C.muted,
    marginBottom: 9,
  },

  partyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: C.ink,
    marginBottom: 4,
  },

  partyDetail: {
    fontSize: 9,
    color: C.muted,
    marginBottom: 2,
  },

  // ── Meta chips ──
  chips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 36,
  },

  chip: {
    flex: 1,
    backgroundColor: C.chipBg,
    borderRadius: 3,
    padding: 12,
    borderLeftWidth: 2,
    borderLeftColor: C.border,
  },

  chipLabel: {
    fontSize: 6.5,
    letterSpacing: 2,
    color: C.muted,
    marginBottom: 6,
  },

  chipValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: C.ink,
  },

  // ── Table ──
  tableHead: {
    flexDirection: "row",
    paddingBottom: 9,
    borderBottomWidth: 0.75,
    borderBottomColor: C.ink,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },

  colDesc: { flex: 3 },
  colQty: { flex: 0.5, textAlign: "center" },
  colRate: { flex: 1.3, textAlign: "right" },
  colAmt: { flex: 1.3, textAlign: "right" },

  thText: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: C.muted,
  },

  tdDesc: { fontSize: 9.5, color: C.ink },
  tdMuted: { fontSize: 9.5, color: C.muted },
  tdBold: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: C.ink },

  // ── Totals ──
  totalsSection: {
    marginTop: 24,
    alignItems: "flex-end",
  },

  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 230,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },

  subLabel: { fontSize: 8.5, color: C.muted },
  subValue: { fontSize: 8.5, color: C.muted },

  totalBlock: {
    width: 230,
    marginTop: 10,
    backgroundColor: C.accentLight,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalBlockLabel: {
    fontSize: 7,
    letterSpacing: 2.5,
    color: C.accent,
  },

  totalBlockValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: C.ink,
  },

  // ── Notes ──
  notesSection: {
    marginTop: 36,
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },

  notesLabel: {
    fontSize: 6.5,
    letterSpacing: 2.5,
    color: C.muted,
    marginBottom: 8,
  },

  notesText: {
    fontSize: 9,
    color: C.muted,
    lineHeight: 1.65,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 32,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    paddingTop: 9,
  },

  footerText: { fontSize: 7.5, color: C.muted, letterSpacing: 0.3 },
  footerRight: { fontSize: 7.5, color: C.muted },
});

export function StudioLuxeInvoice({ invoice, user }: { invoice: InvoiceForPDF;
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
        {/* ── Top accent rule ── */}
        <View style={S.topRule} />

        {/* ── Letterhead ── */}
        <View style={S.letterhead}>
          <View>
            <Text style={S.studioName}>{user.companyName}</Text>
            <Text style={S.studioSub}>Independent Consulting</Text>
          </View>
          <View style={S.invoiceRight}>
            <Text style={S.invoiceTag}>INVOICE</Text>
            <Text style={S.invoiceNumber}>{invoiceLabel}</Text>
          </View>
        </View>

        {/* ── Parties ── */}
        <View style={S.parties}>
          <View style={S.party}>
            <Text style={S.partyRole}>FROM</Text>
            <Text style={S.partyName}>{user.companyName}</Text>
            <Text style={S.partyDetail}>{user.companyEmail}</Text>
            <Text style={S.partyDetail}>{user.companyWebsite}</Text>
          </View>

          <View style={S.partyDivider} />

          <View style={S.party}>
            <Text style={S.partyRole}>BILLED TO</Text>
            <Text style={S.partyName}>{invoice.customer.name}</Text>
            <Text style={S.partyDetail}>{invoice.customer.email}</Text>
            {invoice.customer.phone && (
              <Text style={S.partyDetail}>{invoice.customer.phone}</Text>
            )}
            {invoice.customer.address && (
              <Text style={S.partyDetail}>{invoice.customer.address}</Text>
            )}
          </View>
        </View>

        {/* ── Meta chips ── */}
        <View style={S.chips}>
          <View style={S.chip}>
            <Text style={S.chipLabel}>ISSUE DATE</Text>
            <Text style={S.chipValue}>{fmtDate(invoice.createdAt)}</Text>
          </View>
          <View style={S.chip}>
            <Text style={S.chipLabel}>DUE DATE</Text>
            <Text style={S.chipValue}>{fmtDate(invoice.dueDate)}</Text>
          </View>
          <View style={S.chip}>
            <Text style={S.chipLabel}>CURRENCY</Text>
            <Text style={S.chipValue}>{invoice.currency}</Text>
          </View>
        </View>

        {/* ── Table ── */}
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

        {/* ── Totals ── */}
        <View style={S.totalsSection}>
          <View style={S.subRow}>
            <Text style={S.subLabel}>Subtotal</Text>
            <Text style={S.subValue}>{fmt(subtotal, invoice.currency)}</Text>
          </View>
          <View style={S.totalBlock}>
            <Text style={S.totalBlockLabel}>TOTAL DUE</Text>
            <Text style={S.totalBlockValue}>{fmt(subtotal, invoice.currency)}</Text>
          </View>
        </View>

        {/* ── Notes ── */}
        {invoice.notes && (
          <View style={S.notesSection}>
            <Text style={S.notesLabel}>NOTES</Text>
            <Text style={S.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Thank you for your business.</Text>
          <Text style={S.footerRight}>{invoiceLabel}</Text>
        </View>
      </Page>
    </Document>
  );
}