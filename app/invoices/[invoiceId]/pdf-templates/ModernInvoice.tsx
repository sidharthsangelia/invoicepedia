import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
// /import {
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

export interface ModernInvoiceData {
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

const SLATE = "#0F172A";
const SLATE_MID = "#1E293B";
const SLATE_LIGHT = "#334155";
const AMBER = "#D97706";
const AMBER_LIGHT = "#FEF3C7";
const WHITE = "#FFFFFF";
const GRAY_50 = "#F8FAFC";
const GRAY_100 = "#F1F5F9";
const GRAY_200 = "#E2E8F0";
const GRAY_500 = "#64748B";
const GRAY_700 = "#374151";

// ── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: WHITE,
    color: GRAY_700,
  },

  // ── Hero header band ──
  heroBand: {
    backgroundColor: SLATE,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroLeft: {},
  heroInvoiceLabel: {
    fontSize: 8,
    color: AMBER,
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroCompanyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: WHITE,
    letterSpacing: -0.5,
  },
  heroRight: {
    alignItems: "flex-end",
  },
  heroBigNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 28,
    color: AMBER,
    letterSpacing: -0.5,
  },
  heroSubNumber: {
    fontSize: 8,
    color: GRAY_500,
    marginTop: 3,
    letterSpacing: 0.5,
  },

  // ── Amber accent bar ──
  accentBar: {
    backgroundColor: AMBER,
    height: 4,
  },

  // ── Body padding ──
  body: {
    paddingHorizontal: 48,
    paddingTop: 28,
    paddingBottom: 70,
  },

  // ── Two column info ──
  infoGrid: {
    flexDirection: "row",
    marginBottom: 28,
  },
  infoColumn: {
    flex: 1,
    paddingRight: 16,
  },
  infoColumnRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  infoChip: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: SLATE,
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: AMBER,
    borderBottomStyle: "solid",
  },
  infoName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: SLATE,
    marginBottom: 4,
  },
  infoDetail: {
    fontSize: 9,
    color: GRAY_500,
    marginTop: 2,
  },
  infoDetailRight: {
    fontSize: 9,
    color: GRAY_500,
    marginTop: 2,
    textAlign: "right",
  },
  infoBoldRight: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: SLATE,
    textAlign: "right",
    marginBottom: 4,
  },

  // ── Status chip ──
  statusChip: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: AMBER_LIGHT,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  statusChipText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: AMBER,
    letterSpacing: 0.8,
  },

  // ── Section header ──
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AMBER,
    marginRight: 7,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: SLATE,
    letterSpacing: 1,
  },

  // ── Table ──
  tableWrapper: {
    marginBottom: 6,
    borderRadius: 2,
    overflow: "hidden",
  },
  tableHeaderStyle: {
    backgroundColor: SLATE_MID,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    color: GRAY_100,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 0.8,
  },
  tableBodyStyle: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableBodyText: {
    fontSize: 9,
    color: GRAY_700,
    fontFamily: "Helvetica",
  },
  evenRowStyle: {
    backgroundColor: GRAY_50,
  },

  // ── Totals ──
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  totalsInner: {
    width: 220,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: GRAY_200,
    borderBottomStyle: "solid",
  },
  subtotalLabel: {
    fontSize: 8.5,
    color: GRAY_500,
  },
  subtotalValue: {
    fontSize: 8.5,
    color: GRAY_700,
  },
  grandTotalBlock: {
    backgroundColor: SLATE,
    marginTop: 6,
    padding: 12,
    borderRadius: 2,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grandTotalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: GRAY_200,
    letterSpacing: 1.2,
  },
  grandTotalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    color: AMBER,
  },

  // ── Notes ──
  notesBox: {
    marginTop: 22,
    padding: 14,
    backgroundColor: GRAY_50,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: GRAY_200,
    borderStyle: "solid",
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  notesDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: SLATE_LIGHT,
    marginRight: 6,
  },
  notesLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: SLATE,
    letterSpacing: 1.2,
  },
  notesText: {
    fontSize: 9,
    color: GRAY_500,
    lineHeight: 1.6,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: SLATE_MID,
    paddingHorizontal: 48,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontSize: 7.5,
    color: GRAY_500,
  },
  footerRight: {
    fontSize: 7.5,
    color: AMBER,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
});

