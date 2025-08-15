// Month abbreviations for date formatting
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Formats a date string from "YYYY-MM" format to "MMM YYYY" format
 * @param dateString - Date string in "YYYY-MM" format
 * @returns Formatted date string like "Jan 2025" or empty string if invalid
 */
export function formatDate(dateString?: string): string {
  if (!dateString || typeof dateString !== 'string') return "";
  
  // Handle "YYYY-MM" format
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split("-");
    const monthIndex = parseInt(month, 10) - 1;
    
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${MONTHS[monthIndex]} ${year}`;
    }
  }
  
  // Handle "YYYY-MM-DD" format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split("-");
    const monthIndex = parseInt(month, 10) - 1;
    
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${MONTHS[monthIndex]} ${year}`;
    }
  }
  
  // Return original if format doesn't match
  return dateString;
}

/**
 * Formats a date range with proper formatting
 * @param startDate - Start date string
 * @param endDate - End date string
 * @param isCurrent - Whether currently working
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate?: string,
  endDate?: string,
  isCurrent?: boolean
): string {
  const start = formatDate(startDate);
  const end = isCurrent ? "Present" : formatDate(endDate);
  
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  
  return `${start} - ${end}`;
}
