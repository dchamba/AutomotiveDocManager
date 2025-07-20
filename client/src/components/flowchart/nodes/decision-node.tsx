import { Handle, Position } from '@reactflow/core';
import { Diamond, HelpCircle } from 'lucide-react';

interface DecisionNodeData {
  label: string;
}

interface DecisionNodeProps {
  data: DecisionNodeData;
  selected: boolean;
}

export default function DecisionNode({ data, selected }: DecisionNodeProps) {
  return (
    <div className={`relative px-4 py-3 shadow-md bg-orange-500 text-white border-2 min-w-36 ${
      selected ? 'border-yellow-400' : 'border-orange-600'
    }`} style={{
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      transform: 'rotate(0deg)'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-orange-600 !border-2 !border-white"
        style={{ top: '10%' }}
      />
      <div className="flex items-center justify-center space-x-2 py-1">
        <HelpCircle className="h-4 w-4" />
        <div className="text-sm font-medium text-center">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        className="w-3 h-3 !bg-orange-600 !border-2 !border-white"
        style={{ bottom: '10%', left: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="w-3 h-3 !bg-orange-600 !border-2 !border-white"
        style={{ bottom: '10%', right: '30%' }}
      />
    </div>
  );
}