import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   DataTableCell,
//   TableCell,
// } from "@ag-media/react-pdf-table";

// ── Types ──────────────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

export interface ClassicInvoiceData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  invoiceNumber: string | null;
  currency: string;
  notes: string | null;
  status: string;
  customer: Customer;
  lineItems: LineItem[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Palette ────────────────────────────────────────────────────────────────

const BROWN = "#6B3A2A";
const BROWN_LIGHT = "#9C6B52";
const CREAM = "#FDF8F4";
const CREAM_DARK = "#F0E8E0";
const INK = "#1A1209";
const INK_MUTED = "#6B5C4C";
const BORDER = "#DDD0C4";

// ── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 52,
    backgroundColor: CREAM,
    color: INK,
  },

  // ── Decorative stripe ──
  topStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: BROWN,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: BROWN,
    borderBottomStyle: "solid",
  },
  headerLeft: {},
  invoiceWord: {
    fontFamily: "Times-Bold",
    fontSize: 30,
    color: BROWN,
    letterSpacing: 6,
  },
  invoiceNumber: {
    fontSize: 9,
    color: BROWN_LIGHT,
    marginTop: 3,
    letterSpacing: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  companyName: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    color: INK,
    marginBottom: 3,
  },
  companyDetail: {
    fontSize: 8.5,
    color: INK_MUTED,
    marginTop: 1,
  },

  // ── Meta row (bill to + details) ──
  metaSection: {
    flexDirection: "row",
    marginBottom: 24,
  },
  metaBlock: {
    flex: 1,
  },
  metaBlockRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  metaLabel: {
    fontFamily: "Times-Bold",
    fontSize: 7,
    color: BROWN_LIGHT,
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  metaName: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: INK,
    marginBottom: 3,
  },
  metaDetail: {
    fontSize: 9,
    color: INK_MUTED,
    marginTop: 1,
  },
  metaDetailRight: {
    fontSize: 9,
    color: INK_MUTED,
    marginTop: 1,
    textAlign: "right",
  },
  statusPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: BROWN_LIGHT,
    borderStyle: "solid",
    borderRadius: 2,
  },
  statusText: {
    fontSize: 7.5,
    color: BROWN,
    letterSpacing: 1,
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 16,
  },

  // ── Table ──
  tableWrapper: {
    marginBottom: 20,
  },
  tableHeaderStyle: {
    backgroundColor: BROWN,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: "#FFFFFF",
    fontFamily: "Times-Bold",
    fontSize: 8,
    letterSpacing: 0.8,
  },
  tableBodyStyle: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableBodyText: {
    fontSize: 9,
    color: INK,
    fontFamily: "Times-Roman",
  },
  evenRowStyle: {
    backgroundColor: CREAM_DARK,
  },

  // ── Totals ──
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalsBox: {
    width: 210,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    borderBottomStyle: "solid",
  },
  subtotalLabel: {
    fontSize: 9,
    color: INK_MUTED,
  },
  subtotalValue: {
    fontSize: 9,
    color: INK,
    fontFamily: "Times-Roman",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    marginTop: 3,
    borderTopWidth: 2,
    borderTopColor: BROWN,
    borderTopStyle: "solid",
    borderBottomWidth: 0.5,
    borderBottomColor: BROWN,
    borderBottomStyle: "solid",
  },
  totalLabel: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: BROWN,
    letterSpacing: 1,
  },
  totalValue: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: BROWN,
  },

  // ── Notes ──
  notesBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: CREAM_DARK,
    borderLeftWidth: 3,
    borderLeftColor: BROWN,
    borderLeftStyle: "solid",
  },
  notesLabel: {
    fontFamily: "Times-Bold",
    fontSize: 7.5,
    color: BROWN,
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9,
    color: INK_MUTED,
    lineHeight: 1.6,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    borderTopStyle: "solid",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7.5,
    color: INK_MUTED,
    fontFamily: "Times-Italic",
  },
  footerRight: {
    fontSize: 7.5,
    color: BROWN_LIGHT,
  },

  // ── Watermark ──
  watermark: {
    position: "absolute",
    bottom: 80,
    right: 40,
    fontSize: 60,
    color: "#F0E8E0",
    fontFamily: "Times-Bold",
    transform: "rotate(-30deg)",
  },
});

// ── Component ──────────────────────────────────────────────────────────────

