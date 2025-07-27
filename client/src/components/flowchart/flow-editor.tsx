import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
} from '@reactflow/core';
import { Background } from '@reactflow/background';
import { Controls } from '@reactflow/controls';
import { MiniMap } from '@reactflow/minimap';
import '@reactflow/core/dist/style.css';

import { flowChartsApi } from '@/lib/api';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Square, Diamond, Circle, ArrowRight, Save, 
  Download, Upload, Trash2, Plus, Settings, FileText 
} from "lucide-react";

import StartNode from './nodes/start-node';
import ProcessNode from './nodes/process-node';
import DecisionNode from './nodes/decision-node';
import EndNode from './nodes/end-node';
import PhaseDialog from './phase-dialog';

const nodeTypes: NodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
};

interface ProcessPhase {
  id: string;
  phaseNumber: number;
  phaseName: string;
  description: string;
  nodeId: string;
}

interface FlowEditorProps {
  flowChartId?: number;
  productVersionId?: number;
  onSave?: (data: any) => void;
  readonly?: boolean;
}

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 400, y: 50 },
    data: { label: 'Inizio Processo' },
  },
];

const initialEdges: Edge[] = [];

export default function FlowEditor({ flowChartId, productVersionId, onSave, readonly = false }: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [processPhases, setProcessPhases] = useState<ProcessPhase[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPhaseDialogOpen, setIsPhaseDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState('Nuovo Flow Chart');

  // Load existing flow chart data if flowChartId is provided
  const { data: existingFlowChart } = useQuery({
    queryKey: ["/api/flowcharts", flowChartId],
    queryFn: () => flowChartId ? flowChartsApi.getById(flowChartId) : Promise.resolve(null),
    enabled: !!flowChartId,
  });

  // Load data from existing flow chart
  useEffect(() => {
    if (existingFlowChart && existingFlowChart.data) {
      const chartData = existingFlowChart.data as any;
      
      if (Array.isArray(chartData.nodes)) {
        setNodes(chartData.nodes);
      }
      if (Array.isArray(chartData.edges)) {
        setEdges(chartData.edges);
      }
      if (Array.isArray(chartData.processPhases)) {
        setProcessPhases(chartData.processPhases);
      }
      if (existingFlowChart.name) {
        setFlowName(existingFlowChart.name);
      }
    }
  }, [existingFlowChart, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        animated: true,
        style: { stroke: '#1e40af', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#1e40af' },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const addNode = useCallback(
    (type: string) => {
      const position = {
        x: Math.random() * 400 + 200,
        y: Math.random() * 400 + 200,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: getDefaultLabel(type),
          phaseNumber: type === 'process' ? processPhases.length + 1 : undefined,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, processPhases.length]
  );

  const getDefaultLabel = (type: string): string => {
    switch (type) {
      case 'start': return 'Inizio';
      case 'process': return `Fase ${processPhases.length + 1}`;
      case 'decision': return 'Decisione?';
      case 'end': return 'Fine';
      default: return 'Nodo';
    }
  };

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setProcessPhases((phases) => phases.filter((phase) => phase.nodeId !== nodeId));
    },
    [setNodes, setEdges, setProcessPhases]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (readonly) return;
      setSelectedNode(node);
      if (node.type === 'process') {
        setIsPhaseDialogOpen(true);
      }
    },
    [readonly]
  );

  const handlePhaseUpdate = useCallback(
    (phaseData: Omit<ProcessPhase, 'id' | 'nodeId'>) => {
      if (!selectedNode) return;

      const existingPhaseIndex = processPhases.findIndex(p => p.nodeId === selectedNode.id);
      
      if (existingPhaseIndex >= 0) {
        // Update existing phase
        const updatedPhases = [...processPhases];
        updatedPhases[existingPhaseIndex] = {
          ...updatedPhases[existingPhaseIndex],
          ...phaseData,
        };
        setProcessPhases(updatedPhases);
      } else {
        // Create new phase
        const newPhase: ProcessPhase = {
          id: `phase-${Date.now()}`,
          nodeId: selectedNode.id,
          ...phaseData,
        };
        setProcessPhases([...processPhases, newPhase]);
      }

      // Update node label
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, label: phaseData.phaseName, phaseNumber: phaseData.phaseNumber } }
            : node
        )
      );

      setIsPhaseDialogOpen(false);
      setSelectedNode(null);
    },
    [selectedNode, processPhases, setNodes]
  );

  const exportFlowChart = useCallback(() => {
    const flowData = {
      name: flowName,
      nodes,
      edges,
      processPhases,
      viewport: { x: 0, y: 0, zoom: 1 },
    };

    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `flowchart-${flowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [flowName, nodes, edges, processPhases]);

  const saveFlowChart = useCallback(() => {
    const flowData = {
      name: flowName,
      nodes,
      edges,
      processPhases,
      productVersionId,
    };
    
    if (onSave) {
      onSave(flowData);
    }
  }, [flowName, nodes, edges, processPhases, productVersionId, onSave]);

  const currentPhase = selectedNode ? processPhases.find(p => p.nodeId === selectedNode.id) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <Input
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                disabled={readonly}
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {processPhases.length} fasi definite
              </Badge>
              {!readonly && (
                <>
                  <Button onClick={saveFlowChart} size="sm" className="bg-automotive-blue hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salva
                  </Button>
                  <Button onClick={exportFlowChart} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Esporta
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        {!readonly && (
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Aggiungi Simboli:</Label>
              <Button
                onClick={() => addNode('start')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Play className="h-4 w-4 text-green-600" />
                <span>Inizio</span>
              </Button>
              <Button
                onClick={() => addNode('process')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Square className="h-4 w-4 text-blue-600" />
                <span>Processo</span>
              </Button>
              <Button
                onClick={() => addNode('decision')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Diamond className="h-4 w-4 text-orange-600" />
                <span>Decisione</span>
              </Button>
              <Button
                onClick={() => addNode('end')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Circle className="h-4 w-4 text-red-600" />
                <span>Fine</span>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Flow Chart Editor */}
      <Card className="flex-1">
        <CardContent className="p-0 h-96">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="rounded-lg"
          >
            <Background />
            <Controls />
            <MiniMap
              nodeStrokeColor="#374151"
              nodeColor="#e5e7eb"
              nodeBorderRadius={2}
              className="bg-white"
            />
          </ReactFlow>
        </CardContent>
      </Card>

      {/* Process Phases Summary */}
      {processPhases.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Fasi Processo Definite</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {processPhases
                .sort((a, b) => a.phaseNumber - b.phaseNumber)
                .map((phase) => (
                  <div key={phase.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Fase {phase.phaseNumber}
                      </Badge>
                      {!readonly && (
                        <Button
                          onClick={() => deleteNode(phase.nodeId)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{phase.phaseName}</h4>
                    <p className="text-xs text-gray-600">{phase.description}</p>
                  </div>
                ))}
            </div>
            {processPhases.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Queste fasi saranno automaticamente utilizzate per 
                  pre-compilare le tabelle FMEA e Control Plan per questa versione del prodotto.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phase Definition Dialog */}
      <PhaseDialog
        isOpen={isPhaseDialogOpen}
        onClose={() => {
          setIsPhaseDialogOpen(false);
          setSelectedNode(null);
        }}
        onSave={handlePhaseUpdate}
        phase={currentPhase}
        existingPhases={processPhases}
      />
    </div>
  );
}