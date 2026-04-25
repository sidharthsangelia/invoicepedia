import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Palette — Agency: airy, confident, creative-studio feel ─────────────────
const C = {
  bg: "#F8F7F4",           // warm off-white
  white: "#FFFFFF",
  accentBar: "#4A7C6F",    // muted sage green
  accentLight: "#EAF0EE",  // very pale sage tint
  accentText: "#3A6259",
  textMain: "#1C1C1A",
  textMuted: "#7A7A74",
  border: "#DDDDD8",
  rule: "#C8C8C2",
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
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 0,
    backgroundColor: C.bg,
    color: C.textMain,
  },

  // Left accent bar
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 6,
    backgroundColor: C.accentBar,
  },

  body: {
    marginLeft: 6,
    padding: 44,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 48,
  },

  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    color: C.textMain,
    letterSpacing: 0.5,
  },

  companyMeta: {
    fontSize: 8,
    color: C.textMuted,
    marginTop: 3,
  },

  invoiceLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: C.accentBar,
    textAlign: "right",
    marginBottom: 4,
  },

  invoiceNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: C.textMain,
    textAlign: "right",
  },

  // ── Summary pill ──
  summaryRow: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 36,
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryBlock: {
    flex: 1,
  },

  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: C.border,
    marginHorizontal: 20,
  },

  summaryLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: C.textMuted,
    marginBottom: 4,
  },

  summaryValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: C.textMain,
  },

  summaryAccent: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: C.accentBar,
  },

  // ── Table ──
  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: C.accentLight,
    borderRadius: 4,
    marginBottom: 4,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  colDesc: { flex: 3 },
  colQty: { flex: 0.6, textAlign: "center" },
  colUnit: { flex: 1.2, textAlign: "right" },
  colTotal: { flex: 1.2, textAlign: "right" },

  thText: {
    fontSize: 7,
    letterSpacing: 1,
    color: C.accentText,
  },

  tdText: {
    fontSize: 9,
    color: C.textMain,
  },

  tdMuted: {
    fontSize: 9,
    color: C.textMuted,
  },

  tdBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: C.textMain,
  },

  // ── Totals ──
  totalsSection: {
    marginTop: 24,
    alignItems: "flex-end",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    paddingVertical: 6,
    borderTopWidth: 1.5,
    borderTopColor: C.accentBar,
    marginTop: 4,
  },

  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 1,
    color: C.accentBar,
  },

  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: C.accentBar,
  },

  // ── Notes ──
  notesSection: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  notesLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: C.textMuted,
    marginBottom: 6,
  },

  notesText: {
    fontSize: 9,
    color: C.textMuted,
    lineHeight: 1.5,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 28,
    left: 50,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    fontSize: 7,
    color: C.textMuted,
    letterSpacing: 0.5,
  },

  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.accentBar,
  },
});

export function ModernInvoice({ invoice }: { invoice: any }) {
  const total = invoice.lineItems.reduce(
    (s: number, i: any) => s + i.quantity * i.unitAmount,
    0
  );
  const invoiceLabel = invoice.invoiceNumber || `#${invoice.id?.slice(-8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Left accent stripe */}
        <View style={S.accentBar} />

        <View style={S.body}>
          {/* ── Header ── */}
          <View style={S.header}>
            <View>
              <Text style={S.companyName}>Your Company</Text>
              <Text style={S.companyMeta}>your@company.com</Text>
              <Text style={S.companyMeta}>www.yourcompany.com</Text>
            </View>
            <View>
              <Text style={S.invoiceLabel}>INVOICE</Text>
              <Text style={S.invoiceNumber}>{invoiceLabel}</Text>
            </View>
          </View>

          {/* ── Summary pill ── */}
          <View style={S.summaryRow}>
            <View style={S.summaryBlock}>
              <Text style={S.summaryLabel}>BILLED TO</Text>
              <Text style={S.summaryValue}>{invoice.customer.name}</Text>
              <Text style={[S.summaryLabel, { marginTop: 2 }]}>{invoice.customer.email}</Text>
            </View>

            <View style={S.summaryDivider} />

            <View style={S.summaryBlock}>
              <Text style={S.summaryLabel}>ISSUED</Text>
              <Text style={S.summaryValue}>{fmtDate(invoice.createdAt)}</Text>
            </View>

            <View style={S.summaryDivider} />

            <View style={S.summaryBlock}>
              <Text style={S.summaryLabel}>DUE</Text>
              <Text style={S.summaryValue}>{fmtDate(invoice.dueDate)}</Text>
            </View>

            <View style={S.summaryDivider} />

            <View style={[S.summaryBlock, { alignItems: "flex-end" }]}>
              <Text style={S.summaryLabel}>AMOUNT DUE</Text>
              <Text style={S.summaryAccent}>{fmt(total, invoice.currency)}</Text>
            </View>
          </View>

          {/* ── Line Items Table ── */}
          <View style={S.tableHeaderRow}>
            <Text style={[S.thText, S.colDesc]}>DESCRIPTION</Text>
            <Text style={[S.thText, S.colQty]}>QTY</Text>
            <Text style={[S.thText, S.colUnit]}>UNIT PRICE</Text>
            <Text style={[S.thText, S.colTotal]}>TOTAL</Text>
          </View>

          {invoice.lineItems.map((item: any, i: number) => (
            <View key={i} style={S.tableRow}>
              <Text style={[S.tdText, S.colDesc]}>{item.description}</Text>
              <Text style={[S.tdMuted, S.colQty]}>{item.quantity}</Text>
              <Text style={[S.tdMuted, S.colUnit]}>{fmt(item.unitAmount, invoice.currency)}</Text>
              <Text style={[S.tdBold, S.colTotal]}>{fmt(item.quantity * item.unitAmount, invoice.currency)}</Text>
            </View>
          ))}

          {/* ── Totals ── */}
          <View style={S.totalsSection}>
            <View style={S.totalRow}>
              <Text style={S.totalLabel}>TOTAL</Text>
              <Text style={S.totalValue}>{fmt(total, invoice.currency)}</Text>
            </View>
          </View>

          {/* ── Notes ── */}
          {invoice.notes && (
            <View style={S.notesSection}>
              <Text style={S.notesLabel}>NOTES</Text>
              <Text style={S.notesText}>{invoice.notes}</Text>
            </View>
          )}
        </View>

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Thank you for your business.</Text>
          <View style={S.footerDot} />
          <Text style={S.footerText}>{invoiceLabel}</Text>
        </View>
      </Page>
    </Document>
  );
}