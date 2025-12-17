import React, { useMemo } from "react";
import { Autocomplete, Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface BenefitOption {
    id: string;
    name: string;
    code?: string;
    description?: string | null;
    [key: string]: any;
}

export interface HierarchyNodeData extends Record<string, unknown> {
    nodeId: string;
    benefit: BenefitOption | null;
    options: BenefitOption[];
    readOnly: boolean;
    isRoot: boolean;
    onSelect: (nodeId: string, benefit: BenefitOption | null) => void;
    onAddChild: (nodeId: string) => void;
    onRemove: (nodeId: string) => void;
    canAddChild: boolean;
    canRemove: boolean;
}

export const HierarchyNode: React.FC<NodeProps> = (props) => {
    const data = (props.data ?? {}) as HierarchyNodeData;

    const options = Array.isArray(data.options) ? (data.options as BenefitOption[]) : [];

    const selectedValue = useMemo(() => {
        if (!data?.benefit) {
            return null;
        }

        const match = options.find(option => option.id === data.benefit?.id);
        return match ?? data.benefit;
    }, [data?.benefit, options]);

    return (
        <Box
            className="benefit-hierarchy-node nopan"
            sx={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.08)',
                minWidth: 260,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                cursor: 'default',
            }}
        >
            <Typography variant="caption" color="text.secondary">
                {data.benefit?.code ? `Code: ${data.benefit.code}` : 'Select benefit'}
            </Typography>
            <Autocomplete
                className="nopan"
                disabled={data?.readOnly}
                value={selectedValue}
                onChange={(_, newValue) => {
                    console.log('[BenefitTree][Node] autocomplete change', {
                        nodeId: data?.nodeId,
                        selectedId: (newValue as BenefitOption | null)?.id
                    });
                    data.onSelect?.(data.nodeId, newValue as BenefitOption | null);
                }}
                options={options}
                openOnFocus
                disablePortal={false}
                ListboxProps={{
                    className: 'nopan'
                }}
                componentsProps={{
                    paper: {
                        className: 'nopan benefit-popover-paper',
                        elevation: 8,
                        sx: {
                            zIndex: 9999,
                            minWidth: 240
                        }
                    },
                    popper: {
                        className: 'nopan benefit-popover-wrapper',
                        modifiers: [
                            {
                                name: 'setZIndex',
                                enabled: true,
                                phase: 'write',
                                fn: ({ state }: any) => {
                                    state.styles.popper.zIndex = 9999;
                                }
                            }
                        ]
                    }
                }}
                onOpen={() => {
                    console.log('[BenefitTree][Node] autocomplete open', { nodeId: data?.nodeId });
                }}
                onClose={() => {
                    console.log('[BenefitTree][Node] autocomplete close', { nodeId: data?.nodeId });
                }}
                getOptionLabel={(option) => option?.name ?? ''}
                renderOption={(renderProps, option: BenefitOption) => (
                    <li
                        {...renderProps}
                        key={option.id}
                        className="nopan"
                        style={{ padding: '6px 12px' }}
                    >
                        <Typography variant="body2" color="text.primary">
                            {option.name || option.code}
                        </Typography>
                    </li>
                )}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        className="nopan"
                        label="Benefit"
                        size="small"
                    />
                )}
                fullWidth
            />
            {!data?.readOnly && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                    <Tooltip title="Add child node">
                        <span>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => data.onAddChild?.(data.nodeId)}
                                disabled={!data?.canAddChild}
                            >
                                <AddCircleOutlineIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {data?.canRemove && (
                        <Tooltip title="Remove node">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => data.onRemove?.(data.nodeId)}
                            >
                                <RemoveCircleOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            )}
            <Handle
                type="source"
                position={Position.Right}
                style={{ opacity: 0 }}
                isConnectable={false}
            />
            {!data?.isRoot && (
                <Handle
                    type="target"
                    position={Position.Left}
                    style={{ opacity: 0 }}
                    isConnectable={false}
                />
            )}
        </Box>
    );
};
