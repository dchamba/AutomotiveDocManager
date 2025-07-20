import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { insertProductSchema, type Product, type InsertProduct, type Client } from "@shared/schema";

interface ProductFormProps {
  product?: Product;
  clients: Client[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, clients, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      clientId: product?.clientId || 0,
      code: product?.code || "",
      description: product?.description || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      toast({
        title: "Prodotto creato",
        description: "Il prodotto è stato creato con successo.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del prodotto.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProduct> }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: "Prodotto aggiornato",
        description: "Il prodotto è stato aggiornato con successo.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del prodotto.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    if (product) {
      updateMutation.mutate({ id: product.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente *</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.companyName} ({client.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice Prodotto *</FormLabel>
              <FormControl>
                <Input placeholder="PRD-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrizione del prodotto"
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
            {isLoading ? "Salvando..." : product ? "Aggiorna" : "Crea"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
