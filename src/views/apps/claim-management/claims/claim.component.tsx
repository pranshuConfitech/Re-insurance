"use client"
import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'

import ClaimsListComponent from './claim.list.component'
import ClaimsDetails from './claim.details.component'


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Claims() {
  const router = useRouter()
  const query = useSearchParams()
  const [title, setTitle] = React.useState()

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/claims/claims?mode=viewList')
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
            fontWeight: 600
          }}
        >
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Claim Management
          </span>
          <span>{title && `${title}`}</span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <ClaimsListComponent />
          case 'create':
            return <ClaimsDetails setTitle={setTitle} />
          default:
            return null;
        }
      })()}
    </div>
  )
}
