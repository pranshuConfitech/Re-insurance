import React, { memo, SyntheticEvent, useEffect, useMemo } from 'react';

import { alpha, IconButton, Menu, MenuItem, SvgIcon, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/system';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssistantIcon from '@mui/icons-material/Assistant';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DescriptionIcon from '@mui/icons-material/Description';
// import TreeItem from '@mui/lab/TreeItem';
import PropTypes from 'prop-types';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated } from 'react-spring';
import SendIcon from '@mui/icons-material/Send';
import { TreeView, TreeItem } from '@mui/x-tree-view';

function MinusSquare(props: any) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: any) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0-.375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: any) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  in: PropTypes.bool,
};

const useTreeItemStyles: any = makeStyles((theme: any) => ({
  root: {
    color: theme?.palette?.text?.secondary,
    '&:hover > $content': {
      backgroundColor: theme?.palette?.action?.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme?.palette?.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme?.palette?.text?.secondary,
    borderTopRightRadius: theme?.spacing ? theme.spacing(2) : '16px',
    borderBottomRightRadius: theme?.spacing ? theme.spacing(2) : '16px',
    paddingRight: theme?.spacing ? theme.spacing(1) : '8px',
    fontWeight: theme?.typography?.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme?.typography?.fontWeightRegular,
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme?.spacing ? theme.spacing(0.5, 0) : '4px',
  },
  labelIcon: {
    marginRight: theme?.spacing ? theme.spacing(1) : '8px',
  },
  labelText: {
    fontWeight: 'inherit',

    /* flexGrow: 1, */
  },
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px solid ${(theme?.palette?.text?.primary, 0.2)}`,
  },
}));

const HtmlTooltip = styled(Tooltip)(({ theme }: { theme: any }) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme?.typography?.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const StyledTreeItem: any = memo(function StyledTreeItem(props: any) {
  const classes = useTreeItemStyles();

  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    nodeData,
    showAsTooltip,
    hideRightInfo,
    showActionBtn,
    draggable,
    displayName,
    ...other
  } = props;

  const paramData = JSON.stringify(nodeData);

  const [{ isDragging }, drag]: any[] = useDrag(
    () => ({
      type: color,
      item: nodeData,
      canDrag: draggable,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [draggable, color],
  );

  const containerStyle = useMemo(
    () => ({
      opacity: isDragging ? 0.9 : 1,
      cursor: !draggable ? 'default' : 'move',
    }),
    [isDragging, draggable],
  );

  const handleInfo = (e: any) => {
    if (props.activateRgtClck) {
      e.preventDefault();
      let selectedData =
        e.target.parentElement.getAttribute('data-nodeData') ||
        e.target.parentElement.parentElement.getAttribute('data-nodeData');

      selectedData = JSON.parse(selectedData);
      props.showListView(selectedData.employeeList);
    }
  };

  const handleDescription = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    props.handleDescription(nodeData);
  };

  return (
    <div ref={drag} style={containerStyle} role="SourceBox">
      <TreeItem
        label={
          <div className={classes.labelRoot}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <HtmlTooltip
                disableHoverListener={!showAsTooltip}
                disableFocusListener
                disableTouchListener
                title={
                  labelInfo && (
                    <React.Fragment>
                      <Typography color="inherit">{labelInfo}</Typography>
                    </React.Fragment>
                  )
                }>
                <div style={{ display: 'flex', alignItems: 'center' }} data-nodedata={paramData}>
                  <Typography variant="h6" className={classes.labelText}>
                    {nodeData?.level == '2' && (
                      <span style={{ color: '#1976d2', fontWeight: 600 }}>REGION</span>
                    )}
                    {nodeData?.level == '3' && (
                      <span style={{ color: '#388e3c', fontWeight: 600 }}>BRANCH</span>
                    )}
                    {nodeData?.level == '4' && (
                      <span style={{ color: '#CC5500', fontWeight: 600 }}>UNIT</span>
                    )}
                    {nodeData?.level == '5' && (
                      <span style={{ color: '#d32f2f', fontWeight: 600 }}>AGENT</span>
                    )}
                  </Typography>
                  &nbsp;&nbsp;
                  <Typography variant="h6" className={classes.labelText}>
                    {labelText}
                    {displayName && (
                      <> <span style={{ fontWeight: 600 }}>({displayName})</span></>
                    )}
                    {!labelText && !displayName && labelInfo}
                  </Typography>
                </div>
              </HtmlTooltip>
              {!hideRightInfo && (
                <Typography variant="subtitle1" color="inherit" onClick={handleInfo}>
                  {labelInfo}
                </Typography>
              )}
              {labelInfo && showActionBtn && (
                <IconButton color="primary" aria-label="info" component="span" onClick={handleDescription}>
                  <DescriptionIcon />
                </IconButton>
              )}
            </div>
          </div>
        }
        style={{
          '--tree-view-color': color,
          '--tree-view-bg-color': 'rgba(232, 236, 241,1)',
        }}
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          selected: classes.selected,
          group: classes.group,
          label: classes.label,
        }}
        {...other}
      />
    </div>
  );
});

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles: any = makeStyles((theme: any) => ({
  rootTreeView: {
    /* height: 264,
        flexGrow: 1,
        maxWidth: 400, */
  },
}));

interface NodeData {
  parentId?: string;
  [key: string]: any;
}
export function FettleHierarchyTreeViewComponent(props: any) {
  const classes = useStyles();

  const [hierarchy, setHierarchy] = React.useState([]);
  const [expanded, setExpanded] = React.useState<any>([]);
  const [selected, setSelected] = React.useState<any>([]);
  const [selectedNodeData, setSelectedNodeData] = React.useState<NodeData>({});
  const [posState, setPosState] = React.useState({ mouseX: 0, mouseY: 0 });

  useEffect(() => {
    setHierarchy(props.hierarchy || []);
    defaultExpandedTree(props.hierarchy || []);
  }, [props.hierarchy]);

  const handleToggle = (event: SyntheticEvent, nodeIds: any) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: any, value: any) => {
    let nodeData =
      event.target.parentElement.getAttribute('data-nodeData') ||
      event.target.parentElement.parentElement.getAttribute('data-nodeData');
    nodeData = JSON.parse(nodeData);
    if (typeof props.onNodeSelect === 'function') props.onNodeSelect(nodeData);
  };

  const handleRightClick = (event: any) => {
    if (props.activateRgtClck) {
      event.preventDefault();
      let nodeData =
        event.target.parentElement.getAttribute('data-nodeData') ||
        event.target.parentElement.parentElement.getAttribute('data-nodeData');
      nodeData = JSON.parse(nodeData);
      setSelectedNodeData(nodeData);
      setPosState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };

  const renderTree = (nodes: any, draggable: any) => {
    const key = nodes.id;
    const name = nodes.description || nodes.name || 'Unknown';
    const displayName = nodes.userDisplayName || '';
    const children = nodes.positionDTOs || [];

    let labelIcon = BookmarkIcon;
    let color = '#0EDB4A';

    if (nodes.type === 'rule') {
      labelIcon = AssignmentIcon;
      color = '#3a7cff';
    } else if (nodes.type?.includes('premium')) {
      labelIcon = AssistantIcon;
      color = '#0EDB8A';
    }

    const labelInfo = nodes.expression || '';
    return (
      <StyledTreeItem
        key={key}
        itemId={key}
        labelText={name}
        displayName={displayName}
        labelIcon={labelIcon}
        labelInfo={labelInfo}
        nodeData={nodes}
        showAsTooltip={props.showAsTooltip}
        hideRightInfo={props.hideRightInfo}
        showActionBtn={props.showActionBtn}
        draggable={draggable}
        color={color}
      >
        {Array.isArray(children) ? children.map((node: any) => renderTree(node, draggable)) : null}
      </StyledTreeItem>
    );
  };

  const defaultExpandedTree = (previewHierarchy: any) => {
    const collectIds = (nodes: any[]): any[] => {
      return nodes.reduce((acc: any[], node: any) => {
        acc.push(node.id);
        if (node.positionDTOs?.length > 0) {
          acc = acc.concat(collectIds(node.positionDTOs));
        }
        return acc;
      }, []);
    };
    const allIds = collectIds(previewHierarchy);
    setExpanded(allIds);
  };

  const handleAddEmployee = (e: any) => {
    e.stopPropagation();
    handleCloseMenu();
    if (selectedNodeData?.parentId) {
      props.addEmployee(selectedNodeData);
    }
  };

  const handleAddPosition = (e: any) => {
    e.stopPropagation();
    handleCloseMenu();
    props.addPosition(selectedNodeData);
  };

  const handleDeletePosition = (e: any) => {
    e.stopPropagation();
    handleCloseMenu();
    props.deletePosition(selectedNodeData);
  };

  const handleCloseMenu = () => {
    setPosState({ mouseX: 0, mouseY: 0 });
  };

  return (
    <div onContextMenu={handleRightClick}>
      <DndProvider backend={HTML5Backend}>
        <TreeView
          className={classes.rootTreeView}
          slots={{
            collapseIcon: () => <span>{<MinusSquare />}</span>,
            expandIcon: () => <span><PlusSquare /></span>,
            endIcon: () => <span><SendIcon /></span>,
          }}
          // defaultCollapseIcon={<MinusSquare />}
          // defaultExpandIcon={<PlusSquare />}
          // defaultEndIcon={<SendIcon />}
          expandedItems={expanded}
          onExpandedItemsChange={handleToggle}
          selectedItems={selected}
          onSelectedItemsChange={(event: any, ids: any) => setSelected(ids)}
        >
          {hierarchy.length > 0
            ? hierarchy.map((item: any) => renderTree(item, true))
            : <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>No hierarchy data available.</Typography>
          }
        </TreeView>
      </DndProvider>
      {props.activateRgtClck && (
        <Menu
          keepMounted
          open={posState.mouseY !== 0}
          onClose={handleCloseMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            posState.mouseY !== 0 && posState.mouseX !== 0
              ? { top: posState.mouseY, left: posState.mouseX }
              : undefined
          }
        >
          {/* {selectedNodeData?.parentId && (
            <MenuItem key="add-user" onClick={handleAddEmployee}>
              Add User
            </MenuItem>
          )} */}
          {!(selectedNodeData?.level == "4" || selectedNodeData?.level == "5") && (
            <MenuItem key="add-position" onClick={handleAddPosition}>
              Add Position
            </MenuItem>
          )}
          {props.deleteAction && (
            <MenuItem key="delete-position" onClick={handleDeletePosition}>
              Delete Position
            </MenuItem>
          )}
        </Menu>
      )}
    </div>
  );
}
