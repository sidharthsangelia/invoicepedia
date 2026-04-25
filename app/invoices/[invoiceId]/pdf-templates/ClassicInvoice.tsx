import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

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
  }).format(cents / 100);
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 10,
    padding: 48,
    color: "#111",
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  title: {
    fontFamily: "Times-Bold",
    fontSize: 20,
    letterSpacing: 2,
  },

  invoiceNumber: {
    marginTop: 4,
    fontSize: 9,
    color: "#555",
  },

  company: {
    alignItems: "flex-end",
  },

  companyName: {
    fontFamily: "Times-Bold",
    fontSize: 11,
  },

  companyDetail: {
    fontSize: 9,
    color: "#555",
    marginTop: 2,
  },

  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  block: {
    flex: 1,
  },

  rightBlock: {
    flex: 1,
    alignItems: "flex-end",
  },

  label: {
    fontFamily: "Times-Bold",
    fontSize: 8,
    marginBottom: 6,
    letterSpacing: 1,
  },

  value: {
    fontSize: 9,
    marginBottom: 2,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 16,
  },

  // Table
  table: {
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 6,
  },

  headerRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 4,
  },

  cellDesc: { flex: 0.5 },
  cellQty: { flex: 0.15, textAlign: "center" },
  cellPrice: { flex: 0.175, textAlign: "right" },
  cellAmount: { flex: 0.175, textAlign: "right" },

  headerText: {
    fontFamily: "Times-Bold",
    fontSize: 9,
  },

  bodyText: {
    fontSize: 9,
  },

  totals: {
    marginTop: 10,
    alignItems: "flex-end",
  },

  totalBox: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontFamily: "Times-Bold",
  },

  totalValue: {
    fontFamily: "Times-Bold",
  },

  notes: {
    marginTop: 24,
  },

  notesLabel: {
    fontFamily: "Times-Bold",
    fontSize: 8,
    marginBottom: 4,
  },

  notesText: {
    fontSize: 9,
    color: "#444",
  },

  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 8,
    color: "#666",
  },
});

// ── Component ──────────────────────────────────────────────────────────────

export function ClassicInvoice({ invoice }: { invoice: ClassicInvoiceData }) {
  const total = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0
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
    <Document>
      <Page size="A4" style={S.page}>
        {/* Header */}
        <View style={S.header}>
          <View>
            <Text style={S.title}>INVOICE</Text>
            <Text style={S.invoiceNumber}>{invoiceLabel}</Text>
          </View>

          <View style={S.company}>
            <Text style={S.companyName}>Your Company</Text>
            <Text style={S.companyDetail}>your@company.com</Text>
            <Text style={S.companyDetail}>www.yourcompany.com</Text>
          </View>
        </View>

        {/* Meta */}
        <View style={S.meta}>
          <View style={S.block}>
            <Text style={S.label}>BILL TO</Text>
            <Text style={S.value}>{invoice.customer.name}</Text>
            <Text style={S.value}>{invoice.customer.email}</Text>
            {invoice.customer.phone && (
              <Text style={S.value}>{invoice.customer.phone}</Text>
            )}
            {invoice.customer.address && (
              <Text style={S.value}>{invoice.customer.address}</Text>
            )}
          </View>

          <View style={S.rightBlock}>
            <Text style={S.label}>DETAILS</Text>
            <Text style={S.value}>
              Issued: {formatDate(invoice.createdAt)}
            </Text>
            {invoice.dueDate && (
              <Text style={S.value}>
                Due: {formatDate(invoice.dueDate)}
              </Text>
            )}
            <Text style={S.value}>{invoice.currency}</Text>
          </View>
        </View>

        <View style={S.divider} />

        {/* Table */}
        <View style={S.table}>
          <View style={[S.row, S.headerRow]}>
            <Text style={[S.headerText, S.cellDesc]}>Description</Text>
            <Text style={[S.headerText, S.cellQty]}>Qty</Text>
            <Text style={[S.headerText, S.cellPrice]}>Unit</Text>
            <Text style={[S.headerText, S.cellAmount]}>Amount</Text>
          </View>

          {tableData.map((row, i) => (
            <View key={i} style={S.row}>
              <Text style={[S.bodyText, S.cellDesc]}>
                {row.description}
              </Text>
              <Text style={[S.bodyText, S.cellQty]}>
                {row.qty}
              </Text>
              <Text style={[S.bodyText, S.cellPrice]}>
                {row.unitPrice}
              </Text>
              <Text style={[S.bodyText, S.cellAmount]}>
                {row.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={S.totals}>
          <View style={S.totalBox}>
            <View style={S.totalRow}>
              <Text style={S.totalLabel}>TOTAL</Text>
              <Text style={S.totalValue}>
                {formatMoney(total, invoice.currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={S.notes}>
            <Text style={S.notesLabel}>NOTES</Text>
            <Text style={S.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>
            Thank you for your business.
          </Text>
          <Text style={S.footerText}>
            {invoiceLabel}
          </Text>
        </View>
      </Page>
    </Document>
  );
}