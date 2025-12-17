"use client"
import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'

import CreditClaimsDetails from './credit.details.component'
import CreditListComponent from './credit.list.component'


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Credit() {
  const router = useRouter()
  const query = useSearchParams()
  const [title, setTitle] = React.useState()

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/claims/credit?mode=viewList')
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
            Credit Claim Management
          </span>
          <span>{title && `${title}`}</span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <CreditListComponent />
          case 'create':
            return <CreditClaimsDetails setTitle={setTitle} />
          default:
            return null;
        }
      })()}
    </div>
  )
}
