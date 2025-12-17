'use client'
import * as React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';

import CardDetailsComponent from './card.details.component';
import CardListComponent from './card.list.component';


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Cards() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/bank-management/cards?mode=viewList');
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
            Card Management- Create card
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <CardListComponent />;
          case 'create':
            return <CardDetailsComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
