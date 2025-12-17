import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import 'date-fns'

import { Observable, map } from 'rxjs'

import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const columnsDefinations = [
  { field: 'categoryName', headerName: 'Category' },
  { field: 'startDate', headerName: 'Start Date' },
  { field: 'endDate', headerName: 'End Date' }
]

export default function ProviderCategoryHistoryModal(props: any) {
  const { categoryList, closeCategoryListModal, openCategoryListModal } = props

  const handleClose = () => {
    closeCategoryListModal()
  }

  const configuration = {
    enableSelection: true,
    scrollHeight: '300px',
    pageSize: 10,
    header: {
      enable: true,
      text: 'Category History'
    }
  }

  const data$ = new Observable(subscriber => {
    subscriber.next(categoryList)
  })

  const dataSource$ = () => {
    return data$.pipe(
      map((data: any) => {
        const records = data.map((item: any) => {
          item['startDate'] = new Date(item.startDate).toLocaleDateString()
          item['endDate'] = item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'
          
return item
        })

        data.content = records
        
return data
      })
    )
  }

  return (
    <Dialog open={openCategoryListModal} onClose={handleClose} aria-labelledby='form-dialog-title' disableEnforceFocus>
      <DialogContent>
        <FettleDataGrid $datasource={dataSource$} columnsdefination={columnsDefinations} config={configuration} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
