import * as React from 'react'
import { useEffect } from 'react'

import { useRouter, useSearchParams, useParams } from 'next/navigation'

import { Button } from 'primereact/button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import MuiAlert from '@mui/lab/Alert'

import 'date-fns'

import { ClientService } from '@/services/remote-api/api/client-services'
import {
  AddressService,
  GroupTypeService,
  IdentificationTypeService,
  PrefixTypeService,
  SuffixTypeService
} from '@/services/remote-api/api/master-services'
import AccountDetailsStepCompoent from './account-details-step.component'
import AddressDetailsStepComponent from './address-details-step.component'
import BasicDetailsStepComponent from './basic-details-step.component'
import ProspectImportComponent from './prospect.import.component'

const clientService = new ClientService()
const grouptypeService = new GroupTypeService()
const addressservice = new AddressService()
const identificationservice = new IdentificationTypeService()

const prefixservice = new PrefixTypeService()
const suffixservice = new SuffixTypeService()

const gt$ = grouptypeService.getGroupTypes()
const addr$ = addressservice.getAddressConfig()
const iden$ = identificationservice.getIdentificationTypes()

const prefx$ = prefixservice.getPrefixTypes()
const sufx$ = suffixservice.getSuffixTypes()
const pc$ = clientService.getParentClients()

const useStyles = makeStyles((theme: any) => ({
  root: {
    // width: '100%',
    flexDirection: 'column'

    /* marginLeft: '5%', */
  },
  backButton: {
    marginRight: theme?.spacing ? theme?.spacing(1) : '8px'
  },
  button: {
    marginRight: theme?.spacing ? theme?.spacing(1) : '8px'
  },
  instructions: {
    marginTop: theme?.spacing ? theme?.spacing(1) : '8px',
    marginBottom: theme?.spacing ? theme?.spacing(1) : '8px'
  },
  stepText: {
    '& span': {
      fontSize: '16px'
    }
  }
}))

