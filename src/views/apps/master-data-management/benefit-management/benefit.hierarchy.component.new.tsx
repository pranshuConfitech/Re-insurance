import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Edge, Node, ReactFlowInstance } from '@xyflow/react';
import { Background, Controls, Position, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, CircularProgress, Typography } from '@mui/material';

import { BenefitOption, HierarchyNode, type HierarchyNodeData } from './flow-util';

type BenefitHierarchy = BenefitOption & { child?: BenefitHierarchy[] | null };

interface BenefitTreeProps {
    benefit?: BenefitHierarchy | null;
    benefitDataSource$?: () => any;
    readOnly?: boolean;
    onChange?: (hierarchy: BenefitHierarchy | null) => void;
}

interface TreeNode {
    id: string;
    parentId: string | null;
    benefit: BenefitOption | null;
}

const HORIZONTAL_SPACING = 360;
const VERTICAL_SPACING = 200;

const nodeTypes = {
    hierarchyNode: HierarchyNode
};

const proOptions = { hideAttribution: true } as const;

const createNodeId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `node-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
};

const cloneWithoutChildren = (benefit: BenefitHierarchy): BenefitOption => {
    const { child, ...rest } = benefit ?? {};
    return { ...rest } as BenefitOption;
};

const hydrateTreeNodes = (benefit?: BenefitHierarchy | null): TreeNode[] => {
    if (!benefit) {
        return [{ id: createNodeId(), parentId: null, benefit: null }];
    }

    const nodes: TreeNode[] = [];

    const traverse = (node: BenefitHierarchy, parentId: string | null) => {
        if (!node) return;

        const id = createNodeId();
        nodes.push({ id, parentId, benefit: cloneWithoutChildren(node) });

        const children = Array.isArray(node.child) ? node.child : [];
        children.forEach(childNode => {
            traverse(childNode, id);
        });
    };

    traverse(benefit, null);

    return nodes.length ? nodes : [{ id: createNodeId(), parentId: null, benefit: null }];
};

const buildHierarchyFromTree = (tree: TreeNode[]): BenefitHierarchy | null => {
    if (!tree.length) {
        return null;
    }

    const rootTreeNode = tree.find(item => item.parentId === null);

    if (!rootTreeNode || !rootTreeNode.benefit) {
        return null;
    }

    const buildNode = (treeNode: TreeNode): BenefitHierarchy | null => {
        if (!treeNode.benefit) {
            return null;
        }

        const children = tree
            .filter(item => item.parentId === treeNode.id)
            .map(child => buildNode(child))
            .filter((child): child is BenefitHierarchy => Boolean(child));

        const { child, ...rest } = treeNode.benefit;

        return {
            ...rest,
            child: children.length ? children : null
        };
    };

    return buildNode(rootTreeNode);
};

const computeLayoutPositions = (tree: TreeNode[]) => {
    const childMap = new Map<string | null, TreeNode[]>();
    tree.forEach(node => {
        const key = node.parentId ?? null;
        const list = childMap.get(key) ?? [];
        list.push(node);
        childMap.set(key, list);
    });

    const positions = new Map<string, { x: number; y: number }>();
    const roots = childMap.get(null) ?? [];
    let nextRow = 0;

    const traverse = (node: TreeNode, depth: number) => {
        const children = childMap.get(node.id) ?? [];

        if (!children.length) {
            const y = nextRow * VERTICAL_SPACING;
            nextRow += 1;
            positions.set(node.id, { x: depth * HORIZONTAL_SPACING, y });
            return positions.get(node.id)!;
        }

        const childPositions = children.map(child => traverse(child, depth + 1));
        const minY = Math.min(...childPositions.map(pos => pos.y));
        const maxY = Math.max(...childPositions.map(pos => pos.y));
        const y = (minY + maxY) / 2;
        positions.set(node.id, { x: depth * HORIZONTAL_SPACING, y });
        return positions.get(node.id)!;
    };

    if (!roots.length) {
        tree.forEach(node => {
            if (positions.has(node.id)) return;
            const y = nextRow * VERTICAL_SPACING;
            nextRow += 1;
            positions.set(node.id, { x: 0, y });
        });
        return positions;
    }

    roots.forEach(root => {
        traverse(root, 0);
    });

    return positions;
};

const ensureOptionsContainSelection = (options: BenefitOption[], selection: BenefitOption | null) => {
    if (!selection) {
        return options;
    }

    const match = options.some(option => option.id === selection.id);
    if (match) {
        return options;
    }

    return [...options, selection];
};

export default function BenefitTree({
    benefit,
    benefitDataSource$,
    readOnly = false,
    onChange
}: BenefitTreeProps) {
    const [allBenefits, setAllBenefits] = useState<BenefitOption[]>([]);
    const [isLoadingBenefits, setIsLoadingBenefits] = useState<boolean>(false);
    const [treeNodes, setTreeNodes] = useState<TreeNode[]>(() => hydrateTreeNodes(benefit));
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

    useEffect(() => {
        setTreeNodes(hydrateTreeNodes(benefit));
    }, [benefit]);

    useEffect(() => {
        if (typeof benefitDataSource$ !== 'function') {
            return;
        }

        const source = benefitDataSource$();

        if (!source) {
            return;
        }

        if (typeof source.subscribe === 'function') {
            setIsLoadingBenefits(true);
            const subscription = source.subscribe(
                (response: any) => {
                    const list = Array.isArray(response)
                        ? response
                        : Array.isArray(response?.content)
                            ? response.content
                            : [];

                    setAllBenefits(list);
                    setIsLoadingBenefits(false);
                },
                () => {
                    setIsLoadingBenefits(false);
                }
            );

            return () => {
                subscription?.unsubscribe?.();
            };
        }

        if (typeof source.then === 'function') {
            setIsLoadingBenefits(true);
            source
                .then((response: any) => {
                    const list = Array.isArray(response)
                        ? response
                        : Array.isArray(response?.content)
                            ? response.content
                            : [];

                    setAllBenefits(list);
                })
                .finally(() => setIsLoadingBenefits(false));
            return;
        }

        if (Array.isArray(source)) {
            setAllBenefits(source);
        }
    }, [benefitDataSource$]);

    useEffect(() => {
        if (!onChange) {
            return;
        }

        const hierarchy = buildHierarchyFromTree(treeNodes);
        onChange(hierarchy);
    }, [treeNodes, onChange]);

    const sortedBenefits = useMemo(() => {
        if (!allBenefits.length) {
            return [] as BenefitOption[];
        }

        return [...allBenefits].sort((a, b) => {
            const nameA = (a?.name ?? '').toLowerCase();
            const nameB = (b?.name ?? '').toLowerCase();

            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    }, [allBenefits]);

    const usedBenefitIds = useMemo(() => {
        return new Set(
            treeNodes
                .filter(node => node.benefit?.id)
                .map(node => node.benefit!.id)
        );
    }, [treeNodes]);

    const positions = useMemo(() => computeLayoutPositions(treeNodes), [treeNodes]);

    const handleSelect = useCallback((nodeId: string, benefitOption: BenefitOption | null) => {
        setTreeNodes(prev => prev.map(node => (node.id === nodeId ? { ...node, benefit: benefitOption } : node)));
    }, []);

    const handleAddChild = useCallback((parentId: string) => {
        setTreeNodes(prev => {
            const newNode: TreeNode = {
                id: createNodeId(),
                parentId,
                benefit: null
            };

            return [...prev, newNode];
        });
    }, []);

    const collectDescendantIds = useCallback((nodeId: string, nodes: TreeNode[]): Set<string> => {
        const result = new Set<string>();
        const queue = [nodeId];

        while (queue.length) {
            const current = queue.shift()!;
            const children = nodes.filter(node => node.parentId === current);

            children.forEach(child => {
                result.add(child.id);
                queue.push(child.id);
            });
        }

        return result;
    }, []);

    const handleRemoveNode = useCallback((nodeId: string) => {
        setTreeNodes(prev => {
            const descendants = collectDescendantIds(nodeId, prev);
            return prev.filter(node => node.id !== nodeId && !descendants.has(node.id));
        });
    }, [collectDescendantIds]);

    const nodes: Node[] = useMemo(() => {
        return treeNodes.map<Node>(node => {
            const baseOptions = sortedBenefits.filter(option => {
                if (!option?.id) {
                    return false;
                }

                if (node.benefit?.id === option.id) {
                    return true;
                }

                return !usedBenefitIds.has(option.id);
            });

            const options = ensureOptionsContainSelection(baseOptions, node.benefit);
            const position = positions.get(node.id) ?? { x: 0, y: 0 };
            const data: HierarchyNodeData = {
                nodeId: node.id,
                benefit: node.benefit,
                options,
                readOnly,
                isRoot: node.parentId === null,
                onSelect: handleSelect,
                onAddChild: handleAddChild,
                onRemove: handleRemoveNode,
                canAddChild: Boolean(node.benefit) && !readOnly,
                canRemove: node.parentId !== null && !readOnly
            };

            return {
                id: node.id,
                type: 'hierarchyNode',
                position,
                data: data as Record<string, unknown>,
                draggable: false,
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            };
        });
    }, [treeNodes, sortedBenefits, usedBenefitIds, positions, readOnly, handleSelect, handleAddChild, handleRemoveNode]);

    const edges: Edge[] = useMemo(() => {
        return treeNodes
            .filter(node => node.parentId)
            .map(node => ({
                id: `edge-${node.parentId}-${node.id}`,
                source: node.parentId as string,
                target: node.id,
                type: 'smoothstep'
            }));
    }, [treeNodes]);

    useEffect(() => {
        if (!reactFlowInstance.current) {
            return;
        }

        reactFlowInstance.current.fitView({ padding: 0.2, duration: 300 });
    }, [nodes.length, edges.length]);

    const hasValidRootSelection = treeNodes.some(node => node.parentId === null && node.benefit);

    return (
        <Box sx={{ position: 'relative', height: 500, width: '100%' }}>
            {isLoadingBenefits && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <CircularProgress size={18} />
                    <Typography variant="caption">Loading benefits…</Typography>
                </Box>
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable
                panOnDrag={[2]}
                selectionOnDrag={false}
                zoomOnScroll
                zoomOnPinch
                panOnScroll
                fitView
                fitViewOptions={{ padding: 0.3 }}
                noPanClassName="nopan"
                nodeDragThreshold={0}
                onPaneClick={(event) => {
                    console.log('[BenefitTree] pane click', {
                        button: event.button,
                        target: (event.target as HTMLElement)?.nodeName
                    });
                }}
                onPaneContextMenu={(event) => {
                    console.log('[BenefitTree] pane context menu', {
                        button: event.button,
                        target: (event.target as HTMLElement)?.nodeName
                    });
                }}
                onInit={(instance) => {
                    console.log('[BenefitTree] reactflow init');
                    reactFlowInstance.current = instance as unknown as ReactFlowInstance;
                }}
                proOptions={proOptions}
            >
                <Controls position="top-left" showInteractive={true} />
                <Background gap={24} size={1} />
            </ReactFlow>
            {!hasValidRootSelection && !readOnly && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        boxShadow: '0 1px 3px rgba(15,23,42,0.2)'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Select a benefit to enable adding child nodes.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

