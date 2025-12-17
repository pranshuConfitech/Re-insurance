import React, { useEffect } from 'react'

import { TabView, TabPanel } from 'primereact/tabview'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import ProviderPendingListComponent from './provider.pending.list.component copy'
import ProviderApprovedListComponent from './provider.approved.list.component'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useRouter } from 'next/navigation'
import { ProvidersService } from '@/services/remote-api/api/provider-services'


export default function ProviderTabComponent({ initialTypeCode, onTypeChange, reloadTrigger, onTabChange, totalProviderCount, pendingTabActive, onTotalClick }: { initialTypeCode?: string; onTypeChange?: (code: string | undefined) => void; reloadTrigger?: number; onTabChange?: (activeIndex: number) => void; totalProviderCount?: number; pendingTabActive?: boolean; onTotalClick?: () => void }) {
  const router = useRouter()

  const [count, setCount] = React.useState({
    approved: 0,
    cancelled: 0,
    draft: 0,
    rejected: 0,
    requested: 0,
    total: 0
  })

  const [activeIndex, setActiveIndex] = React.useState(0)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const normalizedInitial: string | undefined = initialTypeCode ?? undefined
  const [selectedTypeCode, setSelectedTypeCode] = React.useState<string | undefined>(normalizedInitial)
  const preAuthService = new PreAuthService()
  const providersService = new ProvidersService()
  const pas$ = preAuthService.getDashboardCount()

  useEffect(() => {
    localStorage.removeItem("providerId")
    pas$.subscribe(result => {
      setCount(result?.data)
    })

    // Total provider count is now passed as prop from Dashboard
  }, [])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleActionClick = (action: string) => {
    console.log('Action clicked:', action)
    handleMenuClose()
  }

  useEffect(() => {
    const normalized: string | undefined = initialTypeCode ?? undefined
    setSelectedTypeCode(prev => (prev === normalized ? prev : normalized))
  }, [initialTypeCode])

  useEffect(() => {
    onTypeChange?.(selectedTypeCode)
  }, [selectedTypeCode, onTypeChange])

  // Notify parent of initial tab state on mount
  useEffect(() => {
    onTabChange?.(activeIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount

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
          {totalProviderCount !== undefined && activeIndex === 0 && (
            <Box
              onClick={!pendingTabActive ? onTotalClick : undefined}
              sx={{
                minWidth: 140,
                height: 32,
                padding: '4px 12px',
                borderRadius: '10px',
                border: '1px solid #d80f51',
                color: '#d80f51',
                backgroundColor: '#fff',
                // boxShadow: '0 4px 16px rgba(216, 15, 81, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: pendingTabActive ? 'not-allowed' : 'pointer',
                opacity: pendingTabActive ? 0.5 : 1,
                transition: 'all 0.25s ease',
                '&:hover': pendingTabActive
                  ? undefined
                  : {
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
                <span>Total Providers</span>
                <Box
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0,
                    textTransform: 'none'
                  }}
                >
                  {totalProviderCount}
                </Box>
              </Box>
            </Box>
          )}
          <Button
            variant='contained'
            size='small'
            onClick={() => router.push('/provider?mode=create')}
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
          onTabChange={e => {
            setActiveIndex(e.index)
            onTabChange?.(e.index)
          }}
        >
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-check-circle" style={{ color: '#28a745', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Approved Providers</span></span>}>
            <ProviderApprovedListComponent
              filterTypeCode={selectedTypeCode ?? undefined}
              reloadTrigger={reloadTrigger}
              onTypeChange={(code?: string | null) => setSelectedTypeCode(code ?? undefined)}
            />
          </TabPanel>
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-hourglass" style={{ color: '#fd7e14', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Pending Approval</span></span>}>
            <ProviderPendingListComponent filterTypeCode={selectedTypeCode ?? undefined} reloadTrigger={reloadTrigger} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
