import React, { useEffect, useState } from 'react'

import { TabView, TabPanel } from 'primereact/tabview'
import { Box } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EventIcon from '@mui/icons-material/Event'
import DateRangeIcon from '@mui/icons-material/DateRange'
import WarningIcon from '@mui/icons-material/Warning'
import AssessmentIcon from '@mui/icons-material/Assessment'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { PolicyService } from '@/services/remote-api/fettle-remote-api'
import GroupRenewalListComponent from './group.renewal.list.component'
import RetailRenewalListComponent from './retail.renewal.list.component'

const policyService = new PolicyService()

export default function RenwalTabComponent() {
  const [count, setCount] = React.useState({
    approved: 0,
    cancelled: 0,
    draft: 0,
    rejected: 0,
    requested: 0,
    total: 0
  })

  const [activeIndex, setActiveIndex] = React.useState(0)
  const [filterPeriod, setFilterPeriod] = useState<string>('')
  const [selectedDays, setSelectedDays] = useState<number | null>(null)
  const [renewalCounts, setRenewalCounts] = useState({
    nextWeek: 0,
    nextMonth: 0,
    next3Months: 0,
    oneMonthExpired: 0,
    totalYear: 0
  })

  const preAuthService = new PreAuthService()
  const pas$ = preAuthService.getDashboardCount()

  useEffect(() => {
    localStorage.removeItem("providerId")
    pas$.subscribe(result => {
      setCount(result?.data)
    })
    fetchRenewalCounts()
  }, [])

  const fetchRenewalCounts = () => {
    policyService.getPolicyCount(7).subscribe(data => {
      setRenewalCounts(prev => ({ ...prev, nextWeek: data || 0 }))
    })

    policyService.getPolicyCount(30).subscribe(data => {
      setRenewalCounts(prev => ({ ...prev, nextMonth: data || 0 }))
    })

    policyService.getPolicyCount(90).subscribe(data => {
      setRenewalCounts(prev => ({ ...prev, next3Months: data || 0 }))
    })

    policyService.getPolicyCount(365).subscribe(data => {
      setRenewalCounts(prev => ({ ...prev, totalYear: data || 0 }))
    })

    // For expired policies - using negative days or a different approach
    policyService.getPolicyCount(30).subscribe(data => {
      setRenewalCounts(prev => ({ ...prev, oneMonthExpired: data || 0 }))
    })
  }

  const handlePeriodClick = (period: string, days: number) => {
    console.log('Card clicked:', period, 'days:', days)
    if (filterPeriod === period) {
      setFilterPeriod('')
      setSelectedDays(null)
    } else {
      setFilterPeriod(period)
      setSelectedDays(days)
    }
  }

  return (
    <div className='card'>
      {/* Renewal Count Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(auto-fit, minmax(180px, 1fr))' },
        gap: 1.5,
        marginBottom: 3,
        padding: 2
      }}>
        {/* Next 1 Week Card */}
        <Box
          onClick={() => handlePeriodClick('nextWeek', 7)}
          sx={{
            borderRadius: '8px',
            border: '1px solid',
            borderColor: filterPeriod === 'nextWeek' ? '#60a5fa' : '#60a5fa',
            padding: '12px 16px',
            color: filterPeriod === 'nextWeek' ? '#fff' : '#60a5fa',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            backgroundColor: filterPeriod === 'nextWeek' ? '#60a5fa' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: filterPeriod === 'nextWeek' ? '#60a5fa' : '#eff6ff'
            }
          }}
        >
          <CalendarTodayIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Next 1 Week <Box component="span" sx={{ fontWeight: 700 }}>({renewalCounts.nextWeek})</Box>
            </Box>
          </Box>
        </Box>

        {/* Next 1 Month Card */}
        <Box
          onClick={() => handlePeriodClick('nextMonth', 30)}
          sx={{
            borderRadius: '8px',
            border: '1px solid',
            borderColor: filterPeriod === 'nextMonth' ? '#fb923c' : '#fb923c',
            padding: '12px 16px',
            color: filterPeriod === 'nextMonth' ? '#fff' : '#fb923c',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            backgroundColor: filterPeriod === 'nextMonth' ? '#fb923c' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: filterPeriod === 'nextMonth' ? '#fb923c' : '#fff7ed'
            }
          }}
        >
          <EventIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Next 1 Month <Box component="span" sx={{ fontWeight: 700 }}>({renewalCounts.nextMonth})</Box>
            </Box>
          </Box>
        </Box>

        {/* Next 3 Months Card */}
        <Box
          onClick={() => handlePeriodClick('next3Months', 90)}
          sx={{
            borderRadius: '8px',
            border: '1px solid',
            borderColor: filterPeriod === 'next3Months' ? '#a78bfa' : '#a78bfa',
            padding: '12px 16px',
            color: filterPeriod === 'next3Months' ? '#fff' : '#a78bfa',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            backgroundColor: filterPeriod === 'next3Months' ? '#a78bfa' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: filterPeriod === 'next3Months' ? '#a78bfa' : '#f5f3ff'
            }
          }}
        >
          <DateRangeIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Next 3 Months <Box component="span" sx={{ fontWeight: 700 }}>({renewalCounts.next3Months})</Box>
            </Box>
          </Box>
        </Box>

        {/* 1 Month Expired Card */}
        <Box
          onClick={() => handlePeriodClick('oneMonthExpired', -30)}
          sx={{
            borderRadius: '8px',
            border: '1px solid',
            borderColor: filterPeriod === 'oneMonthExpired' ? '#ef4444' : '#ef4444',
            padding: '12px 16px',
            color: filterPeriod === 'oneMonthExpired' ? '#fff' : '#ef4444',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            backgroundColor: filterPeriod === 'oneMonthExpired' ? '#ef4444' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: filterPeriod === 'oneMonthExpired' ? '#ef4444' : '#fef2f2'
            }
          }}
        >
          <WarningIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              1 Month Expired <Box component="span" sx={{ fontWeight: 700 }}>({renewalCounts.oneMonthExpired})</Box>
            </Box>
          </Box>
        </Box>

        {/* Total Count for 1 Year Card */}
        <Box
          onClick={() => handlePeriodClick('totalYear', 365)}
          sx={{
            borderRadius: '8px',
            border: '1px solid',
            borderColor: filterPeriod === 'totalYear' ? '#16a34a' : '#16a34a',
            padding: '12px 16px',
            color: filterPeriod === 'totalYear' ? '#fff' : '#16a34a',
            fontSize: { xs: '12px', sm: '13px' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: '50px',
            backgroundColor: filterPeriod === 'totalYear' ? '#16a34a' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: filterPeriod === 'totalYear' ? '#16a34a' : '#f0fdf4'
            }
          }}
        >
          <AssessmentIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <Box sx={{ overflow: 'hidden' }}>
            <Box component="span" sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Total 1 Year <Box component="span" sx={{ fontWeight: 700 }}>({renewalCounts.totalYear})</Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <div style={{ position: 'relative' }}>
        <TabView
          scrollable
          style={{ fontSize: '16px' }}
          activeIndex={activeIndex}
          onTabChange={e => setActiveIndex(e.index)}
        >
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-check-circle" style={{ color: '#28a745', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Retail Policies</span></span>}>
            <RetailRenewalListComponent selectedDays={selectedDays} />
          </TabPanel>
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-hourglass" style={{ color: '#fd7e14', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Group Policies</span></span>}>
            <GroupRenewalListComponent selectedDays={selectedDays} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
