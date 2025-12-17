"use client"
import * as React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';

import ClaimToBeProcessedListComponent from './claim.to.be.processed.list.component';


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function ClaimsToBeProcessed() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/claims/claims-to-be-processed?mode=viewList');
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
            Claim Management- Claim To Be Processed
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <ClaimToBeProcessedListComponent />;
          case 'create':
            return <ClaimToBeProcessedListComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
