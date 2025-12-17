'use client'
import * as React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';

import ClaimIntimationListComponent from './claim.intimation.table.component';
import ClaimsIntimationDetailsComponent from './intimation.component';


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Intimation() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/claims/claims-intimation?mode=viewList');
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
            justifyContent: 'flex-start',
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
            Claim Management- Create Claim Intimation
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <ClaimIntimationListComponent />;
          case 'create':
            return <ClaimsIntimationDetailsComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
