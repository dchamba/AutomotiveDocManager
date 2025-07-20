import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clientsApi, productsApi } from "@/lib/api";
import { Plus, Building2, Package, BarChart, FileSpreadsheet, 
         GitBranch, Eye, Edit, CheckCircle, Clock, AlertTriangle, 
         XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DashboardStats, Activity, DocumentStatus } from "@/types";

export default function Dashboard() {
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: () => productsApi.getAll(),
  });

  const stats: DashboardStats = {
    activeClients: clients.length,
    products: products.length,
    fmeaActive: 42, // This would come from actual FMEA data
    controlPlans: 38, // This would come from actual Control Plan data
  };

  const recentActivities: Activity[] = [
    {
      id: "1",
      type: "edit",
      title: "FMEA P001-V3",
      description: "aggiornata da Marco Bianchi",
      timestamp: "2 ore fa",
      icon: "edit"
    },
    {
      id: "2", 
      type: "approve",
      title: "Control Plan CP-ABC-001",
      description: "approvato",
      timestamp: "4 ore fa",
      icon: "check_circle"
    },
    {
      id: "3",
      type: "create",
      title: "Nuovo prodotto P-DEF-456 V1",
      description: "creato per cliente esempio",
      timestamp: "1 giorno fa",
      icon: "add"
    },
    {
      id: "4",
      type: "warning",
      title: "FMEA F-123-V2",
      description: "richiede revisione",
      timestamp: "2 giorni fa", 
      icon: "warning"
    }
  ];

  const documentStatus: DocumentStatus = {
    approved: 78,
    inReview: 12,
    draft: 8,
    expired: 3
  };

  if (clientsLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Gestione documenti secondo standard AIAG-VDA</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Gestione documenti secondo standard AIAG-VDA</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clienti Attivi</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeClients}</p>
              </div>
              <div className="w-12 h-12 bg-automotive-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-automotive-blue" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-automotive-success">+2.5%</span>
              <span className="text-gray-500 ml-2">vs ultimo mese</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prodotti</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.products}</p>
              </div>
              <div className="w-12 h-12 bg-automotive-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-automotive-orange" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-automotive-success">+12</span>
              <span className="text-gray-500 ml-2">nuovi questo mese</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">FMEA Attive</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.fmeaActive}</p>
              </div>
              <div className="w-12 h-12 bg-automotive-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <BarChart className="h-6 w-6 text-automotive-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-automotive-warning">8</span>
              <span className="text-gray-500 ml-2">in revisione</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Control Plan</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.controlPlans}</p>
              </div>
              <div className="w-12 h-12 bg-automotive-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-automotive-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-automotive-success">95%</span>
              <span className="text-gray-500 ml-2">conformità</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Attività Recenti</h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-automotive-blue bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'edit' && <Edit className="h-4 w-4 text-automotive-blue" />}
                    {activity.type === 'approve' && <CheckCircle className="h-4 w-4 text-automotive-success" />}
                    {activity.type === 'create' && <Plus className="h-4 w-4 text-automotive-orange" />}
                    {activity.type === 'warning' && <AlertTriangle className="h-4 w-4 text-automotive-warning" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.title}</span> {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Status Overview */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Stato Documenti</h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-automotive-success rounded-full"></div>
                  <span className="text-sm text-gray-900">Documenti Approvati</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{documentStatus.approved}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-automotive-warning rounded-full"></div>
                  <span className="text-sm text-gray-900">In Revisione</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{documentStatus.inReview}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-900">Bozze</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{documentStatus.draft}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-automotive-error rounded-full"></div>
                  <span className="text-sm text-gray-900">Scaduti</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{documentStatus.expired}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Azioni Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center space-x-3 p-4 h-auto border border-gray-200 hover:border-automotive-blue hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-automotive-blue bg-opacity-10 group-hover:bg-automotive-blue group-hover:bg-opacity-20 rounded-lg flex items-center justify-center">
                <BarChart className="h-5 w-5 text-automotive-blue" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Nuova FMEA</div>
                <div className="text-sm text-gray-500">Crea analisi AIAG-VDA</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center space-x-3 p-4 h-auto border border-gray-200 hover:border-automotive-blue hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-automotive-success bg-opacity-10 group-hover:bg-automotive-success group-hover:bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-automotive-success" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Nuovo Control Plan</div>
                <div className="text-sm text-gray-500">Definisci controlli qualità</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center space-x-3 p-4 h-auto border border-gray-200 hover:border-automotive-blue hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 bg-automotive-orange bg-opacity-10 group-hover:bg-automotive-orange group-hover:bg-opacity-20 rounded-lg flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-automotive-orange" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Nuovo Flow Chart</div>
                <div className="text-sm text-gray-500">Disegna processo</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
