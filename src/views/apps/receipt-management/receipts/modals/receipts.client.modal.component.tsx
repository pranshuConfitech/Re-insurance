import * as React from 'react'

import { Button } from 'primereact/button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import 'date-fns'

import { of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import { FettleMultiFieldSearch } from '@/views/apps/shared-component/components/fettle.multi.field.search'

const clientservice = new ClientService()
const prospectservice = new ProspectService()

export default function ReceiptClientModal(props: any) {
  // const formik = useFormik({
  //     initialValues: {
  //         remarks: "",
  //         startDate: new Date().getTime()
  //     },
  //     validationSchema: validationSchema,
  //     onSubmit: (values) => {
  //         handleModalSubmit();
  //     },
  // });

  // const [openBlacklistModal, setOpenBlacklistModal] = React.useState(false);
  // useEffect(() => {
  //     setOpenBlacklistModal(props.openBlacklistModal);
  // }, [props.openBlacklistModal]);

  const handleModalSubmit = (e: any) => {}

  const handleClose = () => {
    props.handleCloseClientModal()
  }

  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date())

  const handleStartDateChange = (date: any) => {
    setSelectedStartDate(date)
    const timestamp = new Date(date).getTime()

    // formik.setFieldValue('startDate', timestamp);
  }

  const dataSource$ = (fields: any, pageRequest = { page: 0, size: 10 }) => {
    const pagerequestquery: any = {
      page: pageRequest.page,
      size: pageRequest.size,
      summary: false
    }

    Object.keys(fields)
      .filter(key => !!fields[key])
      .forEach(key => (pagerequestquery[key] = fields[key]))

    return clientservice
      .importClient(pagerequestquery)
      .pipe(
        map(data => {
          const content = data.content

          if (content.length > 0) {
            const records = content.map((item: any) => {
              item['contactNo'] = item.clientBasicDetails.contactNos[0].contactNo
              item['code'] = item.clientBasicDetails.code
              item['name'] = item.clientBasicDetails.displayName
              item['email'] = item.clientBasicDetails.emails[0].emailId
              item['clientType'] = 'Client'

              return item
            })

            data.content = records

            // return data;
          }

          return data
        })
      )
      .pipe(
        switchMap(data => {
          const pagerequestquery2: any = {
            page: pageRequest.page,
            size: pageRequest.size,
            summary: false
          }

          Object.keys(fields)
            .filter(key => !!fields[key])
            .forEach(key => (pagerequestquery2[key] = fields[key]))

          if (data.content.length === 0) {
            return prospectservice.importProspectData(pagerequestquery2).pipe(
              map(data2 => {
                const content2 = data2.content

                const records2 = content2.map((item2: any) => {
                  item2['contactNo'] = item2.mobileNo
                  item2['code'] = item2.code
                  item2['name'] = item2.displayName
                  item2['email'] = item2.emailId
                  item2['clientType'] = 'Prospect'

                  return item2
                })

                data2.content = records2

                return data2
              })
            )
          } else return of(data)
        })
      )
  }

  const fields = [
    { label: 'Code', propertyName: 'code' },
    { label: 'Name', propertyName: 'name' }
  ]

  const fields2 = [
    { label: 'Code', propertyName: 'code' },
    { label: 'Name', propertyName: 'displayName' },
    { label: 'Contact', propertyName: 'mobileNo' }
  ]

  const columnsDefinations = [
    { field: 'code', headerName: 'Code' },
    { field: 'name', headerName: 'Name' },
    { field: 'contactNo', headerName: 'Contact' }
  ]

  const handleImport = (item: any) => {
    props.handleSubmitClientModal(item)
  }

  return (
    <Dialog open={props.openClientModal} onClose={handleClose} aria-labelledby='form-dialog-title' disableEnforceFocus>
      <DialogTitle id='form-dialog-title'>Select Client</DialogTitle>
      <DialogContent>
        <FettleMultiFieldSearch
          $datasource={dataSource$}
          fields={fields}
          onSelect={(item: any) => {
            handleImport(item)
          }}
          columnsDefinations={columnsDefinations}
          dataGridPageSize={10}
          dataGridScrollHeight='400px'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className='p-button-text' color='primary'>
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color='primary'>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
