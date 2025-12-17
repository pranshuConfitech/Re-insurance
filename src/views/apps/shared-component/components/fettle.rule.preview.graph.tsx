import React from 'react';

import Graph from "react-graph-vis";

type GraphProps = React.ComponentProps<typeof Graph>;
interface CustomGraphProps extends GraphProps {
  getNetwork?: (network: any) => void;
}

const CustomGraph = Graph as React.FC<CustomGraphProps>;

const options = {
    layout: {
        hierarchical: {
            enabled: true,
            levelSeparation: 350,
            nodeSpacing: 100,
            treeSpacing: 100,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'LR',
            shakeTowards: 'leaves',
            sortMethod: 'directed'
        }
    },
    edges: {
        color: "#000000"
    },
    autoResize: true,
    height: '500px',
    width: '100%',
    physics: {
        enabled: false,
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
        },
        forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springConstant: 0.08,
            springLength: 100,
            damping: 0.4,
            avoidOverlap: 0
        },
        repulsion: {
            centralGravity: 0.2,
            springLength: 200,
            springConstant: 0.05,
            nodeDistance: 100,
            damping: 0.09
        },
        hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 100,
            springConstant: 0.01,
            nodeDistance: 120,
            damping: 0.09
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'barnesHut',
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true
        },
        timestep: 0.5,
        adaptiveTimestep: true
    },
    nodes: {
        borderWidth: 4,
        shape: "box",
        chosen: true,
        color: {
            border: '#06A497',
            background: 'transparent',
            highlight: {
                border: '#06A497',
                background: '#b5d8d8'
            },
            hover: {
                border: '#2B7CE9',
                background: '#D2E5FF'
            }
        },
    }
};

interface FettleRulePreviewGraphProps {
    benefitStructures: any[]; 
  }
export class FettleRulePreviewGraph extends React.Component<FettleRulePreviewGraphProps> {
    graph: { nodes: Array<any>; edges: Array<any> };
    options: object;
    constructor(props: FettleRulePreviewGraphProps) {
        super(props);

        this.state = {
            mouseX: null,
            mouseY: null
        };
        this.graph = { nodes: [], edges: [] };
        this.options = options;
        this.buildGraph(props.benefitStructures);
    }

    traverseChild = (item: { child: any[]; internalId: any; }) => {
        if (item.child && item.child.length > 0) {
            item.child.forEach(c => {
                this.graph.nodes.push({ id: c.internalId, label: `Rule Name: ${c.ruleName}\nBenefit Name: ${c.benefitName}`, title: `${c.name} tootip text` });
                this.graph.edges.push({ from: item.internalId, to: c.internalId });
                this.traverseChild(c);
            });
        }
    };

    buildGraph = (benefitStructures: any[]) => {
        benefitStructures.forEach(item => {
            this.graph.nodes.push({ id: item.internalId, label: `Rule Name: ${item.ruleName}\nBenefit Name: ${item.benefitName}`, title: `${item.name} tootip text` });
            this.traverseChild(item);
        });
    };

    events = {
        select: (event: { pointer?: any; nodes?: any; edges?: any; }) => {
            const { nodes, edges } = event;

            this.setState({
                ...this.state,
                ...{
                    mouseX: event.pointer.DOM.x - 2,
                    mouseY: event.pointer.DOM.y - 4
                }
            });
        }
    };

    handleCloseMenu = () => {

    };

    render() {
        return (
            <div>
                <CustomGraph
                    graph={this.graph}
                    options={this.options}
                    events={this.events}
                    getNetwork={(network:any) => {
                        return console.log(network);
                        
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                    }}
                />
            </div>
        );
    }
}
