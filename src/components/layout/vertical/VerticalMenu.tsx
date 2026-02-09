// Next Imports

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu label="Dashboards" icon={<i className="ri-home-smile-line" />}>
          <MenuItem href="/dashboards">CRM Dashboard</MenuItem>
          <MenuItem href="/reinsurance/dashboard">Reinsurance Portfolio</MenuItem>
          <MenuItem href="/reinsurance/treaty-performance">Treaty Performance</MenuItem>
          <MenuItem href="/reinsurance/underwriting-performance">Underwriting Performance</MenuItem>
          <MenuItem href="/reinsurance/facultative-placement">Facultative Placement</MenuItem>
          <MenuItem href="/reinsurance/claims-recoveries">Claims & Recoveries</MenuItem>
          <MenuItem href="/reinsurance/finance-accounting">Finance & Accounting</MenuItem>
          <MenuItem href="/reinsurance/actuarial-risk">Actuarial & Risk Exposure</MenuItem>
          <MenuItem href="/reinsurance/compliance-controls">Compliance & Controls</MenuItem>
          <MenuItem href="/reinsurance/marketing">Insurance Marketing</MenuItem>
        </SubMenu>
        <SubMenu label="Master Data" icon={<i className="ri-database-2-line" />}>
          <MenuItem href="/masters/insurance-config/basic-details">Insurance Details</MenuItem>
          <MenuItem href="/masters/insurance-config/address-config">Address Config</MenuItem>
        </SubMenu>
        <SubMenu label="Users" icon={<i className="ri-shield-user-line" />}>
          <MenuItem href="/user-management/access-rights">Access Rights</MenuItem>
          <MenuItem href="/user-management/users">Users</MenuItem>
        </SubMenu>
        <SubMenu label="Re-insurance" icon={<i className="ri-shield-check-line" />}>
          <MenuItem href="/reinsurance/register-reinsurer">Register Re-insurer</MenuItem>
          <MenuItem href="/reinsurance/register-broker">Register Re-insurer Broker</MenuItem>
          <MenuItem href="/reinsurance/treaty-config">Treaty Configuration</MenuItem>
          <MenuItem href="/reinsurance/treaty-configuration">Treaty Config</MenuItem>
          {/* <MenuItem href="/reinsurance/treaty-config-2">Treaty Config 2</MenuItem> */}
          {/* <MenuItem href="/reinsurance/treaty-config-3">Treaty Config 3</MenuItem> */}
          <MenuItem href="/reinsurance/treaty-config-4">Treaty Definition</MenuItem>
          <MenuItem href="/reinsurance/treaty-allocation">Treaty Allocation</MenuItem>
          <MenuItem href="/reinsurance/treaty-allocation-3">Premium Allocation</MenuItem>
          <MenuItem href="/reinsurance/claim-allocation">Claim Recovery</MenuItem>
          <MenuItem href="/reinsurance/reinstate-treaty">Reinstate Treaty</MenuItem>
          <MenuItem href="/reinsurance/reports">Reports</MenuItem>
        </SubMenu>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
