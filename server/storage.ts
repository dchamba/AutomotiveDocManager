import { 
  users, clients, products, productVersions, processPhases, flowCharts, fmeas, controlPlans,
  type User, type InsertUser, type Client, type InsertClient, type Product, type InsertProduct,
  type ProductVersion, type InsertProductVersion, type ProcessPhase, type InsertProcessPhase,
  type FlowChart, type InsertFlowChart, type Fmea, type InsertFmea, 
  type ControlPlan, type InsertControlPlan
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByClient(clientId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Product Versions
  getProductVersions(productId: number): Promise<ProductVersion[]>;
  getProductVersion(id: number): Promise<ProductVersion | undefined>;
  createProductVersion(version: InsertProductVersion): Promise<ProductVersion>;
  updateProductVersion(id: number, version: Partial<InsertProductVersion>): Promise<ProductVersion>;
  deleteProductVersion(id: number): Promise<void>;

  // Process Phases
  getProcessPhases(productVersionId: number): Promise<ProcessPhase[]>;
  createProcessPhase(phase: InsertProcessPhase): Promise<ProcessPhase>;
  updateProcessPhase(id: number, phase: Partial<InsertProcessPhase>): Promise<ProcessPhase>;
  deleteProcessPhase(id: number): Promise<void>;

  // Flow Charts
  getFlowCharts(productVersionId: number): Promise<FlowChart[]>;
  getFlowChart(id: number): Promise<FlowChart | undefined>;
  createFlowChart(flowChart: InsertFlowChart): Promise<FlowChart>;
  updateFlowChart(id: number, flowChart: Partial<InsertFlowChart>): Promise<FlowChart>;
  deleteFlowChart(id: number): Promise<void>;

  // FMEAs
  getFmeas(productVersionId: number): Promise<Fmea[]>;
  getFmea(id: number): Promise<Fmea | undefined>;
  createFmea(fmea: InsertFmea): Promise<Fmea>;
  updateFmea(id: number, fmea: Partial<InsertFmea>): Promise<Fmea>;
  deleteFmea(id: number): Promise<void>;

  // Control Plans
  getControlPlans(productVersionId: number): Promise<ControlPlan[]>;
  getControlPlan(id: number): Promise<ControlPlan | undefined>;
  createControlPlan(controlPlan: InsertControlPlan): Promise<ControlPlan>;
  updateControlPlan(id: number, controlPlan: Partial<InsertControlPlan>): Promise<ControlPlan>;
  deleteControlPlan(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const [updatedClient] = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByClient(clientId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.clientId, clientId)).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Product Versions
  async getProductVersions(productId: number): Promise<ProductVersion[]> {
    return await db.select().from(productVersions).where(eq(productVersions.productId, productId)).orderBy(desc(productVersions.versionDate));
  }

  async getProductVersion(id: number): Promise<ProductVersion | undefined> {
    const [version] = await db.select().from(productVersions).where(eq(productVersions.id, id));
    return version || undefined;
  }

  async createProductVersion(version: InsertProductVersion): Promise<ProductVersion> {
    const [newVersion] = await db.insert(productVersions).values(version).returning();
    return newVersion;
  }

  async updateProductVersion(id: number, version: Partial<InsertProductVersion>): Promise<ProductVersion> {
    const [updatedVersion] = await db.update(productVersions).set(version).where(eq(productVersions.id, id)).returning();
    return updatedVersion;
  }

  async deleteProductVersion(id: number): Promise<void> {
    await db.delete(productVersions).where(eq(productVersions.id, id));
  }

  // Process Phases
  async getProcessPhases(productVersionId: number): Promise<ProcessPhase[]> {
    return await db.select().from(processPhases).where(eq(processPhases.productVersionId, productVersionId)).orderBy(processPhases.phaseNumber);
  }

  async createProcessPhase(phase: InsertProcessPhase): Promise<ProcessPhase> {
    const [newPhase] = await db.insert(processPhases).values(phase).returning();
    return newPhase;
  }

  async updateProcessPhase(id: number, phase: Partial<InsertProcessPhase>): Promise<ProcessPhase> {
    const [updatedPhase] = await db.update(processPhases).set(phase).where(eq(processPhases.id, id)).returning();
    return updatedPhase;
  }

  async deleteProcessPhase(id: number): Promise<void> {
    await db.delete(processPhases).where(eq(processPhases.id, id));
  }

  // Flow Charts
  async getFlowCharts(productVersionId: number): Promise<FlowChart[]> {
    return await db.select().from(flowCharts).where(eq(flowCharts.productVersionId, productVersionId)).orderBy(desc(flowCharts.updatedAt));
  }

  async getFlowChart(id: number): Promise<FlowChart | undefined> {
    const [flowChart] = await db.select().from(flowCharts).where(eq(flowCharts.id, id));
    return flowChart || undefined;
  }

  async createFlowChart(flowChart: InsertFlowChart): Promise<FlowChart> {
    const [newFlowChart] = await db.insert(flowCharts).values(flowChart).returning();
    return newFlowChart;
  }

  async updateFlowChart(id: number, flowChart: Partial<InsertFlowChart>): Promise<FlowChart> {
    const now = new Date();
    const [updatedFlowChart] = await db.update(flowCharts).set({ ...flowChart, updatedAt: now }).where(eq(flowCharts.id, id)).returning();
    return updatedFlowChart;
  }

  async deleteFlowChart(id: number): Promise<void> {
    await db.delete(flowCharts).where(eq(flowCharts.id, id));
  }

  // FMEAs
  async getFmeas(productVersionId: number): Promise<Fmea[]> {
    return await db.select().from(fmeas).where(eq(fmeas.productVersionId, productVersionId)).orderBy(desc(fmeas.updatedAt));
  }

  async getFmea(id: number): Promise<Fmea | undefined> {
    const [fmea] = await db.select().from(fmeas).where(eq(fmeas.id, id));
    return fmea || undefined;
  }

  async createFmea(fmea: InsertFmea): Promise<Fmea> {
    const [newFmea] = await db.insert(fmeas).values(fmea).returning();
    return newFmea;
  }

  async updateFmea(id: number, fmea: Partial<InsertFmea>): Promise<Fmea> {
    const now = new Date();
    const [updatedFmea] = await db.update(fmeas).set({ ...fmea, updatedAt: now }).where(eq(fmeas.id, id)).returning();
    return updatedFmea;
  }

  async deleteFmea(id: number): Promise<void> {
    await db.delete(fmeas).where(eq(fmeas.id, id));
  }

  // Control Plans
  async getControlPlans(productVersionId: number): Promise<ControlPlan[]> {
    return await db.select().from(controlPlans).where(eq(controlPlans.productVersionId, productVersionId)).orderBy(desc(controlPlans.updatedAt));
  }

  async getControlPlan(id: number): Promise<ControlPlan | undefined> {
    const [controlPlan] = await db.select().from(controlPlans).where(eq(controlPlans.id, id));
    return controlPlan || undefined;
  }

  async createControlPlan(controlPlan: InsertControlPlan): Promise<ControlPlan> {
    const [newControlPlan] = await db.insert(controlPlans).values(controlPlan).returning();
    return newControlPlan;
  }

  async updateControlPlan(id: number, controlPlan: Partial<InsertControlPlan>): Promise<ControlPlan> {
    const now = new Date();
    const [updatedControlPlan] = await db.update(controlPlans).set({ ...controlPlan, updatedAt: now }).where(eq(controlPlans.id, id)).returning();
    return updatedControlPlan;
  }

  async deleteControlPlan(id: number): Promise<void> {
    await db.delete(controlPlans).where(eq(controlPlans.id, id));
  }
}

export const storage = new DatabaseStorage();
