import type { CustomiseFormData, Fabric, Product } from '../types';

export function buildProductMessage(product: Product, data: CustomiseFormData): string {
  const lines = [
    `Hello! I'd like to customise / buy this product:`,
    ``,
    `*Product:* ${product.name}`,
    `*Product ID:* ${product.code || product.id}`,
    product.type ? `*Type:* ${product.type}` : '',
    ``,
    `*My Name:* ${data.name}`,
    `*My Phone:* ${data.phone}`,
    `*How I want it:* ${data.details}`,
  ].filter(Boolean);
  return lines.join('\n');
}

export function buildFabricMessage(fabric: Fabric, garment: string, data: CustomiseFormData): string {
  const lines = [
    `Hello! I'd like to customise this fabric into a garment.`,
    ``,
    `*Fabric:* ${fabric.name}`,
    `*Fabric ID:* ${fabric.code || fabric.id}`,
    `*Make into:* ${garment}`,
    ``,
    `*My Name:* ${data.name}`,
    `*My Phone:* ${data.phone}`,
    `*How I want it:* ${data.details}`,
  ].filter(Boolean);
  return lines.join('\n');
}

export function sendToWhatsApp(whatsappNumber: string, message: string) {
  const clean = (whatsappNumber || '').replace(/[^0-9]/g, '');
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openWhatsAppChat(whatsappNumber: string) {
  const clean = (whatsappNumber || '').replace(/[^0-9]/g, '');
  window.open(`https://wa.me/${clean}`, '_blank', 'noopener,noreferrer');
}
