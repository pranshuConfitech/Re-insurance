import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

// import { QuotationService } from '../../../remote-api/api/quotation-services';
import { map } from 'rxjs/operators'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import moment from 'moment'

import { FundService } from '@/services/remote-api/api/fund-services/fund.services'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

// const quotationService = new QuotationService();
const feesService = new FundService()

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

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  return feesService.getFeesConfigs(pageRequest).pipe(
    map(data => {
      return data
    })
  )
}

// const data$ = new Observable(subscriber => {
//     subscriber.next(sampleData);
// });

// const dataSource$ = () => {
//     return data$.pipe(map(data => {
//         data.content = data;
//         return data;
//     }));
// };

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
  {
    field: 'corporate',
    headerName: 'CORPORATE',
    body: (rowData: any) => (
      <span style={{ lineBreak: 'anywhere' }}>{rowData?.corporate ? rowData?.corporate : '-'}</span>
    )
  },
  { field: 'contractNumber', headerName: 'CONTRACT NUMBER' },
  {
    field: 'year',
    headerName: 'CONTRACT DATE',
    body: (rowData: any) => (
      <span style={{ lineBreak: 'anywhere' }}>{moment(rowData?.contractDate).format('DD-MM-YYYY')}</span>
    )
  },
  { field: 'feesType', headerName: 'FEES TYPE' },
  { field: 'feesValue', headerName: 'FEES VALUE' },
  { field: 'percentageOfCommision', headerName: 'COMMISSION %' },
  {
    field: 'validatity',
    headerName: 'VALIDITY',
    body: (rowData: any) => (
      <span style={{ lineBreak: 'anywhere' }}>
        {moment(rowData?.validatityFrom).format('DD/MM/YYYY')} - {moment(rowData?.validityTo).format('DD/MM/YYYY')}
      </span>
    )
  }
]

const FeesListComponent = () => {
  const history = useRouter()

  const handleOpen = () => {
    history.push('/fees?mode=create')
  }

  const openEditSection = (fee: any) => {
    history.push(`/fees/${fee.id}?mode=edit`)
  }

  const xlsColumns = [
    'corporate',
    'contractNumber',
    'year',
    'feesType',
    'feesValue',
    'percentageOfCommision',
    'validatity'
  ]

  const configuration = {
    enableSelection: false,
    scrollHeight: '350px',
    pageSize: 25,

    //  actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
    actionButtons: [
      {
        key: 'update_preauth',
        icon: 'pi pi-eye',

        //   disabled: disableEnhance,
        //   className: classes.categoryButton,
        onClick: openEditSection,
        tooltip: 'Enhance'
      }
    ],
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,

      //  addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      addCreateButton: true,
      onCreateButtonClick: handleOpen,
      text: 'FEES',
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

export default FeesListComponent
