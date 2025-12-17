import React from 'react';

import { useRouter } from 'next/navigation';

import { AppBar, Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';

// import SwipeableViews from 'react-swipeable-views';


function TabPanel(props:any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index:any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const ProductComponent = () => {

  const history = useRouter();

  const useStyles = makeStyles(theme => ({
    approvedButton: {
      marginLeft: '5px',
    },
  }));


  const [open, setOpen] = React.useState(false);
  const [quotationID, setQuotationID] = React.useState("");
  const [quotationNo, setQuotationNo] = React.useState("");
  const [quotationTag, setQuotationTag] = React.useState("");
  const [reloadTable, setReloadTable] = React.useState(false);
  const [quotationDateModal, setQuotationDateModal] = React.useState(false);
  const [quotationNumber, setQuotationNumber] = React.useState("");
  const [searchQuotationFromDate, setSearchQuotationFromDate] = React.useState("");
  const [searchQuotationToDate, setSearchQuotationToDate] = React.useState("");
  const [prospectName, setProspectName] = React.useState("");
  const [searchType, setSearchType] = React.useState()
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const classes = useStyles();

  const handleChange = (event:any, newValue:any) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index:any) => {
    setValue(index);
  };


  return (
    <>
      <Box sx={{
        bgcolor: 'background.paper'
      }}>
         <AppBar position="static"  color='inherit' >
          <Tabs
            value={value}
            onChange={handleChange}

            // variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="scrollable force tabs example"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#fff",
                height: "3px"
              }
            }}
          >
            <Tab label="Invoice" {...a11yProps(0)} />
            <Tab label="Fund Invoice" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        {/* <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          style={{ height: "533px" }}
        >
          <TabPanel value={value} index={0} >
              <InvoiceListComponent />
          </TabPanel>
          <TabPanel value={value} index={1}>
              <FundInvoiceListComponent />
          </TabPanel>
        </SwipeableViews> */}
      </Box>
    </>
  );
}


export default ProductComponent
