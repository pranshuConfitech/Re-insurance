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
        <MenuItem href="/dashboards" icon={<i className="ri-home-smile-line" />}>
          Dashboards
        </MenuItem>
        <SubMenu label="Master Data" icon={<i className="ri-database-2-line" />}>
          <MenuItem href="/masters/insurance-config/basic-details">Insurance Details</MenuItem>
          <MenuItem href="/masters/insurance-config/address-config">Address Config</MenuItem>
          <MenuItem href="/branch">Region, Branch & Unit</MenuItem>
          <MenuItem href="/underwriting/guidelines">Underwriting Guidelines</MenuItem>
          <MenuItem href="/questionnaire">Underwriting Questionnaire</MenuItem>
          <MenuItem href="/member-upload">Member Upload Config</MenuItem>
          <MenuItem href="/taxes">Tax Config</MenuItem>
          <MenuItem href="/bank-management/banks">Bank Config</MenuItem>
          <MenuItem href="/bank-management/cards">Card Config</MenuItem>
          <MenuItem href="/masters/provider-config">Provider Config</MenuItem>
          <MenuItem href="/claims/letter">Letter Config</MenuItem>
          <MenuItem href="/masters/sector">Sectors</MenuItem>
          <MenuItem href="/masters/industries">Industies</MenuItem>
          <MenuItem href="/masters/doc-source">Document Source</MenuItem>
          <MenuItem href="/masters/claim-matrix">Claim Matrix</MenuItem>
          <MenuItem href="/masters/template-config">Template Config</MenuItem>
        </SubMenu>
        <SubMenu label="Re-insurance" icon={<i className="ri-shield-check-line" />}>
          <MenuItem href="/reinsurance/register-reinsurer">Register Re-insurer</MenuItem>
          <MenuItem href="/reinsurance/register-broker">Register Re-insurer Broker</MenuItem>
          <MenuItem href="/reinsurance/treaty-config">Treaty Configuration</MenuItem>
          <MenuItem href="/reinsurance/treaty-configuration">Treaty Config</MenuItem>
          <MenuItem href="/reinsurance/treaty-config-2">Treaty Config 2</MenuItem>
          <MenuItem href="/reinsurance/treaty-config-3">Treaty Config 3</MenuItem>
          <MenuItem href="/reinsurance/treaty-allocation">Treaty Allocation</MenuItem>
          <MenuItem href="/reinsurance/reinstate-treaty">Reinstate Treaty</MenuItem>
          <MenuItem href="/reinsurance/reports">Reports</MenuItem>
        </SubMenu>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
