import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  line: text("line").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  code: text("code").notNull(),
  side: text("side").notNull(),
  description: text("description").notNull().default(""),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("idx_products_code_unique").on(table.code), index("idx_products_line_active_brand").on(table.line, table.active, table.brand)]);

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  objectKey: text("object_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [index("idx_product_images_product").on(table.productId, table.sortOrder)]);

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  objectKey: text("object_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
}, (table) => [index("idx_documents_type_date").on(table.type, table.uploadedAt)]);

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("novo"),
  createdAt: text("created_at").notNull(),
}, (table) => [index("idx_contact_messages_date").on(table.createdAt)]);

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("idx_admins_user_unique").on(table.userId)]);
