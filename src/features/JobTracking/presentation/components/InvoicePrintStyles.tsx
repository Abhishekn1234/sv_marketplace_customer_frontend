export default function InvoicePrintStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      .invoice-root {
        font-family: 'Inter', system-ui, sans-serif;
        color: #1A1611;
      }

      .invoice-page {
        width: 210mm;
        min-height: 297mm;
        background: #FFFFFF;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        box-shadow: 0 4px 40px rgba(0,0,0,0.12);
        overflow: hidden;
      }

      /* ── TOP HEADER BAND ── */
      .inv-header {
        background: #2563eb;
        padding: 10mm 12mm 9mm;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-shrink: 0;
      }

      .inv-header-left {}

      .inv-title {
        font-size: 52px;
        font-weight: 700;
        letter-spacing: -1px;
        color: #FDFCF9;
        line-height: 1;
      }

      .inv-title span {
        color: #C9973B;
      }

      .inv-meta {
        margin-top: 8px;
        display: flex;
        gap: 20px;
      }

      .inv-meta-item {
        font-size: 11px;
        color: #cbd5e1;
        letter-spacing: 0.04em;
      }

      .inv-meta-item strong {
        color: #ffffff;
        font-weight: 500;
        margin-left: 5px;
      }

      .inv-header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }

      .inv-brand {
        font-size: 22px;
        font-weight: 600;
        color: #FDFCF9;
        letter-spacing: 0.02em;
      }

      .inv-brand-sub {
        font-size: 10px;
        letter-spacing: 0.14em;
        color: #C9973B;
        text-transform: uppercase;
        text-align: right;
      }

      .inv-status-badge {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 2px;
      }

      .inv-status-paid {
        background: rgba(201,151,59,0.18);
        color: #C9973B;
        border: 1px solid rgba(201,151,59,0.35);
      }

      .inv-status-unpaid {
        background: rgba(255,255,255,0.08);
        color: #cbd5e1;
        border: 1px solid rgba(255,255,255,0.15);
      }

      /* ── BODY ── */
      .inv-body {
        padding: 9mm 12mm;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 7mm;
      }

      /* ── PARTIES ROW ── */
      .inv-parties {
        display: grid;
        grid-template-columns: 1fr 1px 1fr;
        gap: 0;
      }

      .inv-party-divider {
        background: #E8E3DB;
        align-self: stretch;
        margin: 0 7mm;
      }

      .inv-party-label {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #C9973B;
        margin-bottom: 6px;
      }

      .inv-party-name {
        font-size: 20px;
        font-weight: 600;
        color: #1A1611;
        line-height: 1.2;
        margin-bottom: 4px;
      }

      .inv-party-detail {
        font-size: 11.5px;
        color: #6B6259;
        line-height: 1.7;
      }

      .inv-party-sub {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #EDE8E1;
      }

      .inv-party-sub-label {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #A89E93;
        margin-bottom: 3px;
      }

      .inv-party-sub-val {
        font-size: 11px;
        color: #5C544C;
      }

      .inv-verified {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-top: 8px;
        font-size: 11px;
        font-weight: 500;
        color: #5A8A5A;
        background: rgba(90,138,90,0.08);
        border: 1px solid rgba(90,138,90,0.2);
        padding: 3px 8px;
        border-radius: 2px;
      }

      /* ── RULED SECTION DIVIDER ── */
      .inv-rule {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .inv-rule-label {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #A89E93;
        white-space: nowrap;
      }
      .inv-rule-line {
        flex: 1;
        height: 1px;
        background: #E8E3DB;
      }

      /* ── SERVICE TABLE ── */
      .inv-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }

      .inv-table thead tr {
        border-bottom: 2px solid #1A1611;
      }

      .inv-table th {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #A89E93;
        padding: 0 0 7px;
        text-align: left;
      }

      .inv-table th.right { text-align: right; }
      .inv-table th.center { text-align: center; }

      .inv-table tbody tr {
        border-bottom: 1px solid #EDE8E1;
      }

      .inv-table td {
        padding: 9px 0;
        color: #3A342D;
        vertical-align: middle;
      }

      .inv-table td.right {
        text-align: right;
        font-size: 12px;
      }

      .inv-table td.center {
        text-align: center;
      }

      .inv-table td.service-name {
        font-weight: 600;
        color: #1A1611;
        font-size: 13px;
      }

      .inv-table td.tier-pill {}
      .tier-tag {
        display: inline-block;
        background: #F0EBE3;
        color: #6B5E52;
        font-size: 10px;
        font-weight: 500;
        padding: 2px 7px;
        border-radius: 2px;
        letter-spacing: 0.03em;
      }

      /* ── BOTTOM SECTION: ref + totals ── */
      .inv-bottom {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 6mm;
      }

      .inv-ref-row {
        display: flex;
        gap: 8mm;
      }

      .inv-ref-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .inv-ref-key {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #A89E93;
      }

      .inv-ref-val {
        font-size: 11.5px;
        color: #3A342D;
      }

      /* ── TOTALS BOX ── */
      .inv-totals-wrap {
        display: flex;
        justify-content: flex-end;
      }

      .inv-totals {
        width: 220px;
        border-top: 2px solid #1A1611;
        padding-top: 8px;
      }

      .inv-totals-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 4px 0;
      }

      .inv-totals-label {
        font-size: 11.5px;
        color: #7A706A;
      }

      .inv-totals-val {
        font-size: 12px;
        color: #3A342D;
      }

      .inv-totals-divider {
        height: 1px;
        background: #E8E3DB;
        margin: 6px 0;
      }

      .inv-totals-final-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-top: 2px;
      }

      .inv-totals-final-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #1A1611;
      }

      .inv-totals-final-val {
        font-size: 26px;
        font-weight: 700;
        color: #C9973B;
        line-height: 1;
      }

      .inv-due-note {
        font-size: 10px;
        color: #A89E93;
        text-align: right;
        margin-top: 5px;
        font-style: italic;
      }

      /* ── SIGNATURE SECTION ── */
      .inv-signatures {
        border-top: 1px solid #E8E3DB;
        padding-top: 7mm;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10mm;
      }

      .inv-sig-block {}

      .inv-sig-line {
        height: 36px;
        border-bottom: 1px solid #B0A99E;
        margin-bottom: 6px;
        position: relative;
      }

      .inv-sig-line::before {
        content: "×";
        position: absolute;
        bottom: -1px;
        left: 0;
        font-size: 13px;
        color: #C9C3BB;
        transform: translateY(50%);
        line-height: 1;
      }

      .inv-sig-label {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #A89E93;
      }

      .inv-sig-name {
        font-size: 10.5px;
        color: #6B6259;
        margin-top: 2px;
      }

      /* ── FOOTER STRIP ── */
      .inv-footer {
        background: #141210;
        padding: 5mm 12mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .inv-footer-brand {
        font-size: 14px;
        font-weight: 600;
        color: #6B6259;
      }

      .inv-footer-text {
        font-size: 9px;
        color: #4A433C;
        letter-spacing: 0.04em;
        text-align: right;
        line-height: 1.7;
      }

      /* ── PRINT ── */
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background: #F6F4F0;
        }
        .invoice-page {
          box-shadow: none;
          margin: 0;
          width: 210mm;
          min-height: 297mm;
        }
      }
    `}</style>
  );
}