import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, insertProductSchema, insertProductVersionSchema, 
  insertProcessPhaseSchema, insertFlowChartSchema, insertFmeaSchema, insertControlPlanSchema,
  type InsertProductVersion
} from "@shared/schema";
import { z } from "zod";

// Server-side schema that accepts string dates
const serverProductVersionSchema = z.object({
  productId: z.number(),
  versionNumber: z.string(),
  versionDate: z.string(),
  responsible: z.string(),
  description: z.string().optional().nullable(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, validatedData);
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { clientId } = req.query;
      let products;
      if (clientId) {
        products = await storage.getProductsByClient(parseInt(clientId as string));
      } else {
        products = await storage.getProducts();
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product Versions routes
  app.get("/api/products/:productId/versions", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const versions = await storage.getProductVersions(productId);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product versions" });
    }
  });

  app.get("/api/product-versions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const version = await storage.getProductVersion(id);
      if (!version) {
        return res.status(404).json({ message: "Product version not found" });
      }
      res.json(version);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product version" });
    }
  });

  app.post("/api/product-versions", async (req, res) => {
    try {
      console.log("Received product version data:", req.body);
      const validatedData = serverProductVersionSchema.parse(req.body);
      
      // Convert string date to Date object for database
      const versionData = {
        ...validatedData,
        versionDate: new Date(validatedData.versionDate)
      };
      
      const version = await storage.createProductVersion(versionData);
      res.status(201).json(version);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid version data", errors: error.errors });
      }
      console.log("Server error:", error);
      res.status(500).json({ message: "Failed to create product version" });
    }
  });

  app.put("/api/product-versions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = serverProductVersionSchema.partial().parse(req.body);
      
      // Convert string date to Date object if present
      const versionData: any = validatedData.versionDate ? {
        ...validatedData,
        versionDate: new Date(validatedData.versionDate)
      } : validatedData;
      
      const version = await storage.updateProductVersion(id, versionData);
      res.json(version);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid version data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product version" });
    }
  });

  app.delete("/api/product-versions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProductVersion(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product version" });
    }
  });

  // Process Phases routes
  app.get("/api/product-versions/:versionId/phases", async (req, res) => {
    try {
      const versionId = parseInt(req.params.versionId);
      const phases = await storage.getProcessPhases(versionId);
      res.json(phases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch process phases" });
    }
  });

  app.post("/api/process-phases", async (req, res) => {
    try {
      const validatedData = insertProcessPhaseSchema.parse(req.body);
      const phase = await storage.createProcessPhase(validatedData);
      res.status(201).json(phase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid phase data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create process phase" });
    }
  });

  app.put("/api/process-phases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProcessPhaseSchema.partial().parse(req.body);
      const phase = await storage.updateProcessPhase(id, validatedData);
      res.json(phase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid phase data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update process phase" });
    }
  });

  app.delete("/api/process-phases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProcessPhase(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete process phase" });
    }
  });

  // Flow Charts routes
  app.get("/api/product-versions/:versionId/flowcharts", async (req, res) => {
    try {
      const versionId = parseInt(req.params.versionId);
      const flowCharts = await storage.getFlowCharts(versionId);
      res.json(flowCharts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flow charts" });
    }
  });

  app.get("/api/flowcharts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const flowChart = await storage.getFlowChart(id);
      if (!flowChart) {
        return res.status(404).json({ message: "Flow chart not found" });
      }
      res.json(flowChart);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flow chart" });
    }
  });

  app.post("/api/flowcharts", async (req, res) => {
    try {
      const validatedData = insertFlowChartSchema.parse(req.body);
      const flowChart = await storage.createFlowChart(validatedData);
      res.status(201).json(flowChart);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid flow chart data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create flow chart" });
    }
  });

  app.put("/api/flowcharts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFlowChartSchema.partial().parse(req.body);
      const flowChart = await storage.updateFlowChart(id, validatedData);
      res.json(flowChart);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid flow chart data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update flow chart" });
    }
  });

  app.delete("/api/flowcharts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFlowChart(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete flow chart" });
    }
  });

  // FMEA routes
  app.get("/api/product-versions/:versionId/fmeas", async (req, res) => {
    try {
      const versionId = parseInt(req.params.versionId);
      const fmeas = await storage.getFmeas(versionId);
      res.json(fmeas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FMEAs" });
    }
  });

  app.get("/api/fmeas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const fmea = await storage.getFmea(id);
      if (!fmea) {
        return res.status(404).json({ message: "FMEA not found" });
      }
      res.json(fmea);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FMEA" });
    }
  });

  app.post("/api/fmeas", async (req, res) => {
    try {
      const validatedData = insertFmeaSchema.parse(req.body);
      const fmea = await storage.createFmea(validatedData);
      res.status(201).json(fmea);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid FMEA data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create FMEA" });
    }
  });

  app.put("/api/fmeas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFmeaSchema.partial().parse(req.body);
      const fmea = await storage.updateFmea(id, validatedData);
      res.json(fmea);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid FMEA data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update FMEA" });
    }
  });

  app.delete("/api/fmeas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFmea(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete FMEA" });
    }
  });

  // Control Plans routes
  app.get("/api/product-versions/:versionId/control-plans", async (req, res) => {
    try {
      const versionId = parseInt(req.params.versionId);
      const controlPlans = await storage.getControlPlans(versionId);
      res.json(controlPlans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch control plans" });
    }
  });

  app.get("/api/control-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const controlPlan = await storage.getControlPlan(id);
      if (!controlPlan) {
        return res.status(404).json({ message: "Control plan not found" });
      }
      res.json(controlPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch control plan" });
    }
  });

  app.post("/api/control-plans", async (req, res) => {
    try {
      const validatedData = insertControlPlanSchema.parse(req.body);
      const controlPlan = await storage.createControlPlan(validatedData);
      res.status(201).json(controlPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid control plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create control plan" });
    }
  });

  app.put("/api/control-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertControlPlanSchema.partial().parse(req.body);
      const controlPlan = await storage.updateControlPlan(id, validatedData);
      res.json(controlPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid control plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update control plan" });
    }
  });

  app.delete("/api/control-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteControlPlan(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete control plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
