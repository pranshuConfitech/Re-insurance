import React from 'react'

import Avatar from '@mui/material/Avatar'
import { red } from '@mui/material/colors'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import MuiDialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'

const useStyles = makeStyles((theme: any) => ({
  root: {
    margin: 0,
    padding: theme?.spacing ? theme.spacing(5) : '40px'
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: red[500],
    marginRight: 10
  },
  closeButton: {
    position: 'absolute',
    right: theme?.spacing?theme.spacing(1):'8px',
    top: theme?.spacing?theme.spacing(1):'8px',
    color: theme?.palette?.grey[500]
  }
}))

export default function ChartDialog(props: any) {
  const classes = useStyles()
  const { open, data } = props

  const handleClose = () => {
    props.handleChartDialog(false)
  }

  return (
    <Dialog
      style={{ boxShadow: 'none' }}
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return // Prevent closing on backdrop click
        handleClose()
      }}
      aria-labelledby='form-dialog-title'
      maxWidth='xl'
      fullWidth
    >
      <MuiDialogTitle className={classes.root}>
        <div className={classes.header}>
          <Avatar aria-label='caption' className={classes.avatar}>
            {data.caption}
          </Avatar>
          <Typography variant='h3'>{data.title}</Typography>
        </div>
        {handleClose ? (
          <IconButton aria-label='close' className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
      <DialogContent dividers>
        <DialogContentText></DialogContentText>
        {data.widContent}
      </DialogContent>
    </Dialog>
  )
}