function getSteps() {
  return ['Basic Details', 'Address details', 'Account Details']
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function ClientDetails(props: any) {
  const imgF =
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDxUPDw8VFRUVFRUVFRUVFRUVFRUVFRUXFxUVFRUYHSggGBolHRUXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDQ0NFQ8PFS0dFRkrKy0tLS0tLS0tKy0rKystLS0rLTgrNystLS0tLS0tLS0tLTctKzcrLS0tKy0tKy0tK//AABEIAOEA4QMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAAAQIDBAUH/8QAMBABAQACAAIIBQMEAwAAAAAAAAECEQSRAxQhMUFRYXEygbHB8BKh0SJCUuEFM4L/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9XUWNIRYNAi6XS6BNLpV0CaXSmgTS6XQCGmtGgZ0aaAZ0mmjQM6TTaaBjRpqw0DnpNN2JoGEbsSwGLEaQEFAWLIRqAaWQkagGlNKAujSgiqaBNKoCGlNAmhQERoBnSNAM6RpAZ0la0lgMJpuxKDGmW6zQZUUFjUiRqARqEUBRqAiigiighllJN26nnXPiOnmE87e6fe+j52edyu8rv6T2ngD25cbjO6W/tOdc7x2X+M+dv8PKA9M43L/Gc66Ycbj442fu8QD6uGcy7ZZWnyccrLuXVe/huI/V2Xsv19gdtCgMo0gIy2lBhK1UoMVGqlBnQoCxqJGoCrCLAFFAUAGekzmMuV7p+aaeT/kM+7H58uyfnoDyZZW2299/NIAgAAAAS67YAPp9B0n6sd8/d0eLgM/6rj5z949tFEUBkVAZqVqpQYqVqpQZRpAajSRYCxqJFBQUAFAfN4276S+kk+/3fSfM4r/sy+X0gjkAAAAAAADpw11nj7/XsfUfK6H4sfefV9UVBUARUoIlVKDNZrdZoMigLGokWAsaRQFACKAg+dxs10l9ZL9vs+i8X/IY/Dfeff8AkV5ABAAAAAAHXhZvPH3+k2+m8HAY/wBVvlPr2fy94oigIADIqAzUrVZojIoKsajMagLFRYCgQFAAceLw/VhfTtny/K7APjjfTYfpys5e3gwIAAAAAuONtkniD38DhrDfnd/Kdk+70JJqandFFABEoAqVFqUErNaqUGQ0AsaZjUBYsSLAUgQFAAAB5eP6Pc/VPDsvtfz93hfYs3NXxfJ6XD9OVx8vp4AyAIAAPXwHR9tzvh2T38b+ebyybup49j6vR4TGTGeH5aK0AAACUKAiLUBKzWqzRAQFWLGY1AaisqDQigoigAAPn8f8f/mfWvX0/T44d/f4Tx/1PV83PK5W5Xvv5oEAEAAdeF+PH87ddj6b48vk+jw/EzLsvZfLz9hXcAAARABUSqlBKzVSggAEajEagNRYigsVHk6fjPDDn4fLzB7HPPiMJ35T6/R83PK5fFbffu5dyCPbnx0/txt9+z/bh0nFZ3x17fy4gEgAAAAAAAOvR8Rnj3Xfpe16MOO/yx5drxAPp48Thf7p8+z6uj5C42zutnt2CvrI8fQ8Ze7Pn/M8XrgFSqgJWatSggmwCNRmLAbWMxYDlxnSax1O/Ls+Xi8L0cde3Gelv7x5wABAAAAAAAAAAAAAAB7OCz7Lj5ds9njd+Dv9fyor21KVKIVmrWRTYiAsWMRqA3FjMqwHl434p7fdweriOiyyss13a79OfVc/TmDiO3Vc/TmdVz9OYOI79Vz9OZ1TP05g4Dv1TPynM6pn5TmDgO/VM/KczqmflOYOA79Uz8pzOqZ+U5g4Dv1TPynM6pn5TmDgO/VM/KczqmflOYOA7dVz9OZ1XP05g4uvC/HPn9F6tn6c2+g6HLHLd14+IPUzRAS1KVKAJsBI1GGoDUalY2soNyqztdg0srKyg0IbBoQBRAFNpsBRAAQAQtQFZEoFSm2aBUpazQUQBIrKg01KwoN7VmVZQalXbMq7Bra7Y2uwa2u2dmxGtjK7FU2zs2DSJs2Iu02mwU2mzaWgWpaWoAlNs7ASlSgBtAFAFaAFiwAWKACgCgACgIABEAFRAEKgAgAlSgDIgDIAj//Z'

  const query1 = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const id: any = params.id

  const [groupTypes, setGroupTypes] = React.useState([])
  const [parentClients, setParentClients] = React.useState([])
  const [identificationTypes, setIdentificationTypes] = React.useState([])

  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])
  const [clientid, setClientId] = React.useState('')
  const [addressConfig, setAddressConfig] = React.useState([])
  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [errorObj, setErrorObj] = React.useState({ status: false, msg: '' })
  const [successMsg, setSuccessMsg] = React.useState(false)

  // const clientID = this.props.match.params.id;
  // const { id } = useParams();
  // setClientId(id)
  const [clientDetail, setClientDetail] = React.useState({
    showImportProspect: true,

    //basic
    prefixCd: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffixCd: '',
    displayName: '',
    groupTypeCd: '',
    clientTypeName: '',
    clientTypeCd: '',
    orgTypeCd: 'OT191904',
    parentclientId: '',
    code: '',
    partnerNumber: '',
    combinationPartnerId: '',
    gstNo: '',
    panNumber: '',
    incorporationNumber: '',
    dataOfIncorporation: 0,
    countryOfIncorporation: '',
    policeStation: '',
    logoFormat: 'image/jpeg',
    websiteUrl: '',
    prospectId: '',
    logo: imgF,
    contact: '',
    email: '',
    pOrgData: {
      name: '',
      id: ''
    },
    contactNos: [
      {
        contactNo: '',
        contactType: ''
      }
    ],
    emails: [
      {
        emailId: '',
        contactType: ''
      }
    ],
    identifications: [
      {
        identificationType: '',
        identificationNo: '',
        docFormat: '',
        document: ''
      }
    ],

    //2nd step
    addresses: [
      {
        addressDetails: {
          AddressLine1: 'Kolkata'
        },
        addressType: 'CURRENT_ADDRESS'
      }
    ],
    contactPerson: {
      name: '',
      emailId: '',
      alternateEmailId: '',
      mobileNo: '',
      alternateMobileNo: ''
    },
    directorDetails: [
      {
        //   id: 0,
        name: '',
        identificationType: '',
        identificationNo: ''
      }
    ],

    //3rd step
    accountDetails: [
      {
        //   id: 0,
        bankAccountHolderName: '',
        bankAccountNo: '',
        branchCode: '',
        branchName: '',
        accountNo: ''
      }
    ],
    amlRiskCategory: ''
  })

  const [directorList, setDirectorList] = React.useState([{ name: '', identificationType: '', identificationNo: '' }])

  const [bankList, setBankList] = React.useState([
    {
      bankAccountHolderName: '',
      bankAccountNo: '',
      branchCode: '',
      branchName: '',
      accountNo: ''
    }
  ])

  const [contactList, setContactList] = React.useState([{ altEmail: '', altContact: '' }])

  const [identificationList, setIdentificationList] = React.useState([
    {
      identificationType: '',
      identificationNo: '',
      docFormat: 'image/jpeg',
      document: imgF
    }
  ])

  const [selectedDate, setSelectedDate] = React.useState(new Date())

  const [selectedImgLink, setSelectedImgLink] = React.useState(
    'data:image/jpeg;base64,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'
  )

  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const steps = getSteps()

  const isStepOptional = (step: number) => {
    return step === 1
  }

  useEffect(() => {
    const subscription = addr$.subscribe(result => {
      if (result && result.length !== 0) {
        result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
          prop.addressConfigurationFieldMappings.forEach((field, j) => {
            // let fname = "field"+i+j;
            // field['fieldName'] = fname;
            field['value'] = ''

            if (field.sourceId !== null && field.sourceId !== '') {
              field['sourceList'] = []
            }

            if (field.type === 'dropdown' && field.sourceId === null) {
              if (field.addressConfigurationFieldCustomValueMappings.length !== 0) {
                field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
              }

              // if(field.addressConfigurationFieldCustomValueMappings.length === 0 || field.addressConfigurationFieldCustomValueMappings === null){
              //   field['sourceList'] = [];
              // }
            }
          })
        })
        setAddressConfig(result)
      }
    })

    return () => subscription.unsubscribe()
  }, [addr$, setAddressConfig])

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.clientBasicDetails.displayName,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(gt$, setGroupTypes)

  useObservable(iden$, setIdentificationTypes)

  useObservable2(pc$, setParentClients)
  useObservable(prefx$, setPrefixes)
  useObservable(sufx$, setSuffixes)

  const handleClose = (event?: any) => {
    router.push(`/client/clients?mode=viewList`)

    // window.location.reload();
  }

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const handleProspectImport = (val: any) => {
    const clist = [
      {
        altEmail: val.alternateEmailId,
        altContact: val.alternateMobileNo
      }
    ]

    setContactList(clist)
    setClientDetail({
      ...clientDetail,
      firstName: val.firstName,
      middleName: val.middletName,
      lastName: val.lastName,
      prefixCd: val.prefix,
      suffixCd: val.suffix,
      clientTypeCd: val.clientType,
      clientTypeName: val.clientType.charAt(0) + val.clientType.slice(1).toLowerCase(),
      groupTypeCd: val.groupType,
      displayName: val.displayName,
      contact: val.mobileNo,
      email: val.emailId,
      showImportProspect: false,
      prospectId: val.id
    })
  }

  const closeProspectimport = () => {
    setClientDetail({
      ...clientDetail,
      showImportProspect: false
    })
  }

  const isStepSkipped = (step: any) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    if (activeStep === 0) {
      //API call 1st step
    }

    if (activeStep === 1) {
      //API call 2nd step
    }

    if (activeStep === 2) {
      //API call 3rd step
    }

    let newSkipped = skipped

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values())

      newSkipped.add(activeStep)

      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const handleErrorMsgClose = (event: any, reason: any) => {
    setErrorObj({ status: false, msg: '' })
  }

  const handleFileUploadMsgClose = (event: any, reason: any) => {
    setUploadSuccess(false)
  }

  const handleCloseSuccess = (event: any, reason: any) => {
    setSuccessMsg(false)
  }

  const handleSubmitStepOne = (payloadOne: any) => {
    if (query1.get('mode') === 'create') {
      clientService.saveClient(payloadOne).subscribe((res: any) => {
        if (res.response && res.response.status) {
          setErrorObj({ status: true, msg: res.response.data.message })

          return
        }

        setClientId(res.id)
        setSuccessMsg(true)
        handleNext()
      })
    }

    if (query1.get('mode') === 'edit') {
      clientService.editCient(payloadOne, id, '1').subscribe(res => {
        setSuccessMsg(true)
        handleNext()
      })
    }
  }

  const handleSubmitStepTwo = (payloadTwo: any) => {
    if (id) {
      setClientId(id)
      clientService.editCient(payloadTwo, id, '2').subscribe(res => {
        setSuccessMsg(true)
        handleNext()
      })
    }

    if (!id) {
      clientService.editCient(payloadTwo, clientid, '2').subscribe(res => {
        setSuccessMsg(true)
        handleNext()
      })
    }
  }

  const handleSubmitStepThree = (payLoadThree: any) => {
    if (id) {
      setClientId(id)
      clientService.editCient(payLoadThree, id, '3').subscribe(res => {
        setSuccessMsg(true)
        handleClose({})

        // handleNext();
      })
    }

    if (!id) {
      clientService.editCient(payLoadThree, clientid, '3').subscribe(res => {
        setSuccessMsg(true)

        if (query1.get('for') === 'proposer') {
          const referenceID = query1.get('refid')

          router.push(`/policies?mode=create&clientid=` + clientid + `&refid=` + referenceID)
        }

        if (query1.get('for') !== 'proposer') {
          handleClose('e')
        }
      })
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicDetailsStepComponent
            clientDetail={clientDetail}
            prefixes={prefixes}
            suffixes={suffixes}
            setUploadSuccess={setUploadSuccess}
            identificationTypes={identificationTypes}
            contactList={contactList}
            identificationList={identificationList}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedImgLink={selectedImgLink}
            imgF={imgF}
            pageMode={query1.get('mode')}
            groupTypes={groupTypes}
            parentClients={parentClients}
            handleClose={handleClose}
            setClientDetail={setClientDetail}
            handleSubmitStepOne={handleSubmitStepOne}
          />
        )
      case 1:
        return (
          <AddressDetailsStepComponent
            clientDetail={clientDetail}
            prefixes={prefixes}
            suffixes={suffixes}
            identificationTypes={identificationTypes}
            directorList={directorList}
            setUploadSuccess={setUploadSuccess}
            imgF={imgF}
            handleClose={handleClose}
            setClientDetail={setClientDetail}
            handleSubmitStepTwo={handleSubmitStepTwo}
            addressConfig={addressConfig}
          />
        )
      case 2:
        return (
          <AccountDetailsStepCompoent
            bankList={bankList}
            clientDetail={clientDetail}
            setUploadSuccess={setUploadSuccess}
            handleClose={handleClose}
            handleSubmitStepThree={handleSubmitStepThree}
            setClientDetail={setClientDetail}
          />
        )
      default:
        return 'Unknown step'
    }
  }

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any) => {
    if (id) {
      clientService.getClientDetails(id).subscribe(val => {
        let pcontact = ''
        let pemail = ''
        const altList: any = []
        let pOrg = {
          name: '',
          id: ''
        }

        val.clientBasicDetails.contactNos.forEach((ele, i) => {
          if (ele.contactType === 'PRIMARY') {
            pcontact = ele.contactNo
          }

          if (ele.contactType === 'ALTERNATE') {
            altList.push({
              altEmail: val.clientBasicDetails.emails[i].emailId,
              altContact: ele.contactNo
            })
          }
        })

        val.clientBasicDetails.emails.forEach(ele => {
          if (ele.contactType === 'PRIMARY') {
            pemail = ele.emailId
          }
        })

        if (altList.length !== 0) {
          setContactList(altList)
        }

        parentClients.forEach((ele: any) => {
          if (ele.id === val.clientBasicDetails.parentclientId) {
            pOrg = ele
          }
        })

        setClientDetail({
          ...clientDetail,
          prefixCd: val.clientBasicDetails.prefixCd,
          firstName: val.clientBasicDetails.firstName,
          middleName: val.clientBasicDetails.middleName,
          lastName: val.clientBasicDetails.lastName,
          suffixCd: val.clientBasicDetails.suffixCd,
          displayName: val.clientBasicDetails.displayName,
          groupTypeCd: val.clientBasicDetails.groupTypeCd,
          clientTypeName: val.clientBasicDetails.clientTypeName,
          clientTypeCd: val.clientBasicDetails.clientTypeCd,
          orgTypeCd: val.clientBasicDetails.orgTypeCd,
          parentclientId: val.clientBasicDetails.parentclientId,
          pOrgData: pOrg,
          code: val.clientBasicDetails.code,
          partnerNumber: val.clientBasicDetails.partnerNumber,
          combinationPartnerId: val.clientBasicDetails.combinationPartnerId,
          gstNo: val.clientBasicDetails.gstNo,
          panNumber: val.clientBasicDetails.panNumber,
          incorporationNumber: val.clientBasicDetails.incorporationNumber,
          dataOfIncorporation: val.clientBasicDetails.dataOfIncorporation,
          countryOfIncorporation: val.clientBasicDetails.countryOfIncorporation,
          policeStation: val.clientBasicDetails.policeStation,
          logoFormat: val.clientBasicDetails.logoFormat,
          websiteUrl: val.clientBasicDetails.websiteUrl,
          prospectId: val.clientBasicDetails.prospectId,
          contactPerson: val.clientAddress.contactPerson,
          logo: val.clientBasicDetails.logo,
          amlRiskCategory: val.clientAccount.amlRiskCategory,
          contact: pcontact,
          email: pemail,
          contactNos: [
            {
              contactNo: '',
              contactType: ''
            }
          ],
          emails: [
            {
              emailId: '',
              contactType: ''
            }
          ]
        })

        setSelectedDate(new Date(val.clientBasicDetails.dataOfIncorporation))
        const lnk = 'data:image/jpeg;base64,' + val.clientBasicDetails.logo

        setSelectedImgLink(lnk)
        const idlist: any = []
        const dirList: any = []
        const bnkList: any = []

        val.clientBasicDetails.identifications.forEach(ele => {
          idlist.push({
            identificationType: ele.identificationType,
            identificationNo: ele.identificationNo,
            docFormat: ele.docFormat,
            document: ele.document
          })
        })

        val.clientAccount.accountDetails.forEach(ele => {
          bnkList.push({
            bankAccountHolderName: ele.bankAccountHolderName,
            bankAccountNo: ele.bankAccountNo,
            branchCode: ele.branchCode,
            branchName: ele.branchName,
            accountNo: ele.accountNo
          })
        })

        val.clientAddress.directorDetails.forEach(ele => {
          dirList.push({
            name: ele.name,
            identificationType: ele.identificationType,
            identificationNo: ele.identificationNo
          })
        })

        if (idlist.length !== 0) {
          setIdentificationList(idlist)
        }

        if (dirList.length !== 0) {
          setDirectorList(dirList)
        }

        if (bnkList.length !== 0) {
          setBankList(bnkList)
        }
      })
    }
  }

  return (
    <div>
      {query1.get('mode') === 'edit' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: '#000',
            fontSize: '18px'
          }}
        >
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '5px'
            }}
          >
            Client Management- Edit Client
          </span>
        </Grid>
      ) : null}

      {query1.get('mode') === 'create' && clientDetail.showImportProspect ? (
        <ProspectImportComponent
          handleProspectImport={handleProspectImport}
          closeProspectimport={closeProspectimport}
        />
      ) : (
        <div className={classes.root}>
          <Paper elevation={0}>
            <Snackbar open={errorObj.status} autoHideDuration={3000} onClose={handleErrorMsgClose}>
              <Alert onClose={handleErrorMsgClose} severity='error'>
                {errorObj.msg}
              </Alert>
            </Snackbar>
            <Snackbar open={uploadSuccess} autoHideDuration={3000} onClose={handleFileUploadMsgClose}>
              <Alert onClose={handleFileUploadMsgClose} severity='success'>
                File uploaded successfully
              </Alert>
            </Snackbar>
            <Snackbar open={successMsg} autoHideDuration={3000} onClose={handleCloseSuccess}>
              <Alert onClose={handleCloseSuccess} severity='success'>
                Saved successfully
              </Alert>
            </Snackbar>
            <Stepper activeStep={activeStep} style={{ backgroundColor: 'transparent' }}>
              {steps.map((label, index) => {
                const stepProps: any = {}
                const labelProps: any = {}

                if (isStepOptional(index)) {
                  labelProps.optional = <Typography variant='caption'>Optional</Typography>
                }

                if (isStepSkipped(index)) {
                  stepProps.completed = false
                }

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps} className={classes.stepText}>
                      {label}
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </Paper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>All steps completed</Typography>
                <Button onClick={handleClose} color='primary' className={classes.button}>
                  Go to Table
                </Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={`p-button-text ${classes.button}`}
                    style={{ marginRight: '5px' }}
                  >
                    Back
                  </Button>
                  {isStepOptional(activeStep) && (
                    <Button color='primary' onClick={handleSkip} className={classes.button}>
                      Skip
                    </Button>
                  )}

                  <Button color='primary' onClick={handleNext} className={classes.button}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
