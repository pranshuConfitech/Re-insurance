
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import { map, switchMap } from 'rxjs/operators'

import { ClientService } from '@/services/remote-api/api/client-services'
import { ClientTypeService } from '@/services/remote-api/api/master-services'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

// import { CloseOutlined } from '@material-ui/icons';
// import { Box, Button, Modal, TextField, useTheme } from '@material-ui/core';

const clienttypeervice = new ClientTypeService()

const PAGE_NAME = 'CLIENT'
const roleService = new RoleService()

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
}))

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  background: '#fff',

  // border: '2px solid #000',
  boxShadow: 24,
  padding: '2% 3%'
}

const clientService = new ClientService()

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true

    // contactNo:contactNum,
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['name'] = pageRequest.searchKey.trim()
    pageRequest['fullName'] = pageRequest.searchKey.trim()
    pageRequest['contactNo'] = pageRequest.searchKey.trim()

    //   pageRequest["clientTypeCd"] = pageRequest.searchKey;
  }

  delete pageRequest.searchKey

  return clientService
    .getClients(pageRequest)
    .pipe(
      map(data => {
        const content = data.content

        const records = content.map((item: any) => {
          item['clientBasicDetails']['primaryContact'] = item.clientBasicDetails.contactNos[0].contactNo

          return item
        })

        data.content = records

        return data
      })
    )
    .pipe(
      switchMap(data => {
        return clienttypeervice.getCleintTypes().pipe(
          map(ct => {
            data.content.forEach((cl: any) => {
              ct.content.forEach(clienttype => {
                if (cl.clientBasicDetails.clientTypeCd === clienttype.code) {
                  cl['clientTypeName'] = clienttype.name
                }
              })
            })

            return data
          })
        )
      })
    )
}

const columnsDefinations = [
  { field: 'clientBasicDetails.displayName', headerName: 'Name' },
  { field: 'clientBasicDetails.code', headerName: 'Client Code' },
  { field: 'clientTypeName', headerName: 'Client Type' },
  { field: 'clientBasicDetails.primaryContact', headerName: 'Contact Number' }
]

const xlsColumns = [
  'clientBasicDetails.displayName',
  'clientBasicDetails.code',
  'clientTypeName',
  'clientBasicDetails.primaryContact'
]

const ClientListComponent = (props?: any) => {
  const classes = useStyles()
  const router = useRouter()
  const [contactNumber, setContactNumber] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleCreate = () => {
    router.push('/client/clients?mode=create')
  }

  const openEditSection = (client?: any) => {
    router.push(`/client/clients/${client.id}?mode=edit`)
  }

  const configuration = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleCreate,
      text: 'Client Management',
      enableGlobalSearch: true,
      searchText: 'Search by code, name',
      selectionMenuButtonText: 'Advance Search'
    }
  }

  // const hasAccess = accessName => {
  //   const access_details = JSON.parse(localStorage.getItem('access_details'));
  //   const accessList = access_details.filter(ad => ad.indexOf(PAGE_NAME) > -1).map(ac => ac.split('_')[0]);
  //   const status = accessList.some(a => a.indexOf(accessName) > -1);
  //   if (accessName === 'UPDATE') {
  //     if (status) {
  //       return [
  //         {
  //           icon: 'pi pi-user-edit',
  //           className: 'ui-button-warning',
  //           onClick: this.openEditSection,
  //         },
  //       ];
  //     } else {
  //       return [];
  //     }
  //   } else {
  //     return status;
  //   }
  // };

  const contactClick = () => {
    setShowModal(true)
  }

  const handleChange = (e: { target: { value: any } }) => {
    setContactNumber(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Process contactNumber logic here
    setShowModal(false)
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={dataSource$}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        config={configuration}

        // reloadtable={reloadTable}
      />
    </div>
  )
}

export default ClientListComponent
