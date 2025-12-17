import React, { useState } from 'react';

import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { makeStyles } from '@mui/styles';
import { IconButton, Typography } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';

import NodeComponent from './target.node.component';

const useStyles = makeStyles({
  treeItem: {
    '&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
      backgroundColor: 'transparent',
    },
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
});

const TreeStructure = ({ data, groupTypes, months, selectedYear }:{ data:any, groupTypes:any, months:any, selectedYear:any }) => {
  const classes = useStyles();
  const [expandedNodes, setExpandedNodes]:any = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [visibleTableNodeId, setVisibleTableNodeId] = useState(null);

  const handleNodeToggle = (event: any, nodeIds: any) => {
    setExpandedNodes(nodeIds);
  };

  const handleNodeSelect = (event:any, nodeId:any) => {
    event.preventDefault();
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  const toggleTableVisibility = (event:any, nodeId:any) => {
    event.preventDefault();

    if (!!nodeId && !expandedNodes.some((id:any) => id === nodeId)) {
      setExpandedNodes((prv:any) => [...prv, nodeId]);
    }

    setVisibleTableNodeId(prevNodeId => (prevNodeId === nodeId ? null : nodeId));
  };

  const renderTree = (nodes:any) =>
    nodes.map((node:any) => (
      <TreeItem
        key={node.id}
        nodeId={node.id}
        label={
          <div className={classes.labelRoot}>
            <Typography variant="h6">{node.name}</Typography>
            <IconButton
              color={node.id === visibleTableNodeId ? 'inherit' : 'default'}
              onClick={event => toggleTableVisibility(event, node.id)}>
              <TableChartIcon />
            </IconButton>
          </div>
        }
        className={classes.treeItem}>
        {visibleTableNodeId === node.id && (
          <NodeComponent node={node} groupTypes={groupTypes} selectedYear={selectedYear} months={months} />
        )}
        {Array.isArray(node.positionDTOs) ? renderTree(node.positionDTOs) : null}
      </TreeItem>
    ));

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expandedNodes}
      onNodeToggle={handleNodeToggle}>
      {renderTree(data)}
    </TreeView>
  );
};

export default TreeStructure;
