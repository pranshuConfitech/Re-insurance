import React, { memo, useCallback } from 'react';

import { useDrop } from 'react-dnd';

const TargetBox = memo(function TargetBox({ style, onDrop, children }:{ style:any, onDrop:any, children:any }) {
  const [{ isOver }, drop]:any = useDrop(
    () => ({
      accept: ['red', '#3a7cff', '#0EDB8A'],
      drop(_item, monitor) {
        onDrop(monitor.getItem());
        
return undefined;
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggingColor: '',
      }),
    }),
    [onDrop],
  );

  const opacity = isOver ? 0.6 : 0.8;

  return (
    <div ref={drop} data-color={'none'} style={{ ...style, opacity }} role="TargetBox">
      {children}
    </div>
  );
});

export const StatefulTargetBox = (props:any) => {
  const handleDrop = useCallback((data:any) => {
    props.onDrop(data);
  }, []);

  
return <TargetBox {...props} onDrop={handleDrop} style={props.style} />;
};
