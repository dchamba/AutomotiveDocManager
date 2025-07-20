import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  code: varchar("code", { length: 100 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product versions table
export const productVersions = pgTable("product_versions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  versionNumber: varchar("version_number", { length: 50 }).notNull(),
  versionDate: timestamp("version_date").notNull(),
  responsible: text("responsible").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Process phases table
export const processPhases = pgTable("process_phases", {
  id: serial("id").primaryKey(),
  productVersionId: integer("product_version_id").notNull().references(() => productVersions.id),
  phaseNumber: integer("phase_number").notNull(),
  phaseName: text("phase_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Flow charts table
export const flowCharts = pgTable("flow_charts", {
  id: serial("id").primaryKey(),
  productVersionId: integer("product_version_id").notNull().references(() => productVersions.id),
  name: text("name").notNull(),
  data: jsonb("data").notNull(), // React Flow data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// FMEA table
export const fmeas = pgTable("fmeas", {
  id: serial("id").primaryKey(),
  productVersionId: integer("product_version_id").notNull().references(() => productVersions.id),
  type: varchar("type", { length: 20 }).notNull(), // 'design' or 'process'
  standard: varchar("standard", { length: 20 }).notNull(), // 'aiag-vda-2019' or 'aiag-2008'
  name: text("name").notNull(),
  data: jsonb("data").notNull(), // FMEA table data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Control plans table
export const controlPlans = pgTable("control_plans", {
  id: serial("id").primaryKey(),
  productVersionId: integer("product_version_id").notNull().references(() => productVersions.id),
  name: text("name").notNull(),
  data: jsonb("data").notNull(), // Control plan table data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  client: one(clients, {
    fields: [products.clientId],
    references: [clients.id],
  }),
  versions: many(productVersions),
}));

export const productVersionsRelations = relations(productVersions, ({ one, many }) => ({
  product: one(products, {
    fields: [productVersions.productId],
    references: [products.id],
  }),
  processPhases: many(processPhases),
  flowCharts: many(flowCharts),
  fmeas: many(fmeas),
  controlPlans: many(controlPlans),
}));

export const processPhasesRelations = relations(processPhases, ({ one }) => ({
  productVersion: one(productVersions, {
    fields: [processPhases.productVersionId],
    references: [productVersions.id],
  }),
}));

export const flowChartsRelations = relations(flowCharts, ({ one }) => ({
  productVersion: one(productVersions, {
    fields: [flowCharts.productVersionId],
    references: [productVersions.id],
  }),
}));

export const fmeasRelations = relations(fmeas, ({ one }) => ({
  productVersion: one(productVersions, {
    fields: [fmeas.productVersionId],
    references: [productVersions.id],
  }),
}));

export const controlPlansRelations = relations(controlPlans, ({ one }) => ({
  productVersion: one(productVersions, {
    fields: [controlPlans.productVersionId],
    references: [productVersions.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertProductVersionSchema = createInsertSchema(productVersions).omit({
  id: true,
  createdAt: true,
});

export const insertProcessPhaseSchema = createInsertSchema(processPhases).omit({
  id: true,
  createdAt: true,
});

export const insertFlowChartSchema = createInsertSchema(flowCharts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFmeaSchema = createInsertSchema(fmeas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertControlPlanSchema = createInsertSchema(controlPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertProductVersion = z.infer<typeof insertProductVersionSchema>;
export type ProductVersion = typeof productVersions.$inferSelect;

export type InsertProcessPhase = z.infer<typeof insertProcessPhaseSchema>;
export type ProcessPhase = typeof processPhases.$inferSelect;

export type InsertFlowChart = z.infer<typeof insertFlowChartSchema>;
export type FlowChart = typeof flowCharts.$inferSelect;

export type InsertFmea = z.infer<typeof insertFmeaSchema>;
export type Fmea = typeof fmeas.$inferSelect;

export type InsertControlPlan = z.infer<typeof insertControlPlanSchema>;
export type ControlPlan = typeof controlPlans.$inferSelect;
