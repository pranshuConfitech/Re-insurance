import React from 'react';

import { useDrag } from 'react-dnd';

const style = {
  /* border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
    width: '100%' */

  cursor: 'pointer',
  boxShadow: '0.25rem 0.25rem 0.6rem rgb(0 0 0 / 5%), 0 0.5rem 1.125rem rgb(75 0 0 / 5%)',
  background: 'white',
  borderRadius: '0 0.5rem 0.5rem 0.5rem',
  counterIncrement: 'gradient-counter',
  marginTop: '0.5rem',
  minHeight: '3rem',
  padding: '1rem 1rem 1rem 3rem',
};

type Item = {
  name: string;
  type: string;
  id: number | string;
  draggable: boolean;
};

export const DraggableBox = function Box({ name, type, id, draggable }:Item) {
  const [{ isDragging }, drag] :any[]= useDrag(() => ({
    type: 'box',
    canDrag: draggable,
    item: { name, type, id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (item && dropResult) {
        // alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const background = isDragging ? 'linear-gradient(135deg, #83e4e2 0%, #0207b5 100%)' : 'white';
  const color = isDragging ? '#fff' : '#000';

  
return (
    <div ref={drag} role="Box" style={{ ...style, background, color }} data-testid={`box-${name}`}>
      {name}
    </div>
  );
};
