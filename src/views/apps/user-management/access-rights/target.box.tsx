import React, { memo, useCallback } from 'react';

import { useDrop } from 'react-dnd';

const style = {
  height: 100,
  width: '100%',
  marginRight: '1.5rem',
  color: '#D80E51',
  padding: '1rem',
  fontSize: '1rem',
  lineHeight: 'normal',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontStyle: 'italic',
  fontWeight: 600,
};

const Dustbin = memo(function Dustbin({ onDrop, children }: { onDrop: any, children: any }) {
  const [{ canDrop, isOver }, drop]: any[] = useDrop(() => ({
    accept: 'box',
    drop: (_item, monitor) => {
      onDrop(_item);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let background = '#fafafa';

  if (isActive) {
    background = 'linear-gradient(135deg, #83e4e2 0%, #0207b5 100%)';
  } else if (canDrop) {
    // background = 'linear-gradient(135deg, rgba(162, 237, 86, 0.2) 0%, rgba(253, 220, 50, 0.2) 100%)';
    background = 'linear-gradient(135deg, rgb(66 177 219 / 20%) 0%, rgb(46 158 201 / 26%) 100%)';
  }


  return (
    <td ref={drop} role={'Dustbin'} style={{ ...style, background }}>
      {isActive ? 'Release to drop' : 'Drag a box here'}
    </td>
  );
});

export const StatefulTargetBox = (props: any) => {
  const handleDrop = useCallback((data: any) => {
    props.onDrop(data);
  }, [props]);


  return <Dustbin {...props} onDrop={handleDrop} />;
};
