import React from 'react';

import Paper from '@mui/material/Paper';
import type { DraggingStyle, DropResult, NotDraggingStyle } from 'react-beautiful-dnd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

interface FettleDragNDropProps {
  items: Array<{ id: string; content: string }>;
  onChange?: (items: { id: string; content: string }[]) => void;
  children?: React.ReactNode; 
}

// Define state interface
interface FettleDragNDropState {
  items: Array<{ id: string; content: string }>;
}


// a little function to help us with reordering the result
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);
  
return result;
}


const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#fff',
  borderRadius: 4,
  boxShadow: isDragging
    ? '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)'
    : '',

  // spread draggableStyle and handle case where it's undefined
  ...(draggableStyle || {}),
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  width: '100%',

  /* minHeight: '300px' */
});

export class FettleDragNDrop extends React.Component<FettleDragNDropProps,FettleDragNDropState> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: props.items || [],
    }; /* id and content is mandatory */

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate(prevProps: { items: any; }) {
    if (prevProps.items != this.props.items) {
      this.setState({ ...this.state, items: this.props.items });
    }
  }

  onDragEnd(result: DropResult) {
    const { destination, source } = result;


    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(this.state.items, result.source.index, result.destination.index);

    this.setState({
      items,
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(items);
    }

    // Object.prototype.toString.call(this.props.onChange) == '[object Function]' && this.props.onChange(items);
  }

  renderChild = (chidElm:any, idx:number) => {
    const elmId = chidElm.props
      ? chidElm.props.id
        ? chidElm.props.id
        : chidElm.key
      : chidElm.id
      ? chidElm.id
      : chidElm.key;

    
return (
      <Draggable key={elmId} draggableId={elmId} index={idx}>
        {(provided, snapshot) => (
          <Paper elevation={0}>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
              {chidElm.props ? chidElm : chidElm.content}
            </div>
          </Paper>
        )}
      </Draggable>
    );
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    let childrenWithProps:React.ReactNode;

    if (this.props.children) {
      childrenWithProps = React.Children.map(this.props.children, child => {
        
        // return elements.map((chidElm, idx) => this.renderChild(chidElm, idx));
        if (React.isValidElement(child)) {
          const elements = React.Children.toArray(child.props.children);

          
return elements.map((chidElm, idx) => this.renderChild(chidElm, idx));
        }

        
return null; 
      });
    } else {
      childrenWithProps = this.state.items.map((chidElm, idx) => this.renderChild(chidElm, idx));
    }

    return (
      <div className="fettle-drag-drop-container">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {childrenWithProps}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}