// ── Component ──────────────────────────────────────────────────────────────

export function ModernInvoice({ invoice }: { invoice: ModernInvoiceData }) {
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
        {/* ── Hero band ── */}
        <View style={S.heroBand}>
          <View style={S.heroLeft}>
            <Text style={S.heroInvoiceLabel}>INVOICE</Text>
            <Text style={S.heroCompanyName}>Your Company</Text>
          </View>
          <View style={S.heroRight}>
            <Text style={S.heroBigNumber}>{invoiceLabel}</Text>
            <Text style={S.heroSubNumber}>
              {formatDate(invoice.createdAt)}
            </Text>
          </View>
        </View>

        {/* Amber accent bar */}
        <View style={S.accentBar} />

        {/* ── Body ── */}
        <View style={S.body}>
          {/* Info grid */}
          <View style={S.infoGrid}>
            {/* Bill To */}
            <View style={S.infoColumn}>
              <Text style={S.infoChip}>BILL TO</Text>
              <Text style={S.infoName}>{invoice.customer.name}</Text>
              <Text style={S.infoDetail}>{invoice.customer.email}</Text>
              {invoice.customer.phone && (
                <Text style={S.infoDetail}>{invoice.customer.phone}</Text>
              )}
              {invoice.customer.address && (
                <Text style={S.infoDetail}>{invoice.customer.address}</Text>
              )}
            </View>

            {/* Invoice details */}
            <View style={S.infoColumnRight}>
              <Text style={[S.infoChip, { textAlign: "right" }]}>
                INVOICE DETAILS
              </Text>
              <Text style={S.infoBoldRight}>
                Issued {formatDate(invoice.createdAt)}
              </Text>
              {invoice.dueDate && (
                <Text style={S.infoDetailRight}>
                  Due {formatDate(invoice.dueDate)}
                </Text>
              )}
              <Text style={S.infoDetailRight}>{invoice.currency}</Text>
              <View style={S.statusChip}>
                <Text style={S.statusChipText}>{invoice.status}</Text>
              </View>
            </View>
          </View>

          {/* Section header */}
          <View style={S.sectionHeader}>
            <View style={S.sectionDot} />
            <Text style={S.sectionTitle}>LINE ITEMS</Text>
          </View>

          {/* Table */}
     <View style={S.tableWrapper}>
  {tableData.length === 0 ? (
    <View
      style={{
        padding: 20,
        alignItems: "center",
        backgroundColor: GRAY_50,
      }}
    >
      <Text style={{ fontSize: 10, color: GRAY_500 }}>
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
                fontFamily: "Helvetica-Bold",
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

          {/* Totals */}
          <View style={S.totalsSection}>
            <View style={S.totalsInner}>
              <View style={S.grandTotalBlock}>
                <View style={S.grandTotalRow}>
                  <Text style={S.grandTotalLabel}>TOTAL DUE</Text>
                  <Text style={S.grandTotalValue}>
                    {formatMoney(total, invoice.currency)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes */}
          {invoice.notes && (
            <View style={S.notesBox}>
              <View style={S.notesHeader}>
                <View style={S.notesDot} />
                <Text style={S.notesLabel}>NOTES</Text>
              </View>
              <Text style={S.notesText}>{invoice.notes}</Text>
            </View>
          )}
        </View>

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerLeft}>Thank you for your business.</Text>
          <Text style={S.footerRight}>
            {invoiceLabel} · {invoice.currency}
          </Text>
        </View>
      </Page>
    </Document>
  );
}