
'use client'
import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'

import ProductComponent from '.'
import ProductManagementForm from './product.management.form'

// function useQuery() {
//   return new URLSearchParams(useLocation().search)
// }

export default function ProductManagementComponent(props:any) {
  const query = useSearchParams()
  const router = useRouter()

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/products?mode=viewList')
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
            color: 'inherit',
            fontSize: '18px'
          }}
        >
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Product Management - Create Product
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <ProductComponent />
          case 'create':
            return <ProductManagementForm />
          default:
            return null;
        }
      })()}
    </div>
  )
}
