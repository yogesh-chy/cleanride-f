export function exportToCSV<T>(
  data: T[],
  headers: { key: keyof T | ((item: T) => string); label: string }[],
  filename: string
) {
  if (!data || data.length === 0) return;

  // Extract exactly the columns we want with proper labels
  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',');

  // Process data rows
  const rows = data.map((item) => {
    return headers.map((h) => {
      // Evaluate value: either a direct key or a computed function
      let val = typeof h.key === 'function' ? h.key(item) : item[h.key];
      if (val === null || val === undefined) val = '';
      
      // Escape for CSV formats
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join(',');
  });

  // Combine headers and rows
  const csvString = [headerRow, ...rows].join('\r\n');
  
  // Create Blob and download trigger
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
