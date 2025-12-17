import React, { useEffect } from 'react'

import { Box } from '@mui/material'
import Link from '@mui/material/Link'
import { makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

/* import DeleteIcon from "@mui/icons-material/Delete"; */
import EditIcon from '@mui/icons-material/Edit'

/* import VisibilityIcon from "@mui/icons-material/Visibility"; */
import { PremiumFrequencyService } from '@/services/remote-api/api/master-services'

const premiumFrequencyService = new PremiumFrequencyService()

const freq$ = premiumFrequencyService.getPremiumFrequencies()

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  actionBlock: {
    textAlign: 'center',
    '& a:nth-child(2)': {
      marginLeft: 10,
      marginRight: 15
    }
  }
})

type PropsType = {
  forBenefit: any
  setEditIndex: any
  ruleList: any
  handleEdit: any
  onClickEdit: any
}

export default function PremiumRuleTable({ forBenefit, setEditIndex, ruleList, handleEdit, onClickEdit }: PropsType) {
  const classes = useStyles()
  const [premiumFrequncyList, setPremiumFrequncyList] = React.useState<any>([])
  const preventDefault = (event: any) => event.preventDefault()

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(freq$, setPremiumFrequncyList)

  const getFrequencyName = (id: any) => {
    if (premiumFrequncyList.length === 0 || !id) return ''

    return premiumFrequncyList.find((f: any) => f.id === id).name
  }

  const handleEditClick = (e: any) => {
    ;(Object.prototype.toString.call(handleEdit) == '[object Undefined]' && handleEdit()) || preventDefault(e)
  }

  let component = null

  if (ruleList && ruleList.length > 0) {
    component = (
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>Rule Definition</TableCell>
            <TableCell align='center'>Premium Amount</TableCell>
            <TableCell align='center'>Payment Frequency</TableCell>
            <TableCell align='center'>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ruleList?.map((rule: any, idx: any) => (
            <TableRow key={idx}>
              <TableCell align='center'>{rule.ruleDefinition || rule.expression}</TableCell>
              <TableCell align='center'>
                {rule?.premiumPaymentFrequencies?.map((p: any, id: any) => (
                  <div key={`amt${id}`}>{p.premiumAmount}</div>
                ))}
              </TableCell>
              <TableCell align='center'>
                {rule?.premiumPaymentFrequencies?.map((p: any, id: any) => (
                  <div key={`freq${id}`}>{getFrequencyName(p.premiumPaymentFrequncyId)}</div>
                ))}
              </TableCell>
              <TableCell className={classes.actionBlock}>
                {/* <Link href="javascript:void(0)" onClick={preventDefault} >
                                        <VisibilityIcon />
                                    </Link> */}
                <Link
                  href='javascript:void(0)'
                  onClick={() => {
                    onClickEdit(idx)
                  }}
                >
                  <EditIcon style={{ color: '#D80E51' }} />
                </Link>
                {/* <Link href="javascript:void(0)" onClick={preventDefault}>
                                        <DeleteIcon />
                                    </Link> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  } else {
    component = (
      <Box alignItems='center' pt={30} pb={30} justifyContent='center' display='flex' width='100%' height='100%'>
        <span>No premiums are available</span>
      </Box>
    )
  }

  return component
}
