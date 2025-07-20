import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function FMEA() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">FMEA</h2>
        <p className="text-gray-600">Analisi delle modalità di guasto e dei loro effetti secondo standard AIAG-VDA</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Moduli FMEA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">FMEA Editor</h3>
            <p className="text-gray-600">L'editor FMEA sarà implementato qui</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">• AIAG-VDA 2019 (7 fasi, AP invece di RPN)</p>
              <p className="text-sm text-gray-500">• AIAG 4ª Ed. 2008 (RPN classico)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
