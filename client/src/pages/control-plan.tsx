import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";

export default function ControlPlan() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Control Plan</h2>
        <p className="text-gray-600">Piani di controllo con caratteristiche, frequenza, metodo e reazione</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Control Plan Editor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Control Plan Editor</h3>
            <p className="text-gray-600">L'editor dei piani di controllo sarà implementato qui</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">• Caratteristiche di controllo</p>
              <p className="text-sm text-gray-500">• Frequenza e metodi</p>
              <p className="text-sm text-gray-500">• Linkage APQP/PPAP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
