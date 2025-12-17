import React from 'react';

import Grid from '@mui/material/Grid';

const GridContainer = ({ children, ...rest }:any) => {
  return (
    <Grid container spacing={6} {...rest}>
      {children}
    </Grid>
  );
};

export default GridContainer;
