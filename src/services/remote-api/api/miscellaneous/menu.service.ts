import type { Observable} from 'rxjs';
import { of } from 'rxjs';

import type { Menu } from '../../models/menu';

export class MenuService {
  getMenuList(): Observable<Menu[]> {
    return of([
      {
        icon: 'dashboard',
        key: 'Dashboard',
        visibility: true,
        displayName: 'Dashboard',
        routePath: '/dashboard',
      },
      {
        icon: 'note',
        displayName: 'Master',
        children: [
       
          {
            icon: 'group',
            visibility: true,
            key: 'Provider Config',
            displayName: 'Provider Config',
            routePath: '/masters/provider-config',
          },
          {
            icon: 'note',
            visibility: true,
            key: 'Insurance Config',
            displayName: 'Insurance Config',

            // routePath: '/masters/provider-config',
            children: [
              {
                icon: 'group',
                visibility: true,
                key: 'Basic Details',
                displayName: 'Basic Details',
                // routePath: '/masters/insurance-config/basic-details',
              },
              
              {
                icon: 'group',
                visibility: true,
                key: 'Benefit Config',
                displayName: 'Benefit Config',
                routePath: '/masters/insurance-config/benefit-config',
              },
              {
                icon: 'group',
                visibility: true,
                key: 'Address Config',
                displayName: 'Address Config',
                routePath: '/masters/insurance-config/address-config',
              },
            ]
          },
          {
            icon: 'group',
            visibility: true,
            key: 'Fund Config',
            displayName: 'Fund Config',
            routePath: '/masters/fund-config',
          },
        
          {
            icon: 'group',
            visibility: true,
            key: 'CommissionRole Config',
            displayName: 'CommissionRole Config',
            routePath: '/masters/commissionrole-config',
          },

          // {
          //   icon: 'cloud_upload_icon',
          //   visibility: true,
          //   key: 'member upload config',
          //   displayName: 'Member Upload',
          //   routePath: '/member-upload',
          // },
          {
            icon: 'group',
            key: 'Service',
            displayName: 'Service Groups',
            routePath: '/masters/service-grouping',
          },
          {
            icon: 'group',
            key: 'Service',
            displayName: 'Underwriting Guidelines',
            routePath: '/underwriting/guidelines',
          },
          {
            icon: 'group',
            key: 'Service',
            displayName: 'Underwriting Questionnaire',
            routePath: '/questionnaire',
          },
          {
            icon: 'credit_score',
            key: 'Tax',
            displayName: 'Tax',
            routePath: '/taxes',
          },
          {
            icon: 'account_balance',
            key: 'Bank',
            displayName: 'Banks',
            routePath: '/bank-management/banks',
          },
          {
            icon: 'credit_card',
            key: 'Card',
            displayName: 'Cards',
            routePath: '/bank-management/cards',
          },
        ],
      },
      {
        icon: 'apps_icon',
        displayName: 'Product Factory',
        children: [
          {
            icon: 'tune',
            key: 'Parameter',
            displayName: 'Rule Parameterization',
            routePath: '/masters/parameters',
          },
          {
            icon: 'event_seat',
            key: 'Benefit',
            displayName: 'Benefit Hierarchy',
            routePath: '/masters/benefit-hierarchy',
          },
          {
            icon: 'apps_icon',
            key: 'Product',
            displayName: 'Product Configurator',
            routePath: '/products',
          },
          {
            icon: 'assistant',
            visibility: true,
            key: 'Premium Management',
            displayName: 'Premium Management',
            routePath: '/premium',
          },
        ],
      },
      {
        icon: 'assignment_ind',
        displayName: 'SFA',
        children: [
          {
            icon: 'assignment_ind',
            key: 'Agent Management',
            visibility: true,
            displayName: 'Agent Management',
            routePath: '/agents/management',
          },
          {
            icon: 'assignment_ind',
            key: 'Agent Management',
            visibility: true,
            displayName: 'Target Management',
            routePath: '/agents/target',
          },
          {
            icon: 'book',
            key: 'Prospect',
            displayName: 'Prospect Management',
            routePath: '/client/prospects',
          },
          {
            icon: 'assignment_outlined',
            key: 'Plan',
            displayName: 'Plan',
            routePath: '/plans',
          },
          {
            icon: 'aspect_ratio',
            visibility: true,
            key: 'Quotation Management',
            displayName: 'Quotation Management',
            routePath: '/quotations',
          },
          {
            icon: 'group_add',
            key: 'Client',
            displayName: 'Client Management',
            routePath: '/client/clients',
          },
          {
            icon: 'receipt_long',
            key: 'Invoice',
            displayName: 'Invoice Management',
            routePath: '/invoices',
          },
        ],
      },
      {
        icon: 'receipt',
        displayName: 'Finance',
        children: [
          {
            icon: 'receipt',
            key: 'Receipt',
            displayName: 'Receipt Management',
            routePath: '/receipts',
          },
        ],
      },
      {
        icon: 'add_reaction',
        displayName: 'Policy',
        children: [
          {
            icon: 'add_reaction',
            key: 'Policy',
            displayName: 'Policy',
            routePath: '/policies',
          },
          {
            icon: 'supervised_user_circle',
            key: 'member',
            displayName: 'Member',
            routePath: '/member-upload/member',
          },
          {
            icon: 'receipt',
            key: 'member',
            displayName: 'Member Balance',
            routePath: '/member-balance',
          },
          {
            icon: 'receipt',
            key: 'member',
            displayName: 'Member Enquiry',
            routePath: '/member-enquiry',
          },
          {
            icon: 'pending_actions_icon',
            key: 'Provider',
            displayName: 'Renewal Pending',
            routePath: '/renewals/pending',
          },
          {
            icon: 'perm_data_settings_icon',
            key: 'Provider',
            displayName: 'Renewal Config',
            routePath: '/renewals/config',
          },
          {
            icon: 'credit_score',
            key: 'Endorsement',
            displayName: 'Endorsement',
            routePath: '/endorsements',
          },
        ],
      },

      // {
      //   icon: 'people_alt_icon',
      //   displayName: 'Client Management',
      //   children: [
      //     {
      //       icon: 'book',
      //       key: 'Prospect',
      //       displayName: 'Prospect',
      //       routePath: '/client/prospects',
      //     },
      //     {
      //       icon: 'group_add',
      //       key: 'Client',
      //       displayName: 'Client',
      //       routePath: '/client/clients',
      //     },

      //   ],
      // },
      // {
      //   icon: 'apps_icon',
      //   key: 'Product',
      //   displayName: 'Product',
      //   routePath: '/products',
      // },
      // {
      //   icon: 'assignment_ind',
      //   displayName: 'Agent',
      //   children: [
      //     {
      //       icon: 'assignment_ind',
      //       key: 'Agent',
      //       displayName: 'Agent Management',
      //       routePath: '/agents/management',
      //     },
      // {
      //   icon: 'account_balance_wallet_icon',
      //   key: 'Agent',
      //   displayName: 'Agent Commision',
      //   routePath: '/agents/commission',
      // },
      //   ]
      // },
      {
        icon: 'ballot_outlined',
        displayName: 'Provider',
        children: [
          {
            icon: 'ballot_outlined',
            key: 'Provider',
            displayName: 'Provider',
            routePath: '/provider',
          },
          {
            icon: 'group_add',
            key: 'Agent',
            displayName: 'Negotiation',
            routePath: '/provider/negotiation',
          },
          {
            icon: 'group_add',
            key: 'Provider',
            visibility: 'true',
            displayName: 'Visit Fee',
            routePath: '/provider/visit-fee',
          },
        ],
      },
      {
        icon: 'attach_money_icon',
        displayName: 'Fund',
        children: [
          {
            icon: 'list_alt_icon',
            key: 'Provider',
            displayName: 'Fund Statement',
            routePath: '/funds/statement',
          },
          {
            icon: 'perm_data_settings_icon',
            key: 'Provider',
            displayName: 'Fund Config',
            routePath: '/funds/config',
          },
          {
            icon: 'list_alt_icon',
            key: 'Provider',
            displayName: 'Fees Config',
            routePath: '/fees',
          },
        ],
      },

      // {
      //   icon: 'assignment_outlined',
      //   key: 'Plan',
      //   displayName: 'Plan',
      //   routePath: '/plans',
      // },
      // {
      // icon: 'add_task_icon',
      // displayName: 'Renewal',
      // children: [
      //     {
      //       icon: 'pending_actions_icon',
      //       key: 'Provider',
      //       displayName: 'Renewal Pending',
      //       routePath: '/renewals/pending',
      //     },
      //     {
      //       icon: 'perm_data_settings_icon',
      //       key: 'Provider',
      //       displayName: 'Renewal Config',
      //       routePath: '/renewals/config',
      //     },
      //   ]
      // },
      // {
      //   icon: 'receipt_long',
      //   key: 'Invoice',
      //   displayName: 'Invoice',
      //   routePath: '/invoices',
      // },
      // {
      //   icon: 'receipt',
      //   key: 'Receipt',
      //   displayName: 'Receipt',
      //   routePath: '/receipts',
      // },
      // {
      //   icon: 'credit_score',
      //   key: 'Tax',
      //   displayName: 'Tax',
      //   routePath: '/taxes',
      // },
      // {
      //   icon: 'credit_score',
      //   key: 'Endorsement',
      //   displayName: 'Endorsement',
      //   routePath: '/endorsements',
      // },
      // {
      //   icon: 'add_reaction',
      //   key: 'Policy',
      //   displayName: 'Policy',
      //   routePath: '/policies',
      // },
      // {
      //   icon: 'note',
      //   displayName: 'Master',
      //   children: [
      //     {
      //       icon: 'tune',
      //       key: 'Parameter',
      //       displayName: 'Parameter',
      //       routePath: '/masters/parameters',
      //     },
      //     {
      //       icon: 'event_seat',
      //       key: 'Benefit',
      //       displayName: 'Benefit Hierarchy',
      //       routePath: '/masters/benefit-hierarchy',
      //     },
      //     {
      //       icon: 'group',
      //       key: 'Service',
      //       displayName: 'Service Grouping',
      //       routePath: '/masters/service-grouping',
      //     },
      //     {
      //       icon: 'group',
      //       visibility: true,
      //       key: 'Address Config',
      //       displayName: 'Address Config',
      //       routePath: '/masters/address-config',
      //     },
      //   ],
      // },
      // {
      //   icon: 'local_atm',
      //   displayName: 'Bank Management',
      //   children: [
      //     {
      //       icon: 'account_balance',
      //       key: 'Bank',
      //       displayName: 'Banks',
      //       routePath: '/bank-management/banks',
      //     },
      //     {
      //       icon: 'credit_card',
      //       key: 'Card',
      //       displayName: 'Cards',
      //       routePath: '/bank-management/cards',
      //     },
      //   ],
      // },
      // {
      //   icon: 'assistant',
      //   visibility: true,
      //   key: 'Premium Management',
      //   displayName: 'Premium Management',
      //   routePath: '/premium',
      // },
      {
        icon: 'folder_shared',
        visibility: true,
        displayName: 'HR Management',
        children: [
          {
            icon: 'format_line_spacing',
            key: 'Agent Hierarchy',
            displayName: 'Agent Hierarchy',
            routePath: '/hr/agent-hierarchy',
          },
          {
            icon: 'equalizer',
            key: 'Employee Hierarchy',
            displayName: 'Employee Hierarchy',
            routePath: '/hr/employee-hierarchy',
          },
          {
            icon: 'format_line_spacing',
            key: 'Branch',
            displayName: 'Branch',
            routePath: '/branch',
          },
        ],
      },
      {
        icon: 'account_circle',
        displayName: 'User Management',
        children: [
          {
            icon: 'lock',
            key: 'Role',
            displayName: 'Access Rights',
            routePath: '/user-management/access-rights',
          },
          {
            icon: 'account_box',
            key: 'User',
            displayName: 'Users',
            routePath: '/user-management/users',
          },
        ],
      },
      {
        icon: 'assignment_turned_in',
        displayName: 'Claims Management',
        visibility: true,
        children: [
          {
            icon: 'dashboard',
            key: 'Claim',
            visibility: true,
            displayName: 'Claim Dashboard',
            routePath: '/claims',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Pre-Auth',
            routePath: '/claims/claims-preauth',
          },
          {
            icon: 'timeline-icon',
            key: 'Claim',
            displayName: 'Case Management',
            routePath: '/claims/case-management',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims Intimation',
            routePath: '/claims/claims-intimation',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims',
            routePath: '/claims/claims',
          },
          {
            icon: 'receipt',
            key: 'Credit',
            displayName: 'Credit Claim',
            routePath: '/claims/credit',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Reimbursement Claims ',
            routePath: '/claims/claims-reimbursement',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims To Be Proceessed',
            routePath: '/claims/claims-to-be-processed',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims Audit',
            routePath: '/claims/claims-audit',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Ready for Payment',
            routePath: '/claims/ready-for-payment',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Exgratia Claims',
            routePath: '/claims/rejected-claims',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Indiminity Claims',
            routePath: '/claims/claims-indemnity',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Letter',
            routePath: '/claims/letter',
          },
        ],
      },
      {
        icon: 'receipt',
        key: 'Claim',
        displayName: 'SLA Configuration',
        routePath: '/sla/configuration',
      },
      // {
      //   icon: 'group',
      //   visibility: true,
      //   key: 'Call Management',
      //   displayName: 'Call Management',
      //   routePath: '/masters/insurance-config/call-management',
      // },
      {
        icon: 'assignment_ind',
        displayName: 'Reports',
        routePath: '/reports',
        // children: [
        //   {
        //     icon: 'assignment_ind',
        //     key: 'Reports',
        //     visibility: true,
        //     displayName: 'Underwritings Reports',
        //   },
        //   {
        //     icon: 'book',
        //     key: '',
        //     displayName: 'Claims Reports',
        //     routePath: '/report/claims',
        //   },
        // ],
      },

      // {
      //   icon: 'aspect_ratio',
      //   visibility: true,
      //   key: 'Quotation Management',
      //   displayName: 'Quotation Management',
      //   routePath: '/quotations',
      // },
      // {
      //   icon: 'emoji_people',
      //   visibility: true,
      //   displayName: 'Member Upload Management',
      //   children: [
      //     {
      //       icon: 'cloud_upload_icon',
      //       key: 'member upload',
      //       displayName: 'Member Upload',
      //       routePath: '/member-upload',
      //     },
      //     {
      //       icon: 'supervised_user_circle',
      //       key: 'member',
      //       displayName: 'Member',
      //       routePath: '/member-upload/member',
      //     }],
      // },

      // to be added in tabs
      // {
      //   icon: 'account_balance_wallet_icon',
      //   key: 'Agent',
      //   displayName: 'Agent Commision',
      //   routePath: '/agents/commission',
      // },
    ]);
  }
  getAgentMenuList(): Observable<Menu[]> {
    return of([
      {
        icon: 'dashboard',
        key: 'Dashboard',
        visibility: true,
        displayName: 'Dashboard',
        routePath: '/dashboard',
      },
      {
        icon: 'note',
        displayName: 'Master',
        children: [
       
          {
            icon: 'group',
            visibility: true,
            key: 'Provider Config',
            displayName: 'Provider Config',
            routePath: '/masters/provider-config',
          },
          {
            icon: 'note',
            visibility: true,
            key: 'Insurance Config',
            displayName: 'Insurance Config',

            // routePath: '/masters/provider-config',
            children: [
              {
                icon: 'group',
                visibility: true,
                key: 'Basic Details',
                displayName: 'Basic Details',
                // routePath: '/masters/insurance-config/basic-details',
              },
          
              {
                icon: 'group',
                visibility: true,
                key: 'Benefit Config',
                displayName: 'Benefit Config',
                routePath: '/masters/insurance-config/benefit-config',
              },
              {
                icon: 'group',
                visibility: true,
                key: 'Address Config',
                displayName: 'Address Config',
                routePath: '/masters/insurance-config/address-config',
              },
            ]
          },
          {
            icon: 'group',
            visibility: true,
            key: 'Fund Config',
            displayName: 'Fund Config',
            routePath: '/masters/fund-config',
          },
        
          {
            icon: 'group',
            visibility: true,
            key: 'CommissionRole Config',
            displayName: 'CommissionRole Config',
            routePath: '/masters/commissionrole-config',
          },

          // {
          //   icon: 'cloud_upload_icon',
          //   visibility: true,
          //   key: 'member upload config',
          //   displayName: 'Member Upload',
          //   routePath: '/member-upload',
          // },
          {
            icon: 'group',
            key: 'Service',
            displayName: 'Service Groups',
            routePath: '/masters/service-grouping',
          },
          {
            icon: 'group',
            key: 'Service',
            displayName: 'Underwriting Guidelines',
            routePath: '/underwriting/guidelines',
          },
          {
            icon: 'group',
            key: 'Service',
            displayName: 'Underwriting Questionnaire',
            routePath: '/questionnaire',
          },
          {
            icon: 'credit_score',
            key: 'Tax',
            displayName: 'Tax',
            routePath: '/taxes',
          },
          {
            icon: 'account_balance',
            key: 'Bank',
            displayName: 'Banks',
            routePath: '/bank-management/banks',
          },
          {
            icon: 'credit_card',
            key: 'Card',
            displayName: 'Cards',
            routePath: '/bank-management/cards',
          },
        ],
      },
      {
        icon: 'apps_icon',
        displayName: 'Product Factory',
        children: [
          {
            icon: 'tune',
            key: 'Parameter',
            displayName: 'Rule Parameterization',
            routePath: '/masters/parameters',
          },
          {
            icon: 'event_seat',
            key: 'Benefit',
            displayName: 'Benefit Hierarchy',
            routePath: '/masters/benefit-hierarchy',
          },
          {
            icon: 'apps_icon',
            key: 'Product',
            displayName: 'Product Configurator',
            routePath: '/products',
          },
          {
            icon: 'assistant',
            visibility: true,
            key: 'Premium Management',
            displayName: 'Premium Management',
            routePath: '/premium',
          },
        ],
      },
      {
        icon: 'assignment_ind',
        displayName: 'SFA',
        children: [
          {
            icon: 'assignment_ind',
            key: 'Agent Management',
            visibility: true,
            displayName: 'Target Management',
            routePath: '/agents/target',
          },
          {
            icon: 'book',
            key: 'Prospect',
            displayName: 'Prospect Management',
            routePath: '/client/prospects',
          },
          {
            icon: 'assignment_outlined',
            key: 'Plan',
            displayName: 'Plan',
            routePath: '/plans',
          },
          {
            icon: 'aspect_ratio',
            visibility: true,
            key: 'Quotation Management',
            displayName: 'Quotation Management',
            routePath: '/quotations',
          },
          {
            icon: 'group_add',
            key: 'Client',
            displayName: 'Client Management',
            routePath: '/client/clients',
          },
          {
            icon: 'receipt_long',
            key: 'Invoice',
            displayName: 'Invoice Management',
            routePath: '/invoices',
          },
        ],
      },
      {
        icon: 'receipt',
        displayName: 'Finance',
        children: [
          {
            icon: 'receipt',
            key: 'Receipt',
            displayName: 'Receipt Management',
            routePath: '/receipts',
          },
        ],
      },
      {
        icon: 'add_reaction',
        displayName: 'Policy',
        children: [
          {
            icon: 'add_reaction',
            key: 'Policy',
            displayName: 'Policy',
            routePath: '/policies',
          },
          {
            icon: 'supervised_user_circle',
            key: 'member',
            displayName: 'Member',
            routePath: '/member-upload/member',
          },
          {
            icon: 'receipt',
            key: 'member',
            displayName: 'Member Balance',
            routePath: '/member-balance',
          },
          {
            icon: 'receipt',
            key: 'member',
            displayName: 'Member Enquiry',
            routePath: '/member-enquiry',
          },
          {
            icon: 'pending_actions_icon',
            key: 'Provider',
            displayName: 'Renewal Pending',
            routePath: '/renewals/pending',
          },
          {
            icon: 'perm_data_settings_icon',
            key: 'Provider',
            displayName: 'Renewal Config',
            routePath: '/renewals/config',
          },
          {
            icon: 'credit_score',
            key: 'Endorsement',
            displayName: 'Endorsement',
            routePath: '/endorsements',
          },
        ],
      },

      // {
      //   icon: 'people_alt_icon',
      //   displayName: 'Client Management',
      //   children: [
      //     {
      //       icon: 'book',
      //       key: 'Prospect',
      //       displayName: 'Prospect',
      //       routePath: '/client/prospects',
      //     },
      //     {
      //       icon: 'group_add',
      //       key: 'Client',
      //       displayName: 'Client',
      //       routePath: '/client/clients',
      //     },

      //   ],
      // },
      // {
      //   icon: 'apps_icon',
      //   key: 'Product',
      //   displayName: 'Product',
      //   routePath: '/products',
      // },
      // {
      //   icon: 'assignment_ind',
      //   displayName: 'Agent',
      //   children: [
      //     {
      //       icon: 'assignment_ind',
      //       key: 'Agent',
      //       displayName: 'Agent Management',
      //       routePath: '/agents/management',
      //     },
      // {
      //   icon: 'account_balance_wallet_icon',
      //   key: 'Agent',
      //   displayName: 'Agent Commision',
      //   routePath: '/agents/commission',
      // },
      //   ]
      // },
      {
        icon: 'ballot_outlined',
        displayName: 'Provider',
        children: [
          {
            icon: 'ballot_outlined',
            key: 'Provider',
            displayName: 'Provider',
            routePath: '/provider',
          },
          {
            icon: 'group_add',
            key: 'Agent',
            displayName: 'Negotiation',
            routePath: '/provider/negotiation',
          },
          {
            icon: 'group_add',
            key: 'Provider',
            visibility: 'true',
            displayName: 'Visit Fee',
            routePath: '/provider/visit-fee',
          },
        ],
      },
      {
        icon: 'attach_money_icon',
        displayName: 'Fund',
        children: [
          {
            icon: 'list_alt_icon',
            key: 'Provider',
            displayName: 'Fund Statement',
            routePath: '/funds/statement',
          },
          {
            icon: 'perm_data_settings_icon',
            key: 'Provider',
            displayName: 'Fund Config',
            routePath: '/funds/config',
          },
          {
            icon: 'list_alt_icon',
            key: 'Provider',
            displayName: 'Fees Config',
            routePath: '/fees',
          },
        ],
      },

      // {
      //   icon: 'assignment_outlined',
      //   key: 'Plan',
      //   displayName: 'Plan',
      //   routePath: '/plans',
      // },
      // {
      // icon: 'add_task_icon',
      // displayName: 'Renewal',
      // children: [
      //     {
      //       icon: 'pending_actions_icon',
      //       key: 'Provider',
      //       displayName: 'Renewal Pending',
      //       routePath: '/renewals/pending',
      //     },
      //     {
      //       icon: 'perm_data_settings_icon',
      //       key: 'Provider',
      //       displayName: 'Renewal Config',
      //       routePath: '/renewals/config',
      //     },
      //   ]
      // },
      // {
      //   icon: 'receipt_long',
      //   key: 'Invoice',
      //   displayName: 'Invoice',
      //   routePath: '/invoices',
      // },
      // {
      //   icon: 'receipt',
      //   key: 'Receipt',
      //   displayName: 'Receipt',
      //   routePath: '/receipts',
      // },
      // {
      //   icon: 'credit_score',
      //   key: 'Tax',
      //   displayName: 'Tax',
      //   routePath: '/taxes',
      // },
      // {
      //   icon: 'credit_score',
      //   key: 'Endorsement',
      //   displayName: 'Endorsement',
      //   routePath: '/endorsements',
      // },
      // {
      //   icon: 'add_reaction',
      //   key: 'Policy',
      //   displayName: 'Policy',
      //   routePath: '/policies',
      // },
      // {
      //   icon: 'note',
      //   displayName: 'Master',
      //   children: [
      //     {
      //       icon: 'tune',
      //       key: 'Parameter',
      //       displayName: 'Parameter',
      //       routePath: '/masters/parameters',
      //     },
      //     {
      //       icon: 'event_seat',
      //       key: 'Benefit',
      //       displayName: 'Benefit Hierarchy',
      //       routePath: '/masters/benefit-hierarchy',
      //     },
      //     {
      //       icon: 'group',
      //       key: 'Service',
      //       displayName: 'Service Grouping',
      //       routePath: '/masters/service-grouping',
      //     },
      //     {
      //       icon: 'group',
      //       visibility: true,
      //       key: 'Address Config',
      //       displayName: 'Address Config',
      //       routePath: '/masters/address-config',
      //     },
      //   ],
      // },
      // {
      //   icon: 'local_atm',
      //   displayName: 'Bank Management',
      //   children: [
      //     {
      //       icon: 'account_balance',
      //       key: 'Bank',
      //       displayName: 'Banks',
      //       routePath: '/bank-management/banks',
      //     },
      //     {
      //       icon: 'credit_card',
      //       key: 'Card',
      //       displayName: 'Cards',
      //       routePath: '/bank-management/cards',
      //     },
      //   ],
      // },
      // {
      //   icon: 'assistant',
      //   visibility: true,
      //   key: 'Premium Management',
      //   displayName: 'Premium Management',
      //   routePath: '/premium',
      // },
      {
        icon: 'folder_shared',
        visibility: true,
        displayName: 'HR Management',
        children: [
          {
            icon: 'format_line_spacing',
            key: 'Agent Hierarchy',
            displayName: 'Agent Hierarchy',
            routePath: '/hr/agent-hierarchy',
          },
          {
            icon: 'equalizer',
            key: 'Employee Hierarchy',
            displayName: 'Employee Hierarchy',
            routePath: '/hr/employee-hierarchy',
          },
          {
            icon: 'format_line_spacing',
            key: 'Branch',
            displayName: 'Branch',
            routePath: '/branch',
          },
        ],
      },
      {
        icon: 'account_circle',
        displayName: 'User Management',
        children: [
          {
            icon: 'lock',
            key: 'Role',
            displayName: 'Access Rights',
            routePath: '/user-management/access-rights',
          },
          {
            icon: 'account_box',
            key: 'User',
            displayName: 'Users',
            routePath: '/user-management/users',
          },
        ],
      },
      
      {
        icon: 'assignment_ind',
        displayName: 'Reports',
        routePath: '/reports',
        // children: [
        //   {
        //     icon: 'assignment_ind',
        //     key: 'Reports',
        //     visibility: true,
        //     displayName: 'Underwritings Reports',
        //     routePath: '/report/underwritings',
        //   },
        //   {
        //     icon: 'book',
        //     key: '',
        //     displayName: 'Claims Reports',
        //     routePath: '/report/claims',
        //   },
        // ],
      },
    ]);
  }
  getDoctorMenuList(): Observable<Menu[]> {
    return of([
      {
        icon: 'receipt',
        key: 'Claim',
        displayName: 'Pre-Auth',
        routePath: '/claims/claims-preauth',
      },
    ]);
  }
  
