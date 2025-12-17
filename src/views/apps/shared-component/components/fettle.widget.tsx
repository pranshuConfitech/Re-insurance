import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import {makeStyles} from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MinimizeIcon from '@mui/icons-material/Minimize';

const useStyles = makeStyles((theme:any) => ({
  widgetContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 15,
  },
  root: {
    maxWidth: 550,
    flex: '1 0 0',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',

    // transition: theme?.transitions?.create('transform', {
    //   duration: theme?.transitions?.duration?.shortest,
    // }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: theme?.palette?.secondary.main,
  },
  accContainer: {
    boxShadow: 'none !important',
  },
  AccordionSummary: {
    minHeight: '0 !important',
    backgroundColor: theme?.palette?.secondary?.main,
    height: '0 !important',
  },
  cardBackground: {
    backgroundColor: theme?.palette?.background?.default,
  },
}));

export function FettleWidget(props:any) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    props.handleClose();
  };

  const doFullScreen = () => {
    props.doFullScreen(true, props);
  };

  return (
    <Card className={classes.root} style={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.1' }}>
      <CardHeader
        avatar={
          <Avatar aria-label="caption" className={classes.avatar}>
            {props.caption}
          </Avatar>
        }
        action={
          <CardActions disableSpacing>
            <IconButton aria-label="minimize" onClick={() => handleExpandClick()}>
              <MinimizeIcon />
            </IconButton>
            <IconButton aria-label="fullscreen" onClick={() => doFullScreen()}>
              <FullscreenIcon />
            </IconButton>
            <IconButton aria-label="close" onClick={() => handleClose()}>
              <CloseIcon />
            </IconButton>
          </CardActions>
        }
        title={props.title}
        subheader=""
        className={classes.cardBackground}
      />
      <CardContent>
        <Accordion expanded={expanded} className={classes.accContainer} elevation={0}>
          <AccordionSummary className={classes.AccordionSummary} sx={{ '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }}></AccordionSummary>
          <AccordionDetails >{props.widContent}</AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
