export const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadExcel = (filename: string, headers: string[], rows: string[][]) => {
  const tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet 1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head>
    <body>
      <table border="1">
        <thead>
          <tr style="background-color: #D90429; color: white; font-weight: bold;">
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map(val => `<td>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

import adminApi from './adminApi';

export const downloadPDF = async (title: string, headers: string[], rows: string[][]) => {
  const lowerTitle = title.toLowerCase();
  let exportUrl = '';
  
  if (lowerTitle.includes('ticket')) {
    exportUrl = '/api/v1/admin/export/tickets/pdf';
  } else if (lowerTitle.includes('marathon')) {
    exportUrl = '/api/v1/admin/export/marathons/pdf';
  } else if (lowerTitle.includes('standings') || lowerTitle.includes('votes')) {
    exportUrl = '/api/v1/admin/export/standings/pdf';
  }

  if (exportUrl) {
    try {
      const response = await adminApi.get(exportUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = exportUrl.split('/').pop() || 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      return;
    } catch (err) {
      console.error("Failed to download PDF report from backend:", err);
      // fallback to iframe printing on error
    }
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  const html = `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D90429; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 20px; font-weight: bold; color: #D90429; }
        .title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f8f9fa; color: #555; border-bottom: 2px solid #dee2e6; text-transform: uppercase; font-size: 10px; font-weight: bold; text-align: left; padding: 12px; }
        td { border-bottom: 1px solid #dee2e6; padding: 12px; font-size: 11px; color: #666; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .footer { margin-top: 40px; font-size: 9px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">TAPHE AWARDS 2026</div>
        <div class="title">${title}</div>
      </div>
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map(val => `<td>${val}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">
        Generated automatically by TAPHE Control Center. All rights reserved. &copy; 2026
      </div>
    </body>
    </html>
  `;

  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
  }, 500);
};
