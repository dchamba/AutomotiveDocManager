import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

export default function FlowChart() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Flow Chart</h2>
        <p className="text-gray-600">Editor visuale per diagrammi di flusso del processo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5" />
            <span>Editor Flow Chart</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Flow Chart Editor</h3>
            <p className="text-gray-600">L'editor di flow chart sarà implementato qui</p>
            <p className="text-sm text-gray-500 mt-2">Utilizzerà React Flow per l'editing visuale</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
