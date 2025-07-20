import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Building2 } from "lucide-react";
import { clientsApi, productsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ClientForm from "@/components/clients/client-form";
import type { Client } from "@shared/schema";

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  const deleteClientMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Cliente eliminato",
        description: "Il cliente è stato eliminato con successo.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del cliente.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = async (clientId: number) => {
    if (confirm("Sei sicuro di voler eliminare questo cliente?")) {
      deleteClientMutation.mutate(clientId);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedClient(undefined);
    queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Anagrafica Clienti</h2>
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
          <h2 className="text-2xl font-semibold text-gray-900">Anagrafica Clienti</h2>
          <p className="text-gray-600">Gestione clienti e informazioni di contatto</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-automotive-blue hover:bg-blue-700"
              onClick={() => setSelectedClient(undefined)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedClient ? "Modifica Cliente" : "Nuovo Cliente"}
              </DialogTitle>
            </DialogHeader>
            <ClientForm 
              client={selectedClient} 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Clienti ({clients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun cliente trovato</h3>
              <p className="text-gray-600 mb-4">Inizia aggiungendo il tuo primo cliente</p>
              <Button 
                className="bg-automotive-blue hover:bg-blue-700"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Cliente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codice</TableHead>
                  <TableHead>Ragione Sociale</TableHead>
                  <TableHead>Contatto</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.code}</TableCell>
                    <TableCell>{client.companyName}</TableCell>
                    <TableCell>{client.contactPerson || "-"}</TableCell>
                    <TableCell>{client.email || "-"}</TableCell>
                    <TableCell>{client.phone || "-"}</TableCell>
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
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                          disabled={deleteClientMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