export function ClassicInvoice({ invoice }: { invoice: ClassicInvoiceData }) {
  const total = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0,
  );

  const invoiceLabel = invoice.invoiceNumber
    ? invoice.invoiceNumber
    : `#${invoice.id.slice(-8).toUpperCase()}`;

  const tableData = invoice.lineItems.map((item) => ({
    description: item.description,
    qty: String(item.quantity),
    unitPrice: formatMoney(item.unitAmount, invoice.currency),
    amount: formatMoney(item.quantity * item.unitAmount, invoice.currency),
  }));

  return (
    <Document
      title={`Invoice ${invoiceLabel}`}
      author="Invoice App"
      subject={`Invoice for ${invoice.customer.name}`}
    >
      <Page size="A4" style={S.page}>
        {/* Top colour stripe */}
        <View style={S.topStripe} fixed />

        {/* Decorative watermark */}
        <Text style={S.watermark}>INVOICE</Text>

        {/* ── Header ── */}
        <View style={S.header}>
          <View style={S.headerLeft}>
            <Text style={S.invoiceWord}>INVOICE</Text>
            <Text style={S.invoiceNumber}>{invoiceLabel}</Text>
          </View>
          <View style={S.headerRight}>
            <Text style={S.companyName}>Your Company</Text>
            <Text style={S.companyDetail}>your@company.com</Text>
            <Text style={S.companyDetail}>www.yourcompany.com</Text>
          </View>
        </View>

        {/* ── Meta ── */}
        <View style={S.metaSection}>
          {/* Bill To */}
          <View style={S.metaBlock}>
            <Text style={S.metaLabel}>BILL TO</Text>
            <Text style={S.metaName}>{invoice.customer.name}</Text>
            <Text style={S.metaDetail}>{invoice.customer.email}</Text>
            {invoice.customer.phone && (
              <Text style={S.metaDetail}>{invoice.customer.phone}</Text>
            )}
            {invoice.customer.address && (
              <Text style={S.metaDetail}>{invoice.customer.address}</Text>
            )}
          </View>

          {/* Invoice details */}
          <View style={S.metaBlockRight}>
            <Text style={[S.metaLabel, { textAlign: "right" }]}>DETAILS</Text>
            <Text style={S.metaDetailRight}>
              Issued: {formatDate(invoice.createdAt)}
            </Text>
            {invoice.dueDate && (
              <Text style={S.metaDetailRight}>
                Due: {formatDate(invoice.dueDate)}
              </Text>
            )}
            <Text style={S.metaDetailRight}>
              Currency: {invoice.currency}
            </Text>
            <View style={[S.statusPill, { alignSelf: "flex-end", marginTop: 6 }]}>
              <Text style={S.statusText}>{invoice.status}</Text>
            </View>
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={S.divider} />

        {/* ── Line Items Table ── */}
     const tableHeaders = ["Description", "Qty", "Unit Price", "Amount"];

<View style={S.tableWrapper}>
  {tableData.length === 0 ? (
    <View style={{ padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 10, color: INK_MUTED }}>
        No line items
      </Text>
    </View>
  ) : (
    <View>
      {/* Header */}
      <View style={[S.tableHeaderStyle, { flexDirection: "row" }]}>
        <Text style={[S.tableHeaderText, { flex: 0.45 }]}>
          Description
        </Text>
        <Text style={[S.tableHeaderText, { flex: 0.13, textAlign: "center" }]}>
          Qty
        </Text>
        <Text style={[S.tableHeaderText, { flex: 0.21, textAlign: "right" }]}>
          Unit Price
        </Text>
        <Text style={[S.tableHeaderText, { flex: 0.21, textAlign: "right" }]}>
          Amount
        </Text>
      </View>

      {/* Rows */}
      {tableData.map((row, i) => (
        <View
          key={i}
          style={[
            S.tableBodyStyle,
            { flexDirection: "row" },
            ...(i % 2 === 1 ? [S.evenRowStyle] : []),
          ]}
        >
          <Text style={[S.tableBodyText, { flex: 0.45 }]}>
            {row.description}
          </Text>
          <Text
            style={[
              S.tableBodyText,
              { flex: 0.13, textAlign: "center" },
            ]}
          >
            {row.qty}
          </Text>
          <Text
            style={[
              S.tableBodyText,
              { flex: 0.21, textAlign: "right" },
            ]}
          >
            {row.unitPrice}
          </Text>
          <Text
            style={[
              S.tableBodyText,
              {
                flex: 0.21,
                textAlign: "right",
                fontFamily: "Times-Bold",
              },
            ]}
          >
            {row.amount}
          </Text>
        </View>
      ))}
    </View>
  )}
</View>

        {/* ── Totals ── */}
        <View style={S.totalsContainer}>
          <View style={S.totalsBox}>
            <View style={S.totalRow}>
              <Text style={S.totalLabel}>TOTAL DUE</Text>
              <Text style={S.totalValue}>
                {formatMoney(total, invoice.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Notes ── */}
        {invoice.notes && (
          <View style={S.notesBox}>
            <Text style={S.notesLabel}>NOTES</Text>
            <Text style={S.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Thank you for your business.</Text>
          <Text style={S.footerRight}>
            {invoiceLabel} · {invoice.currency}
          </Text>
        </View>
      </Page>
    </Document>
  );
}