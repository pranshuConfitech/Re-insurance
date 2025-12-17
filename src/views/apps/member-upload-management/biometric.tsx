import React, { useState } from 'react'

import { Fingerprint, Compare } from '@mui/icons-material'
import { Button } from 'primereact/button'
import { Box, FormHelperText, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { errorCodes } from './errorCodes'
import { MemberService } from '@/services/remote-api/api/member-services'

const idQuality = 100
const memberservice = new MemberService()

const BiometricComponent = ({
  matchResult,
  handleClose,
  memberId
}: {
  matchResult: any
  handleClose: any
  memberId: any
}) => {
  // const [fingerprintData, setFingerprintData] = useState(null);
  const [fingerprintData1, setFingerprintData1] = useState({
    ErrorCode: null,
    BMPBase64: '',
    TemplateBase64: ''
  })

  const [fingerprintData2, setFingerprintData2] = useState({
    ErrorCode: null,
    Model: null,
    BMPBase64: '',
    TemplateBase64: ''
  })

  const [scanninng1, setScanning1] = useState(false)
  const [scanninng2, setScanning2] = useState(false)
  const [matchLoading, setMatchLoading] = useState(false)
  const [matchData, setMatchData]: any = useState({})
  const [error, setError] = useState(null)

  // useEffect(() => {

  //   memberservice.getBiometric('23').subscribe({
  //     next: (res) => {
  //       setFingerprintData1({
  //         ErrorCode: 0,
  //         BMPBase64: res.bmpBase64,
  //         TemplateBase64: res.templateBase64,
  //       });
  //     },
  //     error: (err) => {
  //       setFingerprintData1({
  //         ErrorCode: 500,
  //         BMPBase64: "",
  //         TemplateBase64: "",
  //       });
  //       console.log("err ", err);
  //       alert("Could not get biometric details!");
  //     },
  //   });
  // }, []);

  const saveBiometric = () => {
    if (!memberId) {
      alert('Membership no not found!')

      return
    }

    const payload = {
      id: memberId,
      bmpBase64: fingerprintData2.BMPBase64,
      templateBase64: fingerprintData2.TemplateBase64
    }

    memberservice.saveMemberBiometric(payload, memberId).subscribe(data => {
      alert('Biometric Saved')
    })
  }

  const callSGIFPGetData = (
    successCall: { (data: any): void; (data: any): void; (arg0: any): any },
    failCall: { (error: any): void; (error: any): void; (arg0: any): any }
  ) => {
    const uri = 'https://localhost:8443/SGIFPCapture'

    const params = new URLSearchParams({
      Timeout: '10000',
      Quality: '50',

      // licstr: encodeURIComponent('your_secugen_license_here'),
      templateFormat: 'ISO',
      imageWSQRate: '0.75'
    })

    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Network response was not ok')
        }
      })
      .then(data => successCall(data))
      .catch(error => failCall(error.message))
  }

  const matchSGIFPGetData = (
    successCall: { (data: any): void; (arg0: any): any },
    failCall: { (error: any): void; (arg0: any): any }
  ) => {
    const uri = 'https://localhost:8443/SGIMatchScore'

    const params = new URLSearchParams({
      Timeout: '10000',
      template1: encodeURIComponent(fingerprintData1?.TemplateBase64),
      template2: encodeURIComponent(fingerprintData2?.TemplateBase64),

      // licstr: encodeURIComponent('your_secugen_license_here'),
      templateFormat: 'ISO'
    })

    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Network response was not ok')
        }
      })
      .then(data => successCall(data))
      .catch(error => failCall(error.message))
  }

  const scan1Handler = () => {
    setScanning1(true)
    setMatchData({})

    callSGIFPGetData(
      (data: any) => {
        setScanning1(false)
        setFingerprintData1(data)
      },
      (error: any) => {
        setScanning1(false)
        setError(error)
      }
    )
  }

  const scan2Handler = () => {
    setScanning2(true)
    setMatchData({})
    callSGIFPGetData(
      (data: any) => {
        setScanning2(false)
        setFingerprintData2(data)
      },
      (error: any) => {
        setScanning2(false)
        setError(error)
      }
    )
  }

  const matchHandler = () => {
    if (!fingerprintData1?.TemplateBase64 || !fingerprintData2?.TemplateBase64) {
      alert('Please scan two fingers to verify!!')

      return
    }

    setMatchLoading(true)

    matchSGIFPGetData(
      (data: any) => {
        setMatchLoading(false)

        if (data.ErrorCode == 0) {
          if (data.MatchingScore >= idQuality) {
            matchResult('Matched')
            setTimeout(() => {
              handleClose()
            }, 3000)
            alert('MATCHED ! (' + data.MatchingScore + ')')
          } else {
            matchResult('Not Matched !')
            alert('NOT MATCHED ! (' + data.MatchingScore + ')')
          }
        } else {
          alert('Error Scanning Fingerprint ErrorCode = ' + data.ErrorCode)
        }

        setMatchData(data)
      },
      (error: any) => {
        setMatchLoading(false)
        setError(error)
      }
    )
  }

  return (
    <Box>
      {error && <Typography color='error'>Error: {error}</Typography>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          p: 2
        }}
      >
        <Box
          sx={{
            boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            borderRadius: '10px',
            p: 2,
            width: { xs: '100%', sm: '280px' },
            height: '380px',

            // display: "flex",
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'none'
          }}
        >
          {matchData?.MatchingScore > idQuality && (
            <Box style={{ position: 'absolute', top: -15, right: -15 }}>
              <CheckCircleIcon color='success' style={{ fontSize: '44px' }} />
            </Box>
          )}
          <Typography sx={{ fontSize: '14px' }}>Fingerprint : 1 (Server)</Typography>
          {scanninng1 ? (
            <Box
              component='img'
              src='/icons/Fingerprint Gif.gif'
              alt='Fingerprint 1 gif'
              sx={{ maxWidth: '50%', maxHeight: '50%', borderRadius: '50%' }}
            />
          ) : fingerprintData1?.ErrorCode === 0 ? (
            <Box
              component='img'
              src={`data:image/bmp;base64,${fingerprintData1?.BMPBase64}`}
              // src={`https://artatmacarthur.weebly.com/uploads/1/3/2/3/13232743/6266845_orig.jpg`}
              alt='Fingerprint 1'
              sx={{
                width: '180px',
                maxHeight: '240px',
                borderRadius: '10px',
                border: '1px solid grey'
              }}
            />
          ) : (
            <>
              <Typography sx={{ fontSize: '14px' }}>
                {`${fingerprintData1?.ErrorCode ? 'Error ' + fingerprintData1?.ErrorCode + '*:' : ''} No data`}
              </Typography>

              {fingerprintData1?.ErrorCode && (
                <FormHelperText>{'*' + errorCodes[fingerprintData1?.ErrorCode]}</FormHelperText>
              )}
            </>
          )}
          <Button onClick={scan1Handler} loading={scanninng1} size='small'>
            <span>
              Scan <Fingerprint style={{ marginLeft: 8 }} />
            </span>
          </Button>
        </Box>
        <Box
          sx={{
            boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            borderRadius: '10px',
            p: 2,
            width: { xs: '100%', sm: '280px' },
            height: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {matchData?.MatchingScore > idQuality && (
            <Box style={{ position: 'absolute', top: -15, right: -15 }}>
              <CheckCircleIcon color='success' style={{ fontSize: '44px' }} />
            </Box>
          )}
          <Typography
            sx={{
              fontSize: '14px',
              backgroundColor: '#31e48e',
              padding: '5px 10px',
              color: 'white',
              borderRadius: '5px'
            }}
          >{`Fingerprint Verification ${fingerprintData2?.Model ? fingerprintData2?.Model : ''}  `}</Typography>
          {scanninng2 ? (
            <Box
              component='img'
              src='/icons/Fingerprint Gif.gif'
              alt='Fingerprint 2'
              title='aiuniau'
              sx={{ maxWidth: '50%', maxHeight: '50%', borderRadius: '50%' }}
            />
          ) : fingerprintData2?.ErrorCode === 0 ? (
            <Box
              component='img'
              src={`data:image/bmp;base64,${fingerprintData2?.BMPBase64}`}
              alt='Fingerprint 2'
              sx={{
                width: '180px',
                height: '240px',
                borderRadius: '10px',
                border: '1px solid grey'
              }}
            />
          ) : (
            <>
              <Typography sx={{ fontSize: '14px' }}>
                {`${fingerprintData2?.ErrorCode ? 'Error ' + fingerprintData2?.ErrorCode + '*:' : ''} No data`}
              </Typography>

              {fingerprintData2?.ErrorCode && (
                <FormHelperText>{'*' + errorCodes[fingerprintData2?.ErrorCode]}</FormHelperText>
              )}
            </>
          )}
          <Button onClick={scan2Handler} loading={scanninng2} size='small'>
            <span>
              Scan <Fingerprint style={{ marginLeft: 8 }} />
            </span>
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={saveBiometric} loading={matchLoading} color='secondary' size='small'>
          <span>
            Save Biometric <Compare style={{ marginLeft: 8 }} />
          </span>
        </Button>
      </Box>
    </Box>
  )
}

export default BiometricComponent
