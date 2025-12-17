


import React from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Menu, MenuItem, TextField } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox'; // Updated import
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Graph from "react-graph-vis";

import { FettleConfirmDialog } from "./fettle.confirm.dialog";

type GraphProps = React.ComponentProps<typeof Graph>;
interface CustomGraphProps extends GraphProps {
    getNetwork?: (network: any) => void;
}

const CustomGraph = Graph as React.FC<CustomGraphProps>;

interface Benefit {
    id: string;
    name: string;
    benefitType: string[];
    child?: Benefit[];
}
type InitialState = {
    mouseX: number | null;
    mouseY: number | null;
    openDialog: boolean;
    source: any[];
    dialogHeader: string;
    showDeleteConfirmDialog: boolean;
    deleteConfirmDialogTitle: string;
    deleteConfirmDialogDesc: string;
    readOnly: boolean;
    multiSelection: boolean;
};

// Props Interface
interface FettleBenefitGraphProps {
    benefit: Benefit; // Initial benefit graph structure
    benefitDataSource$: () => any; // Observable for fetching benefits data
    readOnly?: boolean; // Optional prop to specify if the graph is read-only
    onChange?: (updatedGraph: Benefit | null) => void; // Callback when graph changes
}

// State Interface
interface FettleBenefitGraphState {
    mouseX: number | null;
    mouseY: number | null;
    openDialog: boolean;
    source: Benefit[];
    dialogHeader: string;
    showDeleteConfirmDialog: boolean;
    deleteConfirmDialogTitle: string;
    deleteConfirmDialogDesc: string;
    readOnly: boolean;
    multiSelection: boolean;
    availableAllBenefits: Benefit[];
    mainAllBenefits: Benefit[];
    otherAllBenefits: Benefit[];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export class FettleBenefitGraph extends React.Component<FettleBenefitGraphProps, FettleBenefitGraphState> {
    //initialState: { mouseX: null; mouseY: null; openDialog: boolean; source: never[]; dialogHeader: string; showDeleteConfirmDialog: boolean; deleteConfirmDialogTitle: string; deleteConfirmDialogDesc: string; readOnly: any; multiSelection: boolean; };
    private networkRef: any = null;
    private initialState!: InitialState;
    private graph: any = { nodes: [], edges: [] };
    private count: number = 0;
    private availableBenefits: Benefit[] = [];
    private mainBenefits: Benefit[] = [];
    private otherBenefits: Benefit[] = [];
    private selectedBenefit: Benefit | null = null;
    private selectedCurrentNode: any = null;
    private options: any = {};

    constructor(props: any) {
        super(props);

        this.networkRef = null;
        this.initGraph(props);
        this.state = {
            mouseX: null,
            mouseY: null,
            openDialog: false,
            source: [],
            dialogHeader: "",
            showDeleteConfirmDialog: false,
            deleteConfirmDialogTitle: "",
            deleteConfirmDialogDesc: "",
            readOnly: props.readOnly || false,
            multiSelection: false,
            availableAllBenefits: [],
            mainAllBenefits: [],
            otherAllBenefits: [],
        };
    }

    initGraph = (props: any) => {
        this.initialState = {
            mouseX: null,
            mouseY: null,
            openDialog: false,
            source: [],
            dialogHeader: "",
            showDeleteConfirmDialog: false,
            deleteConfirmDialogTitle: "",
            deleteConfirmDialogDesc: "",
            readOnly: props.readOnly || false,
            multiSelection: false
        };

        // this.state = {...this.initialState,
        //     availableAllBenefits: [],
        //     mainAllBenefits: [],
        //     otherAllBenefits: [],
        // };
        this.setState({
            ...this.state,
            availableAllBenefits: [],
            mainAllBenefits: [],
            otherAllBenefits: [],
        });
        this.count = 0;
        this.graph = this.buildNodeFromBenefit(this.props.benefit);

        this.availableBenefits = [];
        this.mainBenefits = [];
        this.otherBenefits = [];
        this.selectedBenefit = null;
        this.selectedCurrentNode = null;

        this.options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    levelSeparation: 150,
                    nodeSpacing: 200,
                    treeSpacing: 200,
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
                shape: "box",
                color: {
                    background: "rgba(216, 14, 81, 0.9)", // Semi-transparent base
                    border: "#B70C47",                    // Darker border
                    highlight: {
                        background: "#B70C47",              // Opaque darker on highlight
                        border: "#9B093B"                   // Even darker border on highlight
                    },
                    hover: {
                        background: "#B70C47",              // Opaque darker on hover
                        border: "#9B093B"                   // Even darker border on hover
                    }
                },
                font: {
                    color: "#FFFFFF",                     // White font
                    size: 14,
                    face: "Arial",
                    bold: {
                        color: "#FFFFFF",
                        size: 14,
                        face: "Arial",
                        mod: "bold"
                    }
                }
            }


        };


    }

    buildNodeFromBenefit(benefit: any, graph: any = {
        nodes: [
        ],
        edges: [

        ]
    }, parentNode?: any, parentBenefit?: any) {

        if (benefit) {
            // const node = { id: ++this.count, label: `${benefit.name}`, title: `${benefit.name}`, data: benefit, child: [], parentNode, parentBenefit };
            const node = { id: `node-${benefit.id}-${Math.random().toString(36).substr(2, 6)}`, label: `${benefit.name}`, title: `${benefit.name}`, data: benefit, child: [], parentNode, parentBenefit };

            graph.nodes.push(node);

            if (parentNode) {
                // parentNode.child[node];
                graph.edges.push({ from: parentNode.id, to: node.id });
            }

            if (benefit.child && benefit.child.length > 0) {
                benefit.child.forEach((b: any) => {
                    this.buildNodeFromBenefit(b, graph, node, benefit);
                })
            }
        }

        return graph;
    }


    componentDidMount() {
        if (!this.state.readOnly) {
            this.props.benefitDataSource$().subscribe((data: { content: Benefit[]; }) => {
                this.availableBenefits = data.content;
                console.log('data ', data.content)
                this.setState({ ...this.state, availableAllBenefits: data.content });
                const tempMain: any = []
                const tempOther: any = []

                this.availableBenefits.forEach(item => {
                    if (item.benefitType.indexOf('MAIN') > -1) {
                        this.mainBenefits.push(item);
                        tempMain.push(item);
                    }

                    if (item.benefitType.indexOf('SUB') > -1) {
                        this.otherBenefits.push(item);
                        tempOther.push(item);
                    }
                });
                this.setState({ ...this.state, otherAllBenefits: tempOther, mainAllBenefits: tempOther });
            });
        }

    }

    componentDidUpdate(prevProps: { benefit: any; }) {

        if (prevProps.benefit != this.props.benefit) {
            this.initGraph(this.props);
            this.setState({ ...this.state, source: [] });
        }
    }

    getWithAllNestdGraphNodes(node: { child: any[]; }, list: any = []) {
        list.push(node);

        if (node.child && node.child.length > 0) {
            node.child.forEach(n => this.getWithAllNestdGraphNodes(n, list));
        }


        return list;
    }

    removeNodeFromGraph(node: any, list: any[] = []) {
        list.push(node);
        const index = this.graph.nodes.indexOf(node);

        this.graph.nodes.forEach((ele: { data: { id: any; child: any[]; }; }) => {
            if (ele.data.id === this.selectedCurrentNode.parentBenefit.id) {
                const indexOfChild = ele.data.child.indexOf(this.selectedCurrentNode.data)

                ele.data.child.splice(indexOfChild, 1)
            }
        })

        this.graph.nodes.splice(index, 1);
        this.graph.edges = this.graph.edges.filter((e: { from: any; to: any; }) => e.from != node.id && e.to != node.id);

        if (node.child && node.child.length > 0) {
            node.child.forEach((n: any) => this.removeNodeFromGraph(n, list));
        }


        return list;
    }

    handleRightClick = (event: { preventDefault: () => void; clientX: number; clientY: number; }) => {

        event.preventDefault();

        if (this.state.readOnly || (this.graph.nodes && this.graph.nodes.length > 0)) {
            return;
        }

        this.setState({
            ...this.initialState, ...{
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
            }
        });
    };

    handleCloseMenu = () => {
        this.setState(this.initialState);
    };

    handleBenefitSelectoinDialogClose = () => {
        this.setState(this.initialState);
    };

    handleAddRootMenuClick = () => {
        this.setState({ ...this.initialState, openDialog: true, source: this.mainBenefits, dialogHeader: "Select main benefit" });

    }

    handleAddSubBenefitButtonClick = () => {
        let source = null;

        if (this.selectedCurrentNode.data.benefitType && this.selectedCurrentNode.data.benefitType.indexOf('MAIN_BENEFIT') > -1) {
            source = this.state.otherAllBenefits
                .filter((b: { id: any; }) => {
                    if (this.selectedCurrentNode.data.child && this.selectedCurrentNode.data.child.length > 0) {
                        return this.selectedCurrentNode.data.child.filter((c: { id: any; }) => c.id == b.id).length == 0;
                    }
                    else {
                        return true;
                    }
                });
        }
        else {
            source = this.state.otherAllBenefits
                .filter((b: { id: any; }) => {
                    if (this.selectedCurrentNode.parentNode) {
                        if (this.selectedCurrentNode.data.child && this.selectedCurrentNode.data.child.length > 0) {
                            return this.selectedCurrentNode.data.child.every((c: { id: any; }) => c.id != b.id) &&
                                b.id != this.selectedCurrentNode.data.id && (this.selectedCurrentNode.parentNode && this.selectedCurrentNode.parentNode.data.id != b.id);
                        }


                        return b.id != this.selectedCurrentNode.data.id && (this.selectedCurrentNode.parentNode && this.selectedCurrentNode.parentNode.data.id != b.id);
                    }

                    if (this.selectedCurrentNode.data.child && this.selectedCurrentNode.data.child.length > 0) {
                        return this.selectedCurrentNode.data.child.every((c: { id: any; }) => c.id != b.id) && b.id != this.selectedCurrentNode.data.id;
                    }

                    return b.id != this.selectedCurrentNode.data.id;
                });
        }

        this.setState({ ...this.initialState, openDialog: true, source: source, dialogHeader: `Select sub benefit for ${this.selectedCurrentNode.data.name}`, multiSelection: true });
    }


    handleRemoveBenefitMenuClick = () => {
        this.setState({
            ...this.initialState,
            showDeleteConfirmDialog: true,
            deleteConfirmDialogTitle: `Delete confirmation`,
            deleteConfirmDialogDesc: `Confirm to delete ${this.selectedCurrentNode.data.name}, all child nodes will also be deleted.`
        });
    }


    handleRemoveDialogButtonClick = (flag: any) => {
        if (flag) {
            const toBeRemoveNodes = this.removeNodeFromGraph(this.selectedCurrentNode);

            /*removing link from parent*/

            if (this.selectedCurrentNode.parentNode) {
                const index = this.selectedCurrentNode.parentNode.child.indexOf(this.selectedCurrentNode);

                this.selectedCurrentNode.parentNode.child.splice(index, 1);
            }

            this.networkRef.body.data.nodes.remove(toBeRemoveNodes);
            this.selectedCurrentNode = null;

            // Object.prototype.toString.call(this.props.onChange) == "[object Function]" &&
            //     this.props.onChange(this.graph.nodes && this.graph.nodes.length > 0 && this.graph.nodes[0].data && this.graph.nodes[0].data || null);
            if (typeof this.props.onChange === "function") {
                const updatedGraph =
                    this.graph.nodes && this.graph.nodes.length > 0
                        ? this.graph.nodes[0].data || null
                        : null;

                this.props.onChange(updatedGraph);
            }
        }


        this.setState({ ...this.state, showDeleteConfirmDialog: false })
    }

    events = {
        select: (event: { nodes: string | any[]; pointer: { DOM: { x: number; y: number; }; }; }) => {
            if (!this.state.readOnly && event.nodes && event.nodes.length > 0) {
                const nodeId = event.nodes[0];

                this.selectedCurrentNode = this.graph.nodes.filter((n: { id: any; }) => n.id == nodeId)[0];

                this.setState({
                    ...this.initialState, ...{
                        mouseX: event.pointer.DOM.x - 2,
                        mouseY: event.pointer.DOM.y - 4,
                        multiSelection: true
                    }
                });
            }

        }
    };

    buildMenus() {
        if (this.graph.nodes && this.graph.nodes.length > 0) {
            return [<MenuItem key="ab" onClick={this.handleAddSubBenefitButtonClick}>Add sub benefit</MenuItem>,
            <MenuItem key="rb" onClick={this.handleRemoveBenefitMenuClick}>Remove Benefit</MenuItem>];
        }
        else {
            return [<MenuItem key="amb" onClick={this.handleAddRootMenuClick}>Add Main benefit</MenuItem>];
        }
    }

    renderNewNode(selectedBenefit: Benefit) {
        if (selectedBenefit) {
            const currentNodeCount = this.graph.nodes && this.graph.nodes.length || 0;

            const node: {
                id: number;
                label: string;
                title: string;
                data: Benefit;
                child: any[];
                parentBenefit?: Benefit;
                parentNode?: any;
            } = { id: ++this.count, label: `${selectedBenefit.name}`, title: `${selectedBenefit.name}`, data: selectedBenefit, child: [] };

            this.graph.nodes.push(node);
            this.networkRef.body.data.nodes.add([node]);


            /* Adding root benefit */
            if (currentNodeCount == 0) {

            }
            else {
                node.parentBenefit = this.selectedCurrentNode.data;
                this.networkRef.body.data.edges.add([{ from: this.selectedCurrentNode.id, to: node.id }]);
                this.selectedCurrentNode.data.child = [...(this.selectedCurrentNode.data.child || []), node.data];
                this.selectedCurrentNode.child.push(node);
                node.parentNode = this.selectedCurrentNode;
            }

            /* this.selectedBenefit = null;
            Object.prototype.toString.call(this.props.onChange) == "[object Function]" && this.props.onChange(this.graph.nodes[0].data);
            this.handleBenefitSelectoinDialogClose(); */

        }
    }

    addNodeClick = () => {
        if (this.selectedBenefit) {
            if (Array.isArray(this.selectedBenefit)) {
                this.selectedBenefit.forEach(item => this.renderNewNode(item));
            } else {
                this.renderNewNode(this.selectedBenefit);
            }

            this.selectedBenefit = null;

            if (typeof this.props.onChange === "function") {
                this.props.onChange(this.graph.nodes[0].data);
            }


            // Object.prototype.toString.call(this.props.onChange) == "[object Function]" && this.props.onChange(this.graph.nodes[0].data);
            this.handleBenefitSelectoinDialogClose();
        }
    }

    renderBenefitOption: any = (option: any, { selected }: { selected: any }) => {
        if (this.state.multiSelection) {
            // const selectedOpt = option.id === 'selectall' && allSelected || selected;
            const selectedOpt = option.id === 'selectall' || selected;


            return (
                <React.Fragment>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8, color: "#D80E51" }}
                        checked={selectedOpt}
                    />
                    {option.name}
                </React.Fragment>
            )
        } else {
            return <React.Fragment>{option.name}</React.Fragment>;
        }
    }


    render() {

        return (
            <div onContextMenu={this.handleRightClick} >
                <CustomGraph
                    graph={this.graph}
                    options={this.options}
                    events={this.events}
                    getNetwork={(network: any) => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                        this.networkRef = network;
                    }}
                />
                <Menu
                    keepMounted
                    open={this.state.mouseY != null}
                    onClose={this.handleCloseMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        this.state.mouseY !== null && this.state.mouseX !== null
                            ? { top: this.state.mouseY, left: this.state.mouseX }
                            : undefined
                    }
                >
                    {this.buildMenus()}

                </Menu>

                <Dialog open={this.state.openDialog}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                            this.handleBenefitSelectoinDialogClose;
                        }
                    }}
                    aria-labelledby="form-dialog-title"
                    disableEscapeKeyDown>
                    <DialogTitle id="form-dialog-title">{this.state.dialogHeader}</DialogTitle>
                    <DialogContent>
                        <FormControl >
                            <Autocomplete onChange={(event, newValue: any) => {
                                this.selectedBenefit = newValue;
                            }}
                                defaultValue={[]}
                                options={this.state.source}
                                getOptionLabel={(option) => option.name ?? ""}
                                disableCloseOnSelect={this.state.multiSelection}
                                style={{ width: 300 }}
                                multiple={this.state.multiSelection}
                                isOptionEqualToValue={(option, value) => (option.id === value.id)}
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...restProps } = props;


                                    return (
                                        <li key={option.id || `benefit-${Math.random()}`} {...restProps}>
                                            {this.renderBenefitOption(option, { selected })}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => <TextField {...params} label="Select benefit" variant="outlined" />}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleBenefitSelectoinDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addNodeClick} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <FettleConfirmDialog
                    open={this.state.showDeleteConfirmDialog}
                    title={this.state.deleteConfirmDialogTitle}
                    description={this.state.deleteConfirmDialogDesc}
                    action={this.handleRemoveDialogButtonClick}
                ><span>Are you sure want to delete <strong>{this.selectedCurrentNode?.data?.name}</strong></span>?</FettleConfirmDialog>


            </div>);
    }

}




