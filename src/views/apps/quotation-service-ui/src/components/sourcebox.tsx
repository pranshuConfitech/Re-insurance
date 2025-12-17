import React, { memo, useMemo } from 'react';

import { useDrag } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem',
  margin: '0.5rem',
};

export const SourceBox = memo(function SourceBox({ color, children }:{ color:any, children:any }) {
  const forbidDrag = false;

  const [{ isDragging }, drag]:any = useDrag(
    () => ({
      type: color,
      canDrag: !forbidDrag,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [forbidDrag, color],
  );

  const backgroundColor = useMemo(() => {
    switch (color) {
      case 'yellow':
        return 'lightgoldenrodyellow';
      case 'blue':
        return 'lightblue';
      default:
        return 'lightgoldenrodyellow';
    }
  }, [color]);

  const containerStyle = useMemo(
    () => ({
      ...style,
      backgroundColor,
      opacity: isDragging ? 0.4 : 1,
      cursor: forbidDrag ? 'default' : 'move',
    }),
    [isDragging, forbidDrag, backgroundColor],
  );

  return (
    <div ref={drag} style={containerStyle} role="SourceBox" data-color={color}>
      <small>Forbid drag</small>
      {children}
    </div>
  );
});
