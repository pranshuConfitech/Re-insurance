import React, { useEffect } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useRouter } from 'next/navigation'
import PreAuthIPDListComponent from './preauthIPD.list.component'
import PreAuthOPDListComponent from './preauthOPD.list.component'
import PreAuthSummaryCards from './PreAuthSummaryCards'

interface PreAuthTabComponentProps {
  reloadTrigger?: number
  totalPreAuthCount?: number
  onTotalClick?: () => void
}

export default function PreAuthTabComponent({
  reloadTrigger,
  totalPreAuthCount,
  onTotalClick
}: PreAuthTabComponentProps) {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = React.useState(0)

  useEffect(() => {
    localStorage.removeItem('preauthid')
  }, [])

  return (
    <div className='card'>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 7,
          right: 8,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Total Pre-Auth badge - commented out as per requirement
          {totalPreAuthCount !== undefined && (
            <Box
              onClick={onTotalClick}
              sx={{
                minWidth: 140,
                height: 32,
                padding: '4px 12px',
                borderRadius: '10px',
                border: '1px solid #d80f51',
                color: '#d80f51',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: '#d80f51',
                  color: '#fff',
                  boxShadow: '0 8px 20px rgba(216, 15, 81, 0.25)'
                }
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 12, flexShrink: 0, color: 'inherit' }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  fontSize: 8
                }}
              >
                <span>Total Pre-Auth</span>
                <Box
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0,
                    textTransform: 'none'
                  }}
                >
                  {totalPreAuthCount}
                </Box>
              </Box>
            </Box>
          )}
          */}
          <Button
            variant='contained'
            size='small'
            onClick={() => router.push('/claims/claims-preauth?mode=create&auth=IPD')}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: '4px 4px 0px 0px',
              backgroundColor: '#28a745',
              '&:hover': { backgroundColor: '#218838' }
            }}
          >
            Create
          </Button>
        </div>
        <TabView
          scrollable
          style={{ fontSize: '16px' }}
          activeIndex={activeIndex}
          onTabChange={e => setActiveIndex(e.index)}
        >
          <TabPanel header={
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <i className="pi pi-user" style={{ color: '#28a745', marginRight: 8 }}></i>
              <span style={{ fontSize: "1rem" }}>IPD Pre-Auth</span>
            </span>
          }>
            <PreAuthSummaryCards />
            <PreAuthIPDListComponent />
          </TabPanel>
          <TabPanel header={
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <i className="pi pi-user-minus" style={{ color: '#fd7e14', marginRight: 8 }}></i>
              <span style={{ fontSize: "1rem" }}>OPD Pre-Auth</span>
            </span>
          }>
            <PreAuthSummaryCards />
            <PreAuthOPDListComponent />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

