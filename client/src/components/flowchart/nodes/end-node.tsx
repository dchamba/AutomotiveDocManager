import { Handle, Position } from '@reactflow/core';
import { Circle, Square } from 'lucide-react';

interface EndNodeData {
  label: string;
}

interface EndNodeProps {
  data: EndNodeData;
  selected: boolean;
}

export default function EndNode({ data, selected }: EndNodeProps) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-full bg-red-500 text-white border-2 min-w-32 text-center ${
      selected ? 'border-blue-500' : 'border-red-600'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-red-600 !border-2 !border-white"
      />
      <div className="flex items-center justify-center space-x-2">
        <Square className="h-4 w-4" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
    </div>
  );
}