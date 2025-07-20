import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { clientsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { insertClientSchema, type Client, type InsertClient } from "@shared/schema";

interface ClientFormProps {
  client?: Client;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      code: client?.code || "",
      companyName: client?.companyName || "",
      contactPerson: client?.contactPerson || "",
      email: client?.email || "",
      phone: client?.phone || "",
      address: client?.address || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      toast({
        title: "Cliente creato",
        description: "Il cliente è stato creato con successo.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del cliente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertClient> }) =>
      clientsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: "Cliente aggiornato",
        description: "Il cliente è stato aggiornato con successo.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del cliente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertClient) => {
    if (client) {
      updateMutation.mutate({ id: client.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codice Cliente *</FormLabel>
                <FormControl>
                  <Input placeholder="CLI-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ragione Sociale *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome azienda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persona di Contatto</FormLabel>
                <FormControl>
                  <Input placeholder="Nome contatto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefono</FormLabel>
              <FormControl>
                <Input placeholder="+39 XXX XXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indirizzo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Indirizzo completo"
                  className="resize-none"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-automotive-blue hover:bg-blue-700"
          >
            {isLoading ? "Salvando..." : client ? "Aggiorna" : "Crea"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
