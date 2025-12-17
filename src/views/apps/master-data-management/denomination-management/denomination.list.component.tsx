import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import { map } from 'rxjs/operators'

import DenominationConfirmModal from './denomination.confirm.modal.component'
import { DenominationService } from '@/services/remote-api/api/master-services/denomination.service'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
}))

const denoService = new DenominationService()

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  return denoService.getDenominations(pageRequest).pipe(
    map(data => {
      const content = data.content

      const records = content.map((item: any) => {
        item['status'] = item.flag ? 'ACTIVE' : 'DISABLED'

        return item
      })

      data.content = records

      return data
    })
  )
}

const columnsDefinations = [
  { field: 'currencyType', headerName: 'Currency Type' },
  { field: 'currencyValue', headerName: 'Currency value' },
  { field: 'status', headerName: 'Status' }
]

export default function DenominationListComponent(props: any) {
  const history = useRouter()
  const [rows, setRows] = React.useState(props.rows)
  const [selectedDeno, setSelectedDeno] = React.useState('')
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false)
  const [reloadTable, setReloadTable] = React.useState(false)

  const classes = useStyles()

  const handleOpen = () => {
    history.push('/masters/denominations?mode=create')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openDeleteSection = (deno: any) => {
    setOpenConfirmModal(true)
    setSelectedDeno(deno.id)
  }

  const closeDeleteModal = () => {
    setSelectedDeno('')
    setOpenConfirmModal(false)
  }

  const disableMenu = (item: any) => {
    return !item.flag
  }

  const handleDelete = () => {
    const comment = {
      comment: 'deleted'
    }

    denoService.deleteDenomination(comment, selectedDeno).subscribe(el => {
      setSelectedDeno('')
      setOpenConfirmModal(false)
      setReloadTable(true)
    })
  }

  const xlsColumns = ['currencyType', 'currencyValue', 'status']

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [
      { icon: 'pi pi-trash', className: 'ui-button-error', disabled: disableMenu, onClick: openDeleteSection }
    ],
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: true,
      onCreateButtonClick: handleOpen,
      text: 'Denomination Management'

      // enableGlobalSearch: true,
      //   onSelectionChange: handleSelectedRows,
      //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
      //   selectionMenuButtonText: "Action"
    }
  }

  return (
    <div>
      <DenominationConfirmModal
        openConfirmModal={openConfirmModal}
        handleDelete={handleDelete}
        closeDeleteModal={closeDeleteModal}
      />
      {/* <DataGrid rows={rows} columns={props.columns} pageSize={10} /> */}
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openDeleteSection}
        reloadtable={reloadTable}
      ></FettleDataGrid>
    </div>
  )
}
