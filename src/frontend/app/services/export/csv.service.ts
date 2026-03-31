import { Injectable } from '@angular/core';

export interface CsvExportOptions {
  filename: string;
  headers: string[];
  rows: (string | number | boolean | null | undefined)[][];
}

export interface CsvImportResult<T> {
  data: T[];
  errors: string[];
  totalRows: number;
}

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  /**
   * Export data to CSV file using native browser download
   */
  exportToCsv(options: CsvExportOptions): void {
    const csvContent = this.convertToCsv(options.headers, options.rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Native browser download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', options.filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse CSV string to array of objects
   */
  parseCsv<T>(csvContent: string, mapper: (row: Record<string, string>) => T | null): CsvImportResult<T> {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    const data: T[] = [];

    if (lines.length < 2) {
      return { data, errors: ['File is empty or has no data rows'], totalRows: 0 };
    }

    // Parse headers
    const headers = this.parseCsvLine(lines[0]);

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const rowObj: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowObj[header.trim()] = values[index]?.trim() || '';
      });

      try {
        const mapped = mapper(rowObj);
        if (mapped !== null) {
          data.push(mapped);
        }
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return { data, errors, totalRows: lines.length - 1 };
  }

  /**
   * Convert data to CSV string
   */
  private convertToCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
    const escapeCell = (cell: string): string => {
      // Escape cells containing commas, quotes, or newlines
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    };

    const headerRow = headers.map(escapeCell).join(',');
    const dataRows = rows.map(row =>
      row.map(cell => escapeCell(String(cell ?? ''))).join(',')
    );

    return [headerRow, ...dataRows].join('\n');
  }

  /**
   * Parse a single CSV line respecting quoted values
   */
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            // Escaped quote
            current += '"';
            i++; // Skip next quote
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Read file as text
   */
  readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}
