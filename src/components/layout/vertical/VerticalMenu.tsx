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
        {/* <Tooltip title="Dashboards" placement="right"> */}
        <MenuItem href="/dashboards" icon={<i className="ri-home-smile-line" />}>
          Dashboards
        </MenuItem>
        {/* </Tooltip> */}
        {/* <Tooltip title="Master" placement="right"> */}
        <SubMenu label="Master Data" icon={<i className="ri-database-2-line" />}>
          {/* <Tooltip title="Insurance Details" placement="right"> */}
          <MenuItem href="/masters/insurance-config/basic-details">Insurance Details</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Address Config" placement="right"> */}
          <MenuItem href="/masters/insurance-config/address-config">Address Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Region, Branch & Unit" placement="right"> */}
          <MenuItem href="/branch">Region, Branch & Unit</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Commission Config" placement="right">
              <MenuItem href="/masters/commissionrole-config">Commission Config</MenuItem>
            </Tooltip> */}
          {/* <Tooltip title="Underwriting Guidelines" placement="right"> */}
          <MenuItem href="/underwriting/guidelines">Underwriting Guidelines</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Underwriting Questionnaire" placement="right"> */}
          <MenuItem href="/questionnaire">Underwriting Questionnaire</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Member Upload Config" placement="right"> */}
          <MenuItem href="/member-upload">Member Upload Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Tax Config" placement="right"> */}
          <MenuItem href="/taxes">Tax Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Bank Config" placement="right"> */}
          <MenuItem href="/bank-management/banks">Bank Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Card Config" placement="right"> */}
          <MenuItem href="/bank-management/cards">Card Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Provider Config" placement="right"> */}
          <MenuItem href="/masters/provider-config">Provider Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Letter Config" placement="right"> */}
          <MenuItem href="/claims/letter">Letter Config</MenuItem>
          <MenuItem href="/masters/sector">Sectors</MenuItem>
          <MenuItem href="/masters/industries">Industies</MenuItem>
          <MenuItem href="/masters/doc-source">Document Source</MenuItem>
          {/* </Tooltip> */}
          <MenuItem href="/masters/claim-matrix">Claim Matrix</MenuItem>
          {/* <Tooltip title="Template Config" placement="right"> */}
          <MenuItem href="/masters/template-config">Template Config</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Product Factory" placement="right"> */}
        <SubMenu label="Products" icon={<i className="ri-settings-3-line" />}>
          {/* <Tooltip title="Rule Parameterization" placement="right"> */}
          <MenuItem href="/masters/parameters">Rule Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Benefit Hierarchy" placement="right"> */}
          <MenuItem href="/masters/benefit-hierarchy">Benefit Hierarchy</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Product Configurator" placement="right"> */}
          <MenuItem href="/products">Product Design</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Premiums" placement="right"> */}
          <MenuItem href="/premium">Premiums</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Sales" placement="right"> */}
        <SubMenu label="Sales" icon={<i className="ri-user-follow-line" />}>
          {/* <Tooltip title="Agents" placement="right"> */}
          <MenuItem href="/agents/management">Agents</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Targets" placement="right"> */}
          <MenuItem href="/agents/target">Targets</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Leads" placement="right"> */}
          <MenuItem href="/agents/lead">Leads</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Prospect Management" placement="right">
              <MenuItem href="/client/prospects">Prospect Management</MenuItem>
            </Tooltip> */}
          {/* <Tooltip title="Plans" placement="right"> */}
          <MenuItem href="/plans">Plans</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Quotations" placement="right"> */}
          <MenuItem href="/quotations">Quotations</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Clients" placement="right"> */}
          <MenuItem href="/client/clients">Clients</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Invoices" placement="right"> */}
          <MenuItem href="/invoices">Invoices</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Finance" placement="right"> */}
        <SubMenu label="Finance" icon={<i className="ri-bank-line" />}>
          {/* <Tooltip title="Receipts" placement="right"> */}
          <MenuItem href="/receipts">Receipts</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Fund" placement="right"> */}
          <SubMenu label="Fund">
            {/* <Tooltip title="Fund Statement" placement="right"> */}
            <MenuItem href="/funds/statement">Fund Statement</MenuItem>
            {/* </Tooltip> */}
            {/* <Tooltip title="Fund Config" placement="right"> */}
            <MenuItem href="/funds/config">Fund Config</MenuItem>
            {/* </Tooltip> */}
            {/* <Tooltip title="Fees Config" placement="right"> */}
            <MenuItem href="/fees">Fees Config</MenuItem>
            {/* </Tooltip> */}
          </SubMenu>
          {/* </Tooltip> */}
        </SubMenu>

        {/* </Tooltip> */}
        {/* <Tooltip title="Policies" placement="right"> */}
        <SubMenu label="Policies" icon={<i className="ri-file-text-line" />}>
          {/* <Tooltip title="Policies" placement="right"> */}
          <MenuItem href="/tpa">TPA</MenuItem>
          <MenuItem href="/policies">Policies</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Members" placement="right"> */}
          <MenuItem href="/member-upload/member">Members</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Member Balance" placement="right"> */}
          <MenuItem href="/member-balance">Member Balance</MenuItem>
          {/* </Tooltip> */}

          {/* <Tooltip title="Renewal Pending" placement="right"> */}
          <MenuItem href="/renewals/pending">Renewal Pending</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Renewal Config" placement="right"> */}
          <MenuItem href="/renewals/config">Renewal Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Endorsements" placement="right"> */}
          <MenuItem href="/endorsements">Endorsements</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Providers" placement="right"> */}
        <SubMenu label="Providers" icon={<i className="ri-links-line" />}>
          {/* <Tooltip title="Providers" placement="right"> */}
          <MenuItem href="/provider">Providers</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Negotiation" placement="right"> */}
          <MenuItem href="/provider/negotiation">Negotiation</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Visit Fee" placement="right"> */}
          <MenuItem href="/provider/visit-fee">Visit Fee</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}

        {/* <Tooltip title="HR" placement="right"> */}
        <SubMenu label="HR" icon={<i className="ri-file-list-3-line" />}>
          {/* <Tooltip title="Agent Hierarchy" placement="right"> */}
          <MenuItem href="/hr/agent-hierarchy">Agent Hierarchy</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Employee Hierarchy" placement="right"> */}
          <MenuItem href="/hr/employee-hierarchy">Employee Hierarchy</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Users" placement="right"> */}
        <SubMenu label="Users" icon={<i className="ri-shield-user-line" />}>
          {/* <Tooltip title="Access Rights" placement="right"> */}
          <MenuItem href="/user-management/access-rights">Access Rights</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Users" placement="right"> */}
          <MenuItem href="/user-management/users">Users</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Claims" placement="right"> */}
        <SubMenu label="Claims" icon={<i className="ri-file-paper-line" />}>
          {/* <Tooltip title="Claim Dashboard" placement="right"> */}
          <MenuItem href="/claims">Claim Dashboard</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Pre-Auth" placement="right"> */}
          <MenuItem href="/claims/claims-preauth">Pre-Auth</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Cases" placement="right"> */}
          <MenuItem href="/claims/case-management">Case Management</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Claims Intimation" placement="right"> */}
          {/* <MenuItem href="/claims/claims-intimation">Claims Intimation</MenuItem> */}
          <MenuItem href="/claims/claims-inwards">Inward Claims</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Claims" placement="right"> */}

          {/* <MenuItem href="/claims/claims">Claims</MenuItem> */}
          {/* <MenuItem href="/claims/credit">Credit Claims</MenuItem> */}
          <MenuItem href="/claims/claims">Claims Registration</MenuItem>
          <MenuItem href="/claims/claims-to-be-processed">Claims Proccessing</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Claims Audit" placement="right"> */}
          <MenuItem href="/claims/claims-audit">Claims Audit</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Ready for Payment" placement="right"> */}
          <MenuItem href="/claims/ready-for-payment">Ready for Payment</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Exgratia Claims" placement="right"> */}
          <SubMenu label="Exgratia Claims" icon={<i className="ri-database-2-line" />}>
            <MenuItem href="/claims/pending-exgatia-claims">Rejected Claims</MenuItem>
            <MenuItem href="/claims/requested-exgatia-claims">Waiting for Approval</MenuItem>
          </SubMenu>
          <SubMenu label="Indemnity Claims" icon={<i className="ri-database-2-line" />}>
            <MenuItem href="/claims/pending-indemnity-claims">Rejected Claims</MenuItem>
            <MenuItem href="/claims/requested-indemnity-claims">Waiting for Approval</MenuItem>
          </SubMenu>
          {/* </Tooltip> */}
          {/* <Tooltip title="Indemnity Claims" placement="right"> */}
          {/* <MenuItem href="/claims/claims-indemnity">Indemnity Claims</MenuItem> */}
          {/* </Tooltip> */}

        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Re-insurance" placement="right"> */}
        <SubMenu label="Re-insurance" icon={<i className="ri-shield-check-line" />}>
          {/* <Tooltip title="Register Re-insurer" placement="right"> */}
          <MenuItem href="/reinsurance/register-reinsurer">Register Re-insurer</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Register Re-insurer Broker" placement="right"> */}
          <MenuItem href="/reinsurance/register-broker">Register Re-insurer Broker</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Treaty Configuration" placement="right"> */}
          <MenuItem href="/reinsurance/treaty-config">Treaty Configuration</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Treaty Config" placement="right"> */}
          <MenuItem href="/reinsurance/treaty-configuration">Treaty Config</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Treaty Config 2" placement="right"> */}
          <MenuItem href="/reinsurance/treaty-config-2">Treaty Config 2</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Treaty Config 3" placement="right"> */}
          <MenuItem href="/reinsurance/treaty-config-3">Treaty Config 3</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Treaty Allocation" placement="right"> */}
          <MenuItem href="/reinsurance/treaty-allocation">Treaty Allocation</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Reinstate Treaty" placement="right"> */}
          <MenuItem href="/reinsurance/reinstate-treaty">Reinstate Treaty</MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Reports" placement="right"> */}
          <MenuItem href="/reinsurance/reports">Reports</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="Enquiry" placement="right"> */}
        <SubMenu label="Enquiry" icon={<i className="ri-shield-user-line" />}>
          {/* <Tooltip title="Calls" placement="right"> */}
          <MenuItem href="/masters/insurance-config/call-management">
            Calls
          </MenuItem>
          {/* </Tooltip> */}
          {/* <Tooltip title="Members Enquiry" placement="right"> */}
          <MenuItem href="/member-enquiry">Members Enquiry</MenuItem>
          {/* </Tooltip> */}
        </SubMenu>
        {/* </Tooltip> */}
        {/* <Tooltip title="SLA Config" placement="right"> */}
        <MenuItem href="/sla/configuration" icon={<i className="ri-slideshow-line" />}>
          SLA Config
        </MenuItem>
        {/* </Tooltip> */}


        {/* <Tooltip title="Reports" placement="right"> */}
        <MenuItem href="/reports" icon={<i className="ri-file-list-line" />}>
          Reports
        </MenuItem>
        {/* </Tooltip> */}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
