"use client"

import { useCallback, useEffect, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { ChatNode } from "./chat-node"
import { Message, Node as DBNode } from "@/lib/actions/notes"
import { createMessage, createChildNode, updateNodePosition } from "@/lib/actions/notes"
import { processAIMessage } from "@/lib/actions/ai"
import { useRouter } from "next/navigation"
import { IconRefresh } from "@tabler/icons-react"

interface FlowCanvasProps {
  noteId: string
  initialNodes: Array<DBNode & { messages: Message[] }>
}

const nodeTypes: NodeTypes = {
  chatNode: ChatNode,
}

export function FlowCanvas({ noteId, initialNodes }: FlowCanvasProps) {
  const router = useRouter()
  const [processingNodes, setProcessingNodes] = useState<Set<string>>(new Set())
  const [hasInitialProcessed, setHasInitialProcessed] = useState(false)

  // Convert DB nodes to React Flow nodes
  const initialFlowNodes: Node[] = initialNodes.map((node) => ({
    id: node.id,
    type: "chatNode",
    position: { x: node.x, y: node.y },
    data: {
      nodeId: node.id,
      messages: node.messages,
      isProcessing: false,
      onSendMessage: handleSendMessage,
      onBranch: handleBranch,
    },
  }))

  // Create edges from parent relationships
  const initialFlowEdges: Edge[] = initialNodes
    .filter((node) => node.parent_id)
    .map((node) => ({
      id: `e-${node.parent_id}-${node.id}`,
      source: node.parent_id!,
      target: node.id,
      type: "smoothstep",
      animated: true,
    }))

  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlowEdges)

  // Process initial AI response if there's a user message but no assistant response
  useEffect(() => {
    if (hasInitialProcessed) return

    const rootNode = initialNodes.find((n) => !n.parent_id)
    if (!rootNode) return

    const hasUserMessage = rootNode.messages.some((m) => m.role === "user")
    const hasAssistantMessage = rootNode.messages.some((m) => m.role === "assistant")

    if (hasUserMessage && !hasAssistantMessage) {
      setHasInitialProcessed(true)
      processAI(rootNode.id)
    } else {
      setHasInitialProcessed(true)
    }
  }, [initialNodes, hasInitialProcessed])

  // Handle node drag (save position)
  const onNodeDragStop = useCallback(
    (_event: any, node: Node) => {
      updateNodePosition(node.id, node.position.x, node.position.y)
    },
    []
  )

  // Handle sending a message
  async function handleSendMessage(nodeId: string, message: string) {
    try {
      // Add user message to DB
      await createMessage(nodeId, "user", message)

      // Update local state to show user message immediately
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const newMessage: Message = {
              id: `temp-${Date.now()}`,
              node_id: nodeId,
              role: "user",
              content: message,
              created_at: new Date().toISOString(),
              model: null,
              token: null,
              metadata: {},
            }
            return {
              ...node,
              data: {
                ...node.data,
                messages: [...node.data.messages, newMessage],
              },
            }
          }
          return node
        })
      )

      // Process AI response
      await processAI(nodeId)
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message")
    }
  }

  // Process AI response
  async function processAI(nodeId: string) {
    // Mark node as processing
    setProcessingNodes((prev) => new Set(prev).add(nodeId))
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isProcessing: true } }
          : node
      )
    )

    try {
      const result = await processAIMessage(nodeId)

      if (result.success && result.message) {
        // Update node with AI response
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  messages: [...node.data.messages, result.message],
                  isProcessing: false,
                },
              }
            }
            return node
          })
        )
      } else {
        throw new Error(result.error || "Failed to process message")
      }
    } catch (error) {
      console.error("Error processing AI:", error)
      alert("Failed to get AI response")
      // Remove processing state
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isProcessing: false } }
            : node
        )
      )
    } finally {
      setProcessingNodes((prev) => {
        const next = new Set(prev)
        next.delete(nodeId)
        return next
      })
    }
  }

  // Handle branching
  async function handleBranch(parentNodeId: string) {
    try {
      // Get parent node position
      const parentNode = nodes.find((n) => n.id === parentNodeId)
      if (!parentNode) return

      // Calculate new node position (below and to the right)
      const newX = parentNode.position.x + 50
      const newY = parentNode.position.y + 250

      // Create new node in DB
      const newNode = await createChildNode(noteId, parentNodeId, newX, newY, "Branch")

      // Add to React Flow
      const newFlowNode: Node = {
        id: newNode.id,
        type: "chatNode",
        position: { x: newX, y: newY },
        data: {
          nodeId: newNode.id,
          messages: [],
          isProcessing: false,
          onSendMessage: handleSendMessage,
          onBranch: handleBranch,
        },
      }

      const newEdge: Edge = {
        id: `e-${parentNodeId}-${newNode.id}`,
        source: parentNodeId,
        target: newNode.id,
        type: "smoothstep",
        animated: true,
      }

      setNodes((nds) => [...nds, newFlowNode])
      setEdges((eds) => [...eds, newEdge])
    } catch (error) {
      console.error("Error creating branch:", error)
      alert("Failed to create branch")
    }
  }

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDragStop={onNodeDragStop}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
    >
      <Background />
      <Controls />
      <MiniMap 
        nodeStrokeWidth={3}
        zoomable
        pannable
      />
      <Panel position="top-right" className="space-x-2">
        <button
          onClick={handleRefresh}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
        >
          <IconRefresh className="size-4" />
          Refresh
        </button>
      </Panel>
    </ReactFlow>
  )
}

