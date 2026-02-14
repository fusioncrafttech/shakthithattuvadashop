import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Order } from '../types';

function escapeCsvCell(value: string): string {
  const s = String(value ?? '').replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

export function exportOrdersToCsv(orders: Order[], filename?: string): void {
  const headers = [
    'Order ID',
    'Customer',
    'Email',
    'Status',
    'Total (₹)',
    'Date',
    'Delivery Name',
    'Delivery Mobile',
    'Delivery Address',
    'Items',
  ];
  const rows = orders.map((o) => [
    o.id,
    o.user_name ?? '',
    o.user_email ?? '',
    o.status,
    o.total,
    new Date(o.created_at).toLocaleString(),
    o.delivery_name ?? '',
    o.delivery_mobile ?? '',
    (o.delivery_address ?? '').replace(/\n/g, ' '),
    o.items.map((i) => `${i.name} × ${i.quantity}`).join('; '),
  ]);
  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportOrdersToPdf(orders: Order[], filename?: string): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const title = 'Orders Export';
  doc.setFontSize(16);
  doc.text(title, 14, 12);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()} • ${orders.length} order(s)`, 14, 18);

  const tableData = orders.map((o) => [
    `#${o.id.slice(-8)}`,
    (o.user_name ?? o.user_email ?? o.user_id ?? '').slice(0, 20),
    o.status,
    `₹${o.total}`,
    new Date(o.created_at).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 24,
    head: [['Order ID', 'Customer', 'Status', 'Amount', 'Date']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [229, 57, 53], textColor: 255 },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
  });

  doc.save(filename ?? `orders-export-${new Date().toISOString().slice(0, 10)}.pdf`);
}
