import { Handle, Position } from '@reactflow/core';
import { Square, Settings } from 'lucide-react';

interface ProcessNodeData {
  label: string;
  phaseNumber?: number;
}

interface ProcessNodeProps {
  data: ProcessNodeData;
  selected: boolean;
}

export default function ProcessNode({ data, selected }: ProcessNodeProps) {
  return (
    <div className={`px-4 py-3 shadow-md rounded-lg bg-blue-500 text-white border-2 min-w-40 ${
      selected ? 'border-yellow-400' : 'border-blue-600'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-600 !border-2 !border-white"
      />
      <div className="flex items-center justify-center space-x-2">
        <Square className="h-4 w-4" />
        <div className="text-center">
          <div className="text-sm font-medium">{data.label}</div>
          {data.phaseNumber && (
            <div className="text-xs bg-blue-600 px-2 py-0.5 rounded mt-1">
              Fase {data.phaseNumber}
            </div>
          )}
        </div>
        <Settings className="h-3 w-3 opacity-70" />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-600 !border-2 !border-white"
      />
    </div>
  );
}