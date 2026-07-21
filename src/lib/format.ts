export function formatPrice(price: number | null | undefined): string {
  if (price == null) return '';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}
