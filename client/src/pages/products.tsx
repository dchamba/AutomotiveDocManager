import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Building2, Calendar, User } from "lucide-react";
import { clientsApi, productsApi, productVersionsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import ProductForm from "@/components/products/product-form";
import VersionForm from "@/components/products/version-form";
import type { Product, ProductVersion, Client } from "@shared/schema";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedVersion, setSelectedVersion] = useState<ProductVersion | undefined>();
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isVersionFormOpen, setIsVersionFormOpen] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: () => productsApi.getAll(),
  });

  const clientsMap = new Map(clients.map(client => [client.id, client]));

  const handleProductFormSuccess = () => {
    setIsProductFormOpen(false);
    setSelectedProduct(undefined);
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  };

  const handleVersionFormSuccess = () => {
    setIsVersionFormOpen(false);
    setSelectedVersion(undefined);
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Catalogo Prodotti</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Catalogo Prodotti</h2>
          <p className="text-gray-600">Gestione prodotti e versioni collegate ai clienti</p>
        </div>
        <div className="space-x-2">
          <Dialog open={isVersionFormOpen} onOpenChange={setIsVersionFormOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                onClick={() => setSelectedVersion(undefined)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Nuova Versione
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedVersion ? "Modifica Versione" : "Nuova Versione"}
                </DialogTitle>
              </DialogHeader>
              <VersionForm 
                version={selectedVersion} 
                products={products}
                onSuccess={handleVersionFormSuccess}
                onCancel={() => setIsVersionFormOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-automotive-blue hover:bg-blue-700"
                onClick={() => setSelectedProduct(undefined)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Prodotto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm 
                product={selectedProduct} 
                clients={clients}
                onSuccess={handleProductFormSuccess}
                onCancel={() => setIsProductFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Prodotti ({products.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun prodotto trovato</h3>
              <p className="text-gray-600 mb-4">Inizia aggiungendo il tuo primo prodotto</p>
              <Button 
                className="bg-automotive-blue hover:bg-blue-700"
                onClick={() => setIsProductFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Prodotto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Codice Prodotto</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Versioni</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const client = clientsMap.get(product.clientId);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-automotive-blue bg-opacity-10 rounded-full flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-automotive-blue" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{client?.companyName || "Cliente non trovato"}</div>
                            <div className="text-xs text-gray-500">{client?.code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.code}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // TODO: Show versions for this product
                          }}
                        >
                          Visualizza versioni
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-automotive-success bg-opacity-10 text-automotive-success">
                          Attivo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsProductFormOpen(true);
                            }}
                          >
                            Modifica
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