  getTPAMenuList(): Observable<Menu[]> {
    return of([
      {
        icon: 'assignment_turned_in',
        displayName: 'Claims Management',
        visibility: true,
        children: [
          {
            icon: 'dashboard',
            key: 'Claim',
            visibility: true,
            displayName: 'Claim Dashboard',
            routePath: '/claims',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Pre-Auth',
            routePath: '/claims/claims-preauth',
          },
          {
            icon: 'timeline-icon',
            key: 'Claim',
            displayName: 'Case Management',
            routePath: '/claims/case-management',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims Intimation',
            routePath: '/claims/claims-intimation',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims',
            routePath: '/claims/claims',
          },
          {
            icon: 'receipt',
            key: 'Credit',
            displayName: 'Credit Claim',
            routePath: '/claims/credit',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Reimbursement Claims ',
            routePath: '/claims/claims-reimbursement',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims To Be Proceessed',
            routePath: '/claims/claims-to-be-processed',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Claims Audit',
            routePath: '/claims/claims-audit',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Ready for Payment',
            routePath: '/claims/ready-for-payment',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Exgratia Claims',
            routePath: '/claims/rejected-claims',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Indiminity Claims',
            routePath: '/claims/claims-reimbursement',
          },
          {
            icon: 'receipt',
            key: 'Claim',
            displayName: 'Letter',
            routePath: '/claims/letter',
          },
        ],
      },
    ]);
  }
}
