import React from 'react';
import { Box, Skeleton } from '@mui/material';

const DataGridSkeleton: React.FC<{ rows?: number; columns?: number; checkboxSelection?: boolean }> = ({ rows = 5, columns = 10, checkboxSelection = false }) => {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 1, mb: 1, padding: 2 }}>
          {Array.from({ length: columns }).map((_, colIndex) => {

            return (
              <Skeleton
                key={`${rowIndex}_${colIndex}`}
                variant="rectangular"
                width={220}
                height={36}
                animation="wave"
              />
            )
          })}
        </Box>
      ))}
    </Box>
  );
};
export default DataGridSkeleton;
