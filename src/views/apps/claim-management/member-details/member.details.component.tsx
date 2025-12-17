import * as React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Grid from '@mui/material/Grid';

import MembersDetails from './members.list.component';


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function MemberDetailsComponent() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/claims/member-details?mode=viewList');
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
            Member Details Component
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <MembersDetails />;
          case 'create':
            return <h3>Component creation pending</h3>
          default:
            return null;
        }
      })()}
    </div>
  );
}
