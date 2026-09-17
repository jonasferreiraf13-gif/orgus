import "server-only";
import { getRawDb } from "@/db";

export type Product = { id: number; line: string; brand: string; model: string; code: string; side: string; description: string; active: number; created_at: string; updated_at: string; image_key: string | null };
export type ProductImage = { id: number; object_key: string; filename: string; content_type: string; sort_order: number };
export type DocumentRecord = { id: number; type: string; title: string; object_key: string; filename: string; content_type: string; uploaded_at: string };
export type ContactMessage = { id: number; name: string; email: string; phone: string; message: string; status: string; created_at: string };

const productSelect = `SELECT p.*, (SELECT pi.object_key FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order, pi.id LIMIT 1) AS image_key FROM products p`;

export async function getPublicProducts(line: string): Promise<Product[]> {
  const result = await getRawDb().prepare(`${productSelect} WHERE p.line = ? AND p.active = 1 ORDER BY p.brand COLLATE NOCASE, p.model COLLATE NOCASE`).bind(line).all<Product>();
  return result.results;
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await getRawDb().prepare(`${productSelect} ORDER BY p.updated_at DESC`).all<Product>();
  return result.results;
}

export async function getProduct(id: number, includeInactive = false): Promise<{ product: Product; images: ProductImage[] } | null> {
  const product = await getRawDb().prepare(`${productSelect} WHERE p.id = ? ${includeInactive ? "" : "AND p.active = 1"}`).bind(id).first<Product>();
  if (!product) return null;
  const images = await getRawDb().prepare("SELECT id, object_key, filename, content_type, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order, id").bind(id).all<ProductImage>();
  return { product, images: images.results };
}

export async function getDocuments(type: "catalog" | "transparency"): Promise<DocumentRecord[]> {
  const result = await getRawDb().prepare("SELECT * FROM documents WHERE type = ? ORDER BY uploaded_at DESC").bind(type).all<DocumentRecord>();
  return result.results;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const result = await getRawDb().prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100").all<ContactMessage>();
  return result.results;
}

export async function getAllProductImages(): Promise<(ProductImage & { product_id: number })[]> {
  const result = await getRawDb().prepare("SELECT id, product_id, object_key, filename, content_type, sort_order FROM product_images ORDER BY product_id, sort_order, id").all<ProductImage & { product_id: number }>();
  return result.results;
}
