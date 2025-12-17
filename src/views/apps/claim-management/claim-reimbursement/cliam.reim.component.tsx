"use client"
import * as React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';

import ClaimReimListComponent from './claim.reim.list.component';
import ClaimsReimDetails from './cliam.reim.details.component';


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function ClaimsReimbursement() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/claims/claims-reimbursement?mode=viewList');
    }
  }, [query, router]); 

  return (
    <div>
      {query.get('mode') === 'create' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            height: '2em',
            color: '#000',
            fontSize: '18px',
            fontWeight: 600,
          }}>
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            Claim Management
          </span>
          <span>Create Claim Reimbursement</span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <ClaimReimListComponent />;
          case 'create':
            return <ClaimsReimDetails />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
