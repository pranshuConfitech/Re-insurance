// import React from 'react';

// import { useDrag } from 'react-dnd';

// const style = {
//   /* border: '1px dashed gray',
//     backgroundColor: 'white',
//     padding: '0.5rem 1rem',
//     marginRight: '1.5rem',
//     marginBottom: '1.5rem',
//     cursor: 'move',
//     float: 'left',
//     width: '100%' */

//   cursor: 'pointer',
//   boxShadow: '0.25rem 0.25rem 0.6rem rgb(0 0 0 / 5%), 0 0.5rem 1.125rem rgb(75 0 0 / 5%)',
//   background: 'white',
//   borderRadius: '0 0.5rem 0.5rem 0.5rem',
//   counterIncrement: 'gradient-counter',
//   marginTop: '0.5rem',
//   minHeight: '3rem',
//   padding: '1rem 1rem 1rem 3rem',
// };

// type Item = {
//   name: string;
//   type: string;
//   id: number | string;
//   draggable: boolean;
// };

// export const DraggableBox = function Box({ name, type, id, draggable }: Item) {
//   const [{ isDragging }, drag]: any[] = useDrag(() => ({
//     type: 'box',
//     canDrag: draggable,
//     item: { name, type, id },
//     end: (item, monitor) => {
//       const dropResult = monitor.getDropResult();

//       if (item && dropResult) {
//         // alert(`You dropped ${item.name} into ${dropResult.name}!`);
//       }
//     },
//     collect: monitor => ({
//       isDragging: monitor.isDragging(),
//       handlerId: monitor.getHandlerId(),
//     }),
//   }));

//   const background = isDragging ? 'linear-gradient(135deg, #83e4e2 0%, #0207b5 100%)' : 'white';
//   const color = isDragging ? '#fff' : '#000';


//   return (
//     <div ref={drag} role="Box" style={{ ...style, background, color }} data-testid={`box-${name}`}>
//       {name}
//     </div>
//   );
// };


import React from 'react';
import { useDrag } from 'react-dnd';

const style = {
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: '8px',
  marginTop: '8px',
  minHeight: '48px',
  padding: '12px 16px',
  position: 'relative' as 'relative',
  border: '2px solid transparent',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  fontSize: '0.875rem',
  userSelect: 'none' as 'none',
};

const beforeStyle = {
  content: '""',
  position: 'absolute' as 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  width: '4px',
  height: '60%',
  background: 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%)',
  borderRadius: '0 4px 4px 0',
  opacity: 0,
  transition: 'opacity 0.3s ease',
};

type Item = {
  name: string;
  type: string;
  id: number | string;
  draggable: boolean;
  onDoubleClick?: (item: { name: string; type: string; id: number | string }) => void;
};

export const DraggableBox = function Box({ name, type, id, draggable, onDoubleClick }: Item) {
  const [isHovered, setIsHovered] = React.useState(false);

  const [{ isDragging }, drag]: any[] = useDrag(() => ({
    type: 'box',
    canDrag: draggable,
    item: { name, type, id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // Handle drop if needed
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick({ name, type, id });
    }
  };

  const background = isDragging
    ? 'linear-gradient(135deg, #D80E51 0%, #ff4081 100%)'
    : isHovered
      ? 'linear-gradient(135deg, #fef5f8 0%, #fff0f5 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';

  const color = isDragging ? '#fff' : '#000';
  const borderColor = isDragging
    ? '#D80E51'
    : isHovered
      ? 'rgba(216, 14, 81, 0.3)'
      : 'transparent';

  const boxShadow = isDragging
    ? '0 6px 20px rgba(216, 14, 81, 0.4)'
    : isHovered
      ? '0 4px 16px rgba(216, 14, 81, 0.2)'
      : '0 2px 8px rgba(0, 0, 0, 0.08)';

  const transform = isHovered && !isDragging ? 'translateX(4px)' : isDragging ? 'scale(1.02)' : 'translateX(0)';

  return (
    <div
      ref={drag}
      role="Box"
      style={{
        ...style,
        background,
        color,
        borderColor,
        boxShadow,
        transform,
        opacity: isDragging ? 0.5 : 1
      }}
      data-testid={`box-${name}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      title="Double-click to add or drag to drop zone"
    >
      {(isHovered || isDragging) && (
        <div style={{ ...beforeStyle, opacity: isDragging ? 0 : 1 }} />
      )}
      {name}
    </div>
  );
};
