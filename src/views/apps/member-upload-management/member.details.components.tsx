import * as React from 'react'

// import { useTheme } from '@mui/material/styles';
import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material'

import { TabPanel, TabView } from 'primereact/tabview'

import MemberBasicDetails from './member.basic.details'
import MemberDocumentsDetails from './member.documents.details '
import MemberGenralInfoDetails from './member.genralInfo.details '
import MemberPolicyDetails from './member.policy.details '
import MemberQuestionnair from './memeber-questionnair'

import { MemberService } from '@/services/remote-api/api/member-services/member.services'

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     'aria-controls': `full-width-tabpanel-${index}`,
//   };
// }

function MemberDetail() {
  const theme = useTheme()
  const id: any = useParams().id
  const [value, setValue] = React.useState(0)
  const [memberData, setMemberData] = React.useState()
  const [activeIndex, setActiveIndex] = React.useState(0)

  const memberService = new MemberService()

  React.useEffect(() => {
    // let membershipNo = id.replace(/\-/g, "/")
    const pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      key: 'MEMBER_ID',
      value: id
    }

    // console.log("mem", membershipNo)
    memberService.getMemberDetail(pageRequest).subscribe(val => {
      setMemberData(val.content[0])
    })
  }, [])

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: any) => {
    setValue(index)
  }
  console.log(memberData);
  return (
    <TabView
      scrollable
      style={{ fontSize: '14px', marginTop: '10px', borderRadius: '8px 8px 0 0' }}
      activeIndex={activeIndex}
      onTabChange={e => setActiveIndex(e.index)}
    >
      <TabPanel leftIcon='pi pi-user mr-2' header='Basic Details'>
        <MemberBasicDetails memberData={memberData} />
      </TabPanel>
      <TabPanel leftIcon='pi pi-user-minus mr-2' header='Policy Details'>
        <MemberPolicyDetails memberData={memberData} />
      </TabPanel>
      <TabPanel leftIcon='pi pi-money-bill mr-2' header='Questionnaire'>
        {/* No Info */}
        <MemberQuestionnair memberData={memberData} />
      </TabPanel>
      <TabPanel leftIcon='pi pi-file-pdf mr-2' header='Documents'>
        <MemberDocumentsDetails />
      </TabPanel>
      <TabPanel leftIcon='pi pi-file-pdf mr-2' header='General Information'>
        <MemberGenralInfoDetails />
      </TabPanel>
    </TabView>

    // <Box sx={{ bgcolor: 'background.paper' }}>
    // <AppBar position="static"  color='inherit' >
    // <Tabs
    // value={value}
    // onChange={handleChange}
    // // variant="scrollable"
    // scrollButtons
    //     allowScrollButtonsMobile
    //     indicatorColor="secondary"
    //     textColor="inherit"
    //     variant="fullWidth"
    //     aria-label="scrollable force tabs example"
    //     TabIndicatorProps={{
    //       style: {
    //         backgroundColor: "#fff",
    //         height:"3px"
    //       }
    //     }}
    //   >
    //     <Tab textColor='inherit' label="Basic Details" {...a11yProps(0)} />
    //     <Tab textColor='inherit' label="Policy Details" {...a11yProps(1)} />
    //     <Tab textColor='inherit' label="QUESTIONNAIRE" {...a11yProps(2)} />
    //     <Tab textColor='inherit' label="Documents" {...a11yProps(3)} />
    //     <Tab textColor='inherit' label="General Information" {...a11yProps(4)} />
    //   </Tabs>
    // </AppBar>
    // <SwipeableViews
    //   axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
    //   index={value}
    //   onChangeIndex={handleChangeIndex}
    // >
    //   <TabPanel value={value} index={0} dir={theme.direction}>
    //   <MemberBasicDetails memberData={memberData}/>
    //   </TabPanel>
    //   <TabPanel value={value} index={1} dir={theme.direction}>
    //   <MemberPolicyDetails  memberData={memberData}/>
    //   </TabPanel>
    //   <TabPanel value={value} index={2} dir={theme.direction}>
    //   No Info
    //   </TabPanel>
    //   <TabPanel value={value} index={3} dir={theme.direction}>
    //   <MemberDocumentsDetails />
    //   </TabPanel>
    //   <TabPanel value={value} index={4} dir={theme.direction}>
    //   <MemberGenralInfoDetails/>
    //   </TabPanel>
    // </SwipeableViews>
    // </Box>
  )
}

export default MemberDetail
