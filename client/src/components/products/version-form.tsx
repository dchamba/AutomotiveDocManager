import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productVersionsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { insertProductVersionSchema, type ProductVersion, type InsertProductVersion, type Product } from "@shared/schema";

// Form schema that accepts string dates and handles null descriptions
const versionFormSchema = insertProductVersionSchema.extend({
  versionDate: z.string().min(1, "Data versione è obbligatoria"),
  description: z.string().nullable().optional().transform((val) => val || ""),
});

type VersionFormData = z.infer<typeof versionFormSchema>;

interface VersionFormProps {
  version?: ProductVersion;
  products: Product[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VersionForm({ version, products, onSuccess, onCancel }: VersionFormProps) {
  const { toast } = useToast();
  
  const form = useForm<VersionFormData>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: {
      productId: version?.productId || 0,
      versionNumber: version?.versionNumber || "",
      versionDate: version?.versionDate ? new Date(version.versionDate).toISOString().split('T')[0] : "",
      responsible: version?.responsible || "",
      description: version?.description || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: productVersionsApi.create,
    onSuccess: () => {
      toast({
        title: "Versione creata",
        description: "La versione è stata creata con successo.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione della versione.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProductVersion> }) =>
      productVersionsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: "Versione aggiornata",
        description: "La versione è stata aggiornata con successo.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento della versione.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VersionFormData) => {
    // Transform the form data to match the API expectations
    const submissionData: InsertProductVersion = {
      productId: data.productId,
      versionNumber: data.versionNumber,
      versionDate: new Date(data.versionDate), // Convert string to Date
      responsible: data.responsible,
      description: data.description,
    };

    if (version) {
      updateMutation.mutate({ id: version.id, data: submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prodotto *</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un prodotto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.code} - {product.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="versionNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero Versione *</FormLabel>
                <FormControl>
                  <Input placeholder="V1.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="versionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Versione *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsabile *</FormLabel>
              <FormControl>
                <Input placeholder="Nome responsabile" {...field} />
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
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrizione delle modifiche di questa versione"
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
            {isLoading ? "Salvando..." : version ? "Aggiorna" : "Crea"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
