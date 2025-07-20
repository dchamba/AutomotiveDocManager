import { apiRequest } from "./queryClient";
import type { 
  Client, InsertClient, Product, InsertProduct, 
  ProductVersion, InsertProductVersion, ProcessPhase, InsertProcessPhase,
  FlowChart, InsertFlowChart, Fmea, InsertFmea, 
  ControlPlan, InsertControlPlan 
} from "@shared/schema";

// Clients API
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const response = await apiRequest("GET", "/api/clients");
    return response.json();
  },
  
  getById: async (id: number): Promise<Client> => {
    const response = await apiRequest("GET", `/api/clients/${id}`);
    return response.json();
  },
  
  create: async (client: InsertClient): Promise<Client> => {
    const response = await apiRequest("POST", "/api/clients", client);
    return response.json();
  },
  
  update: async (id: number, client: Partial<InsertClient>): Promise<Client> => {
    const response = await apiRequest("PUT", `/api/clients/${id}`, client);
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/clients/${id}`);
  },
};

// Products API
export const productsApi = {
  getAll: async (clientId?: number): Promise<Product[]> => {
    const url = clientId ? `/api/products?clientId=${clientId}` : "/api/products";
    const response = await apiRequest("GET", url);
    return response.json();
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await apiRequest("GET", `/api/products/${id}`);
    return response.json();
  },
  
  create: async (product: InsertProduct): Promise<Product> => {
    const response = await apiRequest("POST", "/api/products", product);
    return response.json();
  },
  
  update: async (id: number, product: Partial<InsertProduct>): Promise<Product> => {
    const response = await apiRequest("PUT", `/api/products/${id}`, product);
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/products/${id}`);
  },
};

// Product Versions API
export const productVersionsApi = {
  getByProduct: async (productId: number): Promise<ProductVersion[]> => {
    const response = await apiRequest("GET", `/api/products/${productId}/versions`);
    return response.json();
  },
  
  getById: async (id: number): Promise<ProductVersion> => {
    const response = await apiRequest("GET", `/api/product-versions/${id}`);
    return response.json();
  },
  
  create: async (version: InsertProductVersion): Promise<ProductVersion> => {
    const response = await apiRequest("POST", "/api/product-versions", version);
    return response.json();
  },
  
  update: async (id: number, version: Partial<InsertProductVersion>): Promise<ProductVersion> => {
    const response = await apiRequest("PUT", `/api/product-versions/${id}`, version);
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/product-versions/${id}`);
  },
};

// Process Phases API
export const processPhasesApi = {
  getByVersion: async (versionId: number): Promise<ProcessPhase[]> => {
    const response = await apiRequest("GET", `/api/product-versions/${versionId}/phases`);
    return response.json();
  },
  
  create: async (phase: InsertProcessPhase): Promise<ProcessPhase> => {
    const response = await apiRequest("POST", "/api/process-phases", phase);
    return response.json();
  },
  
  update: async (id: number, phase: Partial<InsertProcessPhase>): Promise<ProcessPhase> => {
    const response = await apiRequest("PUT", `/api/process-phases/${id}`, phase);
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/process-phases/${id}`);
  },
};

// Flow Charts API
export const flowChartsApi = {
  getByVersion: async (versionId: number): Promise<FlowChart[]> => {
    const response = await apiRequest("GET", `/api/product-versions/${versionId}/flowcharts`);
    return response.json();
  },
  
  getById: async (id: number): Promise<FlowChart> => {
    const response = await apiRequest("GET", `/api/flowcharts/${id}`);
    return response.json();
  },
  
  create: async (flowChart: InsertFlowChart): Promise<FlowChart> => {
    const response = await apiRequest("POST", "/api/flowcharts", flowChart);
    return response.json();
  },
  
  update: async (id: number, flowChart: Partial<InsertFlowChart>): Promise<FlowChart> => {
    const response = await apiRequest("PUT", `/api/flowcharts/${id}`, flowChart);
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/flowcharts/${id}`);
  },
};

// FMEAs API
export const fmeasApi = {
  getByVersion: async (versionId: number): Promise<Fmea[]> => {
    const response = await apiRequest("GET", `/api/product-versions/${versionId}/fmeas`);
    return response.json();
  },
  
  getById: async (id: number): Promise<Fmea> => {
    const response = await apiRequest("GET", `/api/fmeas/${id}`);
    return response.json();
  },
  
  create: async (fmea: InsertFmea): Promise<Fmea> => {
    const response = await apiRequest("POST", "/api/fmeas", fmea);
    return response.json();
  },
  
  update: async (id: number, fmea: Partial<InsertFmea>): Promise<Fmea> => {
    const response = await apiRequest("PUT", `/api/fmeas/${id}`, fmea);
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/fmeas/${id}`);
  },
};

// Control Plans API
export const controlPlansApi = {
  getByVersion: async (versionId: number): Promise<ControlPlan[]> => {
    const response = await apiRequest("GET", `/api/product-versions/${versionId}/control-plans`);
    return response.json();
  },
  
  getById: async (id: number): Promise<ControlPlan> => {
    const response = await apiRequest("GET", `/api/control-plans/${id}`);
    return response.json();
  },
  
  create: async (controlPlan: InsertControlPlan): Promise<ControlPlan> => {
    const response = await apiRequest("POST", "/api/control-plans", controlPlan);
    return response.json();
  },
  
  update: async (id: number, controlPlan: Partial<InsertControlPlan>): Promise<ControlPlan> => {
    const response = await apiRequest("PUT", `/api/control-plans/${id}`, controlPlan);
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/control-plans/${id}`);
  },
};
