import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Info } from "lucide-react";

const phaseSchema = z.object({
  phaseNumber: z.number().min(1).max(999),
  phaseName: z.string().min(1, 'Il nome della fase è obbligatorio'),
  description: z.string().min(1, 'La descrizione è obbligatoria'),
});

type PhaseFormData = z.infer<typeof phaseSchema>;

interface ProcessPhase {
  id: string;
  phaseNumber: number;
  phaseName: string;
  description: string;
  nodeId: string;
}

interface PhaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ProcessPhase, 'id' | 'nodeId'>) => void;
  phase?: ProcessPhase | null;
  existingPhases: ProcessPhase[];
}

export default function PhaseDialog({ isOpen, onClose, onSave, phase, existingPhases }: PhaseDialogProps) {
  const [suggestedNumber, setSuggestedNumber] = useState(1);

  const form = useForm<PhaseFormData>({
    resolver: zodResolver(phaseSchema),
    defaultValues: {
      phaseNumber: phase?.phaseNumber || 1,
      phaseName: phase?.phaseName || '',
      description: phase?.description || '',
    },
  });

  // Calculate next available phase number
  useEffect(() => {
    if (!phase) {
      const usedNumbers = existingPhases.map(p => p.phaseNumber);
      let nextNumber = 10; // Start with 10 (common in automotive processes)
      
      while (usedNumbers.includes(nextNumber)) {
        nextNumber += 10;
      }
      
      setSuggestedNumber(nextNumber);
      form.setValue('phaseNumber', nextNumber);
    }
  }, [existingPhases, phase, form]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (phase) {
        form.reset({
          phaseNumber: phase.phaseNumber,
          phaseName: phase.phaseName,
          description: phase.description,
        });
      } else {
        form.reset({
          phaseNumber: suggestedNumber,
          phaseName: '',
          description: '',
        });
      }
    }
  }, [isOpen, phase, suggestedNumber, form]);

  const onSubmit = (data: PhaseFormData) => {
    onSave(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isPhaseNumberUsed = (number: number): boolean => {
    return existingPhases.some(p => p.phaseNumber === number && p.nodeId !== phase?.nodeId);
  };

  const phaseNumber = form.watch('phaseNumber');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{phase ? 'Modifica Fase Processo' : 'Definisci Fase Processo'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium mb-2">Informazioni Importanti</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Le fasi definite qui saranno automaticamente incluse nelle tabelle FMEA e Control Plan</li>
                  <li>• Si consiglia di usare numeri come 10, 20, 30... per facilitare inserimenti futuri</li>
                  <li>• Ogni fase rappresenta un passaggio critico del processo produttivo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Existing phases overview */}
          {existingPhases.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Fasi Esistenti:</h4>
              <div className="flex flex-wrap gap-2">
                {existingPhases
                  .sort((a, b) => a.phaseNumber - b.phaseNumber)
                  .map((existingPhase) => (
                    <Badge 
                      key={existingPhase.id} 
                      variant={existingPhase.nodeId === phase?.nodeId ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {existingPhase.phaseNumber}: {existingPhase.phaseName}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phaseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero Fase *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    {isPhaseNumberUsed(phaseNumber) && (
                      <p className="text-sm text-red-600">
                        Attenzione: Questo numero è già utilizzato da un'altra fase
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Suggerito: {suggestedNumber} (numeri come 10, 20, 30 facilitano inserimenti futuri)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phaseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Fase *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="es. Stampaggio, Saldatura, Controllo Qualità..."
                        {...field}
                      />
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
                    <FormLabel>Descrizione Dettagliata *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrivi dettagliatamente cosa avviene in questa fase del processo..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Questa descrizione sarà utilizzata per pre-compilare FMEA e Control Plan
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  className="bg-automotive-blue hover:bg-blue-700"
                  disabled={isPhaseNumberUsed(phaseNumber)}
                >
                  {phase ? 'Aggiorna Fase' : 'Salva Fase'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}