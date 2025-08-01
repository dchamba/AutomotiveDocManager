import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Plus, Package, Building2, FileText, Calendar, User, Edit, Eye } from "lucide-react";
import { clientsApi, productsApi, productVersionsApi, flowChartsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FlowEditor from "@/components/flowchart/flow-editor";
import type { Client, Product, ProductVersion, FlowChart } from "@shared/schema";

export default function FlowChart() {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [isNewFlowDialogOpen, setIsNewFlowDialogOpen] = useState(false);
  const [editingFlowChart, setEditingFlowChart] = useState<FlowChart | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { toast } = useToast();

  // Get all clients always
  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  // Get all products always  
  const { data: allProducts = [] } = useQuery({
    queryKey: ["/api/products/all"],
    queryFn: () => productsApi.getAll(),
  });

  // Get all versions always
  const { data: allVersions = [] } = useQuery({
    queryKey: ["/api/versions/all"],
    queryFn: async () => {
      const allVersionsPromises = allProducts.map(product => 
        productVersionsApi.getByProduct(product.id)
      );
      const results = await Promise.all(allVersionsPromises);
      return results.flat();
    },
    enabled: allProducts.length > 0,
  });

  // Filtered data for selections
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products", selectedClient],
    queryFn: () => selectedClient ? productsApi.getAll(selectedClient) : allProducts,
    enabled: !!selectedClient,
  });

  const { data: versions = [] } = useQuery({
    queryKey: ["/api/products", selectedProduct, "versions"],
    queryFn: () => selectedProduct ? productVersionsApi.getByProduct(selectedProduct) : Promise.resolve([]),
    enabled: !!selectedProduct,
  });

  const { data: flowCharts = [] } = useQuery({
    queryKey: ["/api/product-versions", selectedVersion, "flowcharts"],
    queryFn: () => selectedVersion ? flowChartsApi.getByVersion(selectedVersion) : Promise.resolve([]),
    enabled: !!selectedVersion,
  });

  // Get all flow charts with their context
  const { data: allFlowCharts = [], isLoading: allChartsLoading } = useQuery({
    queryKey: ["/api/flowcharts/all"],
    queryFn: async () => {
      // Ensure we have data first
      if (!allVersions.length || !allProducts.length || !clients.length) {
        return [];
      }
      
      // Get all flowcharts by getting all versions and their charts
      const allChartsPromises = allVersions.map(async (version) => {
        try {
          const charts = await flowChartsApi.getByVersion(version.id);
          const product = allProducts.find(p => p.id === version.productId);
          const client = clients.find(c => c.id === product?.clientId);
          return charts.map(chart => ({ 
            ...chart, 
            version, 
            product: product || { id: -1, code: 'N/A', description: 'N/A', clientId: -1, createdAt: new Date() }, 
            client: client || { id: -1, code: 'N/A', companyName: 'N/A', contactPerson: null, email: null, phone: null, address: null, createdAt: new Date() }
          }));
        } catch (error) {
          console.error('Error fetching charts for version:', version.id, error);
          return [];
        }
      });
      const results = await Promise.all(allChartsPromises);
      return results.flat();
    },
    enabled: allVersions.length > 0 && allProducts.length > 0 && clients.length > 0,
  });

  const createFlowChartMutation = useMutation({
    mutationFn: flowChartsApi.create,
    onSuccess: () => {
      toast({
        title: "Flow Chart creato",
        description: "Il flow chart è stato salvato con successo.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/product-versions", selectedVersion, "flowcharts"] });
      setIsNewFlowDialogOpen(false);
      setIsCreatingNew(false);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del flow chart.",
        variant: "destructive",
      });
    },
  });

  const updateFlowChartMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => flowChartsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: "Flow Chart aggiornato",
        description: "Il flow chart è stato aggiornato con successo.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/product-versions", selectedVersion, "flowcharts"] });
      setIsCreatingNew(false);
      setEditingFlowChart(null);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del flow chart.",
        variant: "destructive",
      });
    },
  });

  const handleSaveFlowChart = (flowData: any) => {
    if (!selectedVersion) {
      toast({
        title: "Errore",
        description: "Seleziona una versione prodotto prima di salvare.",
        variant: "destructive",
      });
      return;
    }

    const chartData = {
      productVersionId: selectedVersion,
      name: flowData.name,
      data: {
        nodes: flowData.nodes,
        edges: flowData.edges,
        processPhases: flowData.processPhases,
        viewport: flowData.viewport || { x: 0, y: 0, zoom: 1 },
      },
    };

    if (editingFlowChart) {
      // Update existing flow chart
      updateFlowChartMutation.mutate({
        id: editingFlowChart.id,
        data: chartData,
      });
    } else {
      // Create new flow chart
      createFlowChartMutation.mutate(chartData);
    }
  };

  const selectedClientData = clients.find(c => c.id === selectedClient);
  const selectedProductData = products.find(p => p.id === selectedProduct);
  const selectedVersionData = versions.find(v => v.id === selectedVersion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Flow Chart</h2>
          <p className="text-gray-600">Editor visuale per diagrammi di flusso del processo secondo standard AIAG-VDA</p>
        </div>
        <Dialog open={isNewFlowDialogOpen} onOpenChange={setIsNewFlowDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-automotive-blue hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Flow Chart
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Seleziona Versione Prodotto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Cliente</label>
                <Select onValueChange={(value) => {
                  setSelectedClient(parseInt(value));
                  setSelectedProduct(null);
                  setSelectedVersion(null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.companyName} ({client.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClient && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Prodotto</label>
                  <Select onValueChange={(value) => {
                    setSelectedProduct(parseInt(value));
                    setSelectedVersion(null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona prodotto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.code} - {product.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedProduct && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Versione</label>
                  <Select onValueChange={(value) => setSelectedVersion(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona versione" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map((version) => (
                        <SelectItem key={version.id} value={version.id.toString()}>
                          {version.versionNumber} - {new Date(version.versionDate).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewFlowDialogOpen(false)}>
                  Annulla
                </Button>
                <Button 
                  className="bg-automotive-blue hover:bg-blue-700"
                  disabled={!selectedVersion}
                  onClick={() => setIsNewFlowDialogOpen(false)}
                >
                  Inizia Flow Chart
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Default Flow Charts Table */}
      {!selectedVersion && !allChartsLoading && allFlowCharts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Tutti i Flow Chart</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Nome</th>
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Prodotto</th>
                    <th className="text-left p-2">Versione</th>
                    <th className="text-left p-2">Ultima Modifica</th>
                    <th className="text-left p-2">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {allFlowCharts.map((chart) => (
                    <tr key={chart.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{chart.name}</td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{chart.client.code}</Badge>
                          <span className="text-xs text-gray-600">{chart.client.companyName}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs">
                          <div className="font-medium">{chart.product.code}</div>
                          <div className="text-gray-500">{chart.product.description}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="secondary">{chart.version.versionNumber}</Badge>
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {new Date(chart.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if ('id' in chart.client && 'id' in chart.product) {
                                setSelectedClient(chart.client.id);
                                setSelectedProduct(chart.product.id);
                                setSelectedVersion(chart.version.id);
                                setEditingFlowChart(chart);
                              }
                            }}
                            className="h-7 px-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Context Information */}
      {selectedVersionData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{selectedClientData?.companyName}</span>
                  <Badge variant="outline" className="text-xs">{selectedClientData?.code}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">{selectedProductData?.code}</span>
                  <Badge variant="outline" className="text-xs">Ver. {selectedVersionData.versionNumber}</Badge>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Responsabile: {selectedVersionData.responsible}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow Charts List */}
      {selectedVersion && flowCharts.length > 0 && !isCreatingNew && !editingFlowChart && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Flow Chart Esistenti</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flowCharts.map((flowChart) => (
                <Card key={flowChart.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{flowChart.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingFlowChart(flowChart)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Creato: {new Date(flowChart.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Modificato: {new Date(flowChart.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 bg-automotive-blue hover:bg-blue-700"
                      onClick={() => setEditingFlowChart(flowChart)}
                    >
                      Apri Editor
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                onClick={() => setIsCreatingNew(true)}
                className="bg-automotive-orange hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Flow Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow Chart Editor */}
      {selectedVersion && (isCreatingNew || editingFlowChart) && (
        <Card className="min-h-screen">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>{editingFlowChart ? `Modifica: ${editingFlowChart.name}` : 'Nuovo Flow Chart'}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingFlowChart(null);
                }}
              >
                Torna alla Lista
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FlowEditor
              flowChartId={editingFlowChart?.id}
              productVersionId={selectedVersion}
              onSave={handleSaveFlowChart}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedVersion && flowCharts.length === 0 && !isCreatingNew && (
        <Card className="min-h-screen">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <span>Flow Chart</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun Flow Chart Trovato</h3>
              <p className="text-gray-600 mb-4">
                Non ci sono flow chart per questa versione del prodotto. Creane uno nuovo per iniziare.
              </p>
              <Button 
                onClick={() => setIsCreatingNew(true)}
                className="bg-automotive-blue hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crea Primo Flow Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {!selectedVersion && allChartsLoading && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-automotive-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento flow chart...</p>
            </div>
          </CardContent>
        </Card>
      )}



      {/* No Version Selected and No Flow Charts */}
      {!selectedVersion && !allChartsLoading && allFlowCharts.length === 0 && (
        <Card className="min-h-screen">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <span>Editor Flow Chart</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun Flow Chart Disponibile</h3>
              <p className="text-gray-600 mb-4">
                Non ci sono flow chart nel sistema. Crea il primo selezionando cliente, prodotto e versione.
              </p>
              <Button 
                onClick={() => setIsNewFlowDialogOpen(true)}
                className="bg-automotive-blue hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crea Primo Flow Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
