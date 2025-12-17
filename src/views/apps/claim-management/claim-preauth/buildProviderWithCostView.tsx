import * as React from 'react';

import { Grid, TextField } from '@mui/material';

  const BuildProviderWithCostView = (props:any) => {
    const {provider, handleApproveProviderAmount} = props;
    const [approvedCost, setApprovedCost] = React.useState();

      React.useEffect(()=>{
      setApprovedCost(provider?.approvedCost)
    },[])
  
    // let approvedCost = provider?.approvedCost
    
    return (
      <Grid container style={{ margin: "10px 0" }}>
        <Grid item xs={4}>
          {provider?.providerName}
        </Grid>
        <Grid item xs={4}>
          {provider?.estimatedCost}
        </Grid>
        <Grid item xs={4}>
          {approvedCost}
          <TextField
            type='number'
            defaultValue={approvedCost}

            // defaultValue={provider?.approvedCost}
            value={approvedCost}
            id={`approveProviderAmount-${provider?.providerId}`}
            name={`approveProviderAmount-${provider?.providerId}`}
            onChange={(e) => handleApproveProviderAmount(e, provider)}
          />
        </Grid>
      </Grid>
    );
  };


  export default BuildProviderWithCostView;
