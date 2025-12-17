'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const options: ApexOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      borderRadius: 7,
      columnWidth: '35%',
      colors: {
        ranges: [
          {
            from: 0,
            to: 100,
            color: '#1E90FF' // Blue color for bars
          }
        ],
        backgroundBarColors: ['#E0E0E0'],
        backgroundBarOpacity: 0.5
      }
    }
  },
  markers: {
    size: 5,
    strokeWidth: 2,
    fillOpacity: 1,
    strokeOpacity: 1,
    colors: '#FFFFFF',
    strokeColors: '#32CD32' // Green color for line markers
  },
  stroke: {
    width: [0, 2], // 0 for bars, 2 for line
    colors: ['#1E90FF', '#32CD32'] // Blue for bars, green for line
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    markers: {
      width: 12,
      height: 12,
      radius: 12
    }
  },
  dataLabels: { enabled: false },
  colors: ['#1E90FF', '#32CD32'], // Blue for bars, green for line
  grid: {
    strokeDashArray: 7,
    borderColor: 'lightgray',
    padding: {
      left: -2,
      right: 8
    }
  },
  states: {
    hover: {
      filter: { type: 'none' }
    },
    active: {
      filter: { type: 'none' }
    }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tickPlacement: 'on',
    labels: { show: true },
    axisTicks: { show: false },
    axisBorder: { show: false }
  },
  yaxis: [
    {
      title: {
        text: 'Net Income ($)',
        style: {
          color: '#1E90FF'
        }
      },
      min: 0,
      max: 30,
      tickAmount: 4, // Adjusted to show 0, 10, 20, 30
      labels: {
        formatter: value => `$${value}M`,
        style: {
          fontSize: '0.8125rem',
          colors: '#1E90FF'
        }
      }
    },
    {
      opposite: true,
      title: {
        text: 'Net Ratio (%)',
        style: {
          color: '#32CD32'
        }
      },
      min: 0,
      max: 12,
      tickAmount: 4, // Adjusted to show 0, 4, 8, 12
      labels: {
        formatter: value => `${value}%`,
        style: {
          fontSize: '0.8125rem',
          colors: '#32CD32'
        }
      }
    }
  ],
  responsive: [
    {
      breakpoint: 750,
      options: {
        plotOptions: {
          bar: { columnWidth: '38%', borderRadius: 6 }
        }
      }
    },
    {
      breakpoint: 450,
      options: {
        plotOptions: {
          bar: { columnWidth: '35%' }
        }
      }
    }
  ]
}

const series = [
  {
    name: 'Net Income',
    type: 'column',
    data: [10, 20, 25, 30, 28, 22, 18, 24, 26, 20, 15, 22]
  },
  {
    name: 'Net Ratio',
    type: 'line',
    data: [2, 4, 6, 8, 10, 9, 7, 5, 8, 9, 6, 7]
  }
]

const WeeklyOverview = () => {
  // Hooks
  const theme = useTheme()

  return (
    <Card>
      <CardHeader title="Net Income Ratio" />
      <CardContent className="flex flex-col gap-6">
        <AppReactApexCharts
          type="line"
          height={280} // Increased height
          width="100%" // Full width
          series={series}
          options={options}
        />
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
