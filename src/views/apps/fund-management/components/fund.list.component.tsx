// import React from "react";
// const FundListComponent = () => {
// return(
//     <h1>Fund List Mangement</h1>
// )
// }

// export default FundListComponent;
'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

// import { QuotationService } from '../../../remote-api/api/quotation-services';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import sampleData from './fund.mock.data'
import RoleService from '@/services/utility/role'


import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'Fund'
const roleService = new RoleService()


// const quotationService = new QuotationService();
const useStyles = makeStyles((theme: any) => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  agentListButton: {
    marginLeft: '5px'
  },
  AccordionSummary: {
    backgroundColor: theme?.palette?.background?.default
  }
}))

const data$ = new Observable(subscriber => {
  subscriber.next(sampleData)
})

const dataSource$: any = () => {
  return data$.pipe(
    map((data: any) => {
      data.content = data

      return data
    })
  )
}

//  const dataSource$2 = (
//     pageRequest = {
//        page: 0,
//        size: 10,
//        summary: true,
//        active: true,
//      },
//    ) => {
//        pageRequest.sort = ['rowCreatedDate dsc'];
//       if (pageRequest.searchKey) {
//           pageRequest['name'] = pageRequest.searchKey;
//        }
//     return quotationService.getQuoationDetails(pageRequest);

//    };

const Accordions = (props: any) => {
  const classes = useStyles()


  return (
    <Accordion>
      <AccordionSummary
        className={classes.AccordionSummary}
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        2017
      </AccordionSummary>

      <AccordionDetails>{props.data}</AccordionDetails>
    </Accordion>
  )
}

const columnsDefinations = [
  { field: 'year', headerName: 'MONTH' },
  { field: 'details', headerName: 'DETAILS' },
  { field: 'fees', headerName: 'FEES' }, //fetch by product ID replace by product name
  { field: 'total_count', headerName: 'TOTAL COUNT' }, //fetch by plan ID replace by plan name
  { field: 'dr', headerName: 'DR' },
  { field: 'cr', headerName: 'CR' },
  { field: 'bal', headerName: 'BAL' },
  { field: 'credit_limit', headerName: 'CREDIT LIMIT' }
]

const FundListComponent = () => {
  const history = useRouter()

  const handleOpen = () => {
    history.push('/funds?mode=create')
  }

  const xlsColumns = ['year', 'details', 'fees', 'total_count', 'dr', 'cr', 'bal', 'credit_limit']

  const configuration = {
    enableSelection: false,
    scrollHeight: '350px',
    pageSize: 25,

    //  actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,

      //  addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      addCreateButton: true,
      onCreateButtonClick: handleOpen,
      text: 'FUND',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'

      //   onSelectionChange: handleSelectedRows,
      // selectionMenus: [{ icon: "attach_money_icon", text: "Blacklist", disabled: true, onClick: handleOpen }],
      //selectionMenuButtonText: "Action"
    }
  }

  return (
    <>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}

      // onEdit={openEditSection}
      ></FettleDataGrid>
    </>
  )
}

export default FundListComponent
