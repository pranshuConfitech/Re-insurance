'use client'
import * as React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';
import ClaimInwardListComponent from './claim.inward.table.component';
import ClaimsInwardDetailsComponent from './inward.component';



// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Inward() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/claims/claims-inwards?mode=viewList');
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
            Claim Inward - Create Claim Inward
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <ClaimInwardListComponent />;
          case 'create':
            return <ClaimsInwardDetailsComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
