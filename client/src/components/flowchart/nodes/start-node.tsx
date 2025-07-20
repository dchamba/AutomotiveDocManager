import { Handle, Position } from '@reactflow/core';
import { Play } from 'lucide-react';

interface StartNodeData {
  label: string;
}

interface StartNodeProps {
  data: StartNodeData;
  selected: boolean;
}

export default function StartNode({ data, selected }: StartNodeProps) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-full bg-green-500 text-white border-2 min-w-32 text-center ${
      selected ? 'border-blue-500' : 'border-green-600'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        <Play className="h-4 w-4" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-600 !border-2 !border-white"
      />
    </div>
  );
}