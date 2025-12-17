import React, { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { makeStyles } from '@mui/styles'
import { Toast } from 'primereact/toast'
import { map, switchMap } from 'rxjs/operators'
import { Edit, Visibility, Block, Undo, MoreVert, Replay } from '@mui/icons-material'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, TextField } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'


import ProviderBlacklistModal from './modals/provider.blackist.modal'
import ProviderCategoryHistoryModal from './modals/provider.category.history.modal'
import ProviderCategoryListModal from './modals/provider.category.list.modal'
import ProviderCategorizeModal from './modals/provider.category.modal'
import ProviderUnBlacklistModal from './modals/provider.unblacklist.modal'
import ProviderContractDetailsModal from './modals/providercontractDetails.modal'
import ProviderSendNotificationModal from './modals/provider.notification.modal'
import ProviderSuspendModal from './modals/provider.suspend.modal'
import ProviderWithdrawSuspensionModal from './modals/provider.withdraw.suspension.modal'
import ProviderSummaryCards from './ProviderSummaryCards'

import RoleService from '@/services/utility/role'
import { ProviderTypeService } from '@/services/remote-api/api/master-services/provider.type.service'
import { ProvidersService } from '@/services/remote-api/api/provider-services/provider.services'
import { PlanService } from '@/services/remote-api/api/plan-services/plan.service'
import { CategoryService } from '@/services/remote-api/api/master-services/category.service'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PROVIDER'
const roleService = new RoleService()
const providertypeservice = new ProviderTypeService()
const providerService = new ProvidersService()
const planservice = new PlanService()
const categoryservice = new CategoryService()

const pls$ = planservice.getPlans()
const ct$ = categoryservice.getCategories()

const useStyles = makeStyles((theme: any) => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow:
      '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  formControl: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    minWidth: 120
  },
  categoryButton: {
    marginLeft: '5px',
    marginBottom: '5px'
  }
}))

export default function ProviderApprovedListComponent(props: { filterTypeCode?: string; reloadTrigger?: number; onTypeChange?: (code?: string | null) => void }) {
  const history = useRouter()
  const classes = useStyles()
  const toast: any = React.useRef(null)

  const [planList, setPlanList] = React.useState([])
  const [categoryList, setCategoryList] = React.useState([])
  const [state, setState] = React.useState<{
    openBlacklistModal: boolean;
    openUnBlacklistModal: boolean;
    openContractDetailsModal: boolean;
    openProviderNotificationModal: boolean;
    openCategoryModal: boolean;
    openCategoryListModal: boolean;
    openProviderViewModal: boolean;
    openSuspendModal: boolean;
    openWithdrawSuspensionModal: boolean;
    providerCategoryHistorys: any[];
    providerIds: any[];
    blackListedProviderids: any[];
    selectedProvider: any;
    selectedProviderForSuspend: any | null;
  }>({
    openBlacklistModal: false,
    openUnBlacklistModal: false,
    openContractDetailsModal: false,
    openProviderNotificationModal: false,
    openCategoryModal: false,
    openCategoryListModal: false,
    openProviderViewModal: false,
    openSuspendModal: false,
    openWithdrawSuspensionModal: false,
    providerCategoryHistorys: [],
    providerIds: [],
    blackListedProviderids: [],
    selectedProvider: null,
    selectedProviderForSuspend: null
  })
  const [categoryModal, setCategoryModal] = React.useState(false)
  const [categoryData, setCategoryData] = React.useState([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState('active')
  const [reloadTable, setReloadTable] = React.useState(false)
  const [selectionBlacklistMenuDisabled, setSelectionBlacklistMenuDisabled] = React.useState(true)
  const [selectionUnBlacklistMenuDisabled, setSelectionUnBlacklistMenuDisabled] = React.useState(true)
  const [contractedCount, setContractedCount] = React.useState(0)
  const [nonContractedCount, setNonContractedCount] = React.useState(0)
  const [suspendedCount, setSuspendedCount] = React.useState(0)
  const [contractedFilter, setContractedFilter] = React.useState<boolean | undefined>(undefined)
  const [suspendedFilter, setSuspendedFilter] = React.useState<boolean>(false)
  const [expandedProviderDetails, setExpandedProviderDetails] = React.useState<{ [key: string]: any }>({})
  const [loadingProviderDetails, setLoadingProviderDetails] = React.useState<{ [key: string]: boolean }>({})
  const [dateFilterModalOpen, setDateFilterModalOpen] = React.useState(false)
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)

  // Fetch plans and categories once
  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []
        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({ name: ele.name, id: ele.id })
          })
        }
        setter(tableArr)
      })
      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })
      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable2(pls$, setPlanList)
  useObservable(ct$, setCategoryList)

  useEffect(() => {
    if (props?.reloadTrigger !== undefined && props?.reloadTrigger > 0) {
      setReloadTable(prev => !prev)
    }
  }, [props?.reloadTrigger])

  // Reload table when filterTypeCode changes (including when deselected/cleared to undefined)
  useEffect(() => {
    setReloadTable(prev => !prev)
  }, [props?.filterTypeCode])

  const handleContractedFilterClick = (contracted: boolean) => {
    // Toggle: if same filter clicked again, clear it
    if (contractedFilter === contracted) {
      setContractedFilter(undefined)
    } else {
      setContractedFilter(contracted)
      setSuspendedFilter(false) // Clear suspended filter when contracted filter is set
    }
  }

  const handleSuspendedFilterClick = () => {
    // Toggle: if same filter clicked again, clear it
    if (suspendedFilter) {
      setSuspendedFilter(false)
    } else {
      setSuspendedFilter(true)
      setContractedFilter(undefined) // Clear contracted filter when suspended filter is set
    }
  }

  useEffect(() => {
    setReloadTable(prev => !prev)
  }, [contractedFilter, suspendedFilter])

  // Fetch contracted and non-contracted counts (refetches when filterTypeCode changes)
  useEffect(() => {
    const subscriptions: any[] = []

    // If a specific provider type is selected, fetch counts only for that type
    if (props.filterTypeCode) {
      // Fetch contracted count for selected type
      const sub1 = providerService.getContractedProviderTypeCount(props.filterTypeCode, true).subscribe({
        next: (data: any) => {
          const count = data?.count || data || 0
          setContractedCount(typeof count === 'number' ? count : 0)
        },
        error: (err) => {
          console.error(`Error fetching contracted count:`, err)
          setContractedCount(0)
        }
      })
      subscriptions.push(sub1)

      // Fetch non-contracted count for selected type
      const sub2 = providerService.getContractedProviderTypeCount(props.filterTypeCode, false).subscribe({
        next: (data: any) => {
          const count = data?.count || data || 0
          setNonContractedCount(typeof count === 'number' ? count : 0)
        },
        error: (err) => {
          console.error(`Error fetching non-contracted count:`, err)
          setNonContractedCount(0)
        }
      })
      subscriptions.push(sub2)

      // Fetch suspended count for selected type
      const sub3 = providerService.getSuspendedProviderCount(props.filterTypeCode).subscribe({
        next: (data: any) => {
          const count = data?.count || data || 0
          setSuspendedCount(typeof count === 'number' ? count : 0)
        },
        error: (err) => {
          console.error(`Error fetching suspended count:`, err)
          setSuspendedCount(0)
        }
      })
      subscriptions.push(sub3)
    } else {
      // If no filter, fetch counts for all provider types (total)
      const providerTypeService = new ProviderTypeService()

      const sub1 = providerTypeService.getProviderType().subscribe((res: any) => {
        const providerTypes = res?.content || []
        let totalContracted = 0
        let totalNonContracted = 0
        let completedRequests = 0

        if (providerTypes.length === 0) {
          setContractedCount(0)
          setNonContractedCount(0)
          setSuspendedCount(0)
          return
        }

        let totalSuspended = 0
        const totalRequests = providerTypes.length * 3 // 3 requests per type (contracted + non-contracted + suspended)

        providerTypes.forEach((type: any) => {
          if (type.code) {
            // Fetch contracted count
            const sub2 = providerService.getContractedProviderTypeCount(type.code, true).subscribe({
              next: (data: any) => {
                const count = data?.count || data || 0
                totalContracted += typeof count === 'number' ? count : 0
                completedRequests++
                if (completedRequests === totalRequests) {
                  setContractedCount(totalContracted)
                  setNonContractedCount(totalNonContracted)
                  setSuspendedCount(totalSuspended)
                }
              },
              error: (err) => {
                console.error(`Error fetching contracted count for ${type.name}:`, err)
                completedRequests++
                if (completedRequests === totalRequests) {
                  setContractedCount(totalContracted)
                  setNonContractedCount(totalNonContracted)
                  setSuspendedCount(totalSuspended)
                }
              }
            })
            subscriptions.push(sub2)

            // Fetch non-contracted count
            const sub3 = providerService.getContractedProviderTypeCount(type.code, false).subscribe({
              next: (data: any) => {
                const count = data?.count || data || 0
                totalNonContracted += typeof count === 'number' ? count : 0
                completedRequests++
                if (completedRequests === totalRequests) {
                  setContractedCount(totalContracted)
                  setNonContractedCount(totalNonContracted)
                  setSuspendedCount(totalSuspended)
                }
              },
              error: (err) => {
                console.error(`Error fetching non-contracted count for ${type.name}:`, err)
                completedRequests++
                if (completedRequests === totalRequests) {
                  setContractedCount(totalContracted)
                  setNonContractedCount(totalNonContracted)
                  setSuspendedCount(totalSuspended)
                }
              }
            })
            subscriptions.push(sub3)

            // Fetch suspended count
            const sub4 = providerService.getSuspendedProviderCount(type.code).subscribe({
              next: (data: any) => {
                const count = data?.count || data || 0
                totalSuspended += typeof count === 'number' ? count : 0
                completedRequests++
                if (completedRequests === totalRequests) {
                  setContractedCount(totalContracted)
                  setNonContractedCount(totalNonContracted)
                  setSuspendedCount(totalSuspended)
                }
              },
              error: (err) => {
                console.error(`Error fetching suspended count for ${type.name}:`, err)
                completedRequests++
                if (completedRequests === totalRequests) {
                  setContractedCount(totalContracted)
                  setNonContractedCount(totalNonContracted)
                  setSuspendedCount(totalSuspended)
                }
              }
            })
            subscriptions.push(sub4)
          }
        })
      })
      subscriptions.push(sub1)
    }

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }, [props.filterTypeCode])

  const dataSource$ = useCallback((pageRequest: any = {}) => {
    pageRequest.page = pageRequest.page || 0;
    pageRequest.size = pageRequest.size || 10;
    pageRequest.summary = pageRequest.summary ?? true;
    // derive active from current toggle state
    pageRequest.active = selectedStatus === 'active';

    // Apply type filter if set (before search mapping, matching pending list pattern)
    if (props?.filterTypeCode) {
      pageRequest.type = props.filterTypeCode;
    }

    // Map searchKey to searchable fields (exactly matching pending list implementation)
    if (pageRequest.searchKey) {
      const searchKey = pageRequest.searchKey.trim();
      pageRequest['code'] = searchKey;
      pageRequest['type'] = searchKey;
      pageRequest['name'] = searchKey;
      pageRequest['contactNo'] = searchKey;
      // Add specialization and county/city to search
      pageRequest['specialization'] = searchKey;
      pageRequest['county'] = searchKey;
      pageRequest['city'] = searchKey;
    }

    delete pageRequest.searchKey;

    // Add suspended filter if set (similar to contracted filter)
    if (suspendedFilter) {
      pageRequest.suspended = true;
    }

    // Add contracted filter if set
    if (contractedFilter !== undefined) {
      pageRequest.contracted = contractedFilter;
    }

    // Add date range filter - pass fromDate and toDate to API
    if (startDate) {
      const fromDate = new Date(startDate);
      fromDate.setHours(0, 0, 0, 0);
      pageRequest.fromDate = fromDate.getTime(); // Pass as milliseconds
    }
    if (endDate) {
      const toDate = new Date(endDate);
      toDate.setHours(23, 59, 59, 999);
      pageRequest.toDate = toDate.getTime(); // Pass as milliseconds
    }

    return providerService.getProviders(pageRequest).pipe(
      map(data => {
        let content = data.content.map((item: any) => {
          item.providerBasicDetails.primaryContact = item.providerBasicDetails.contactNos?.[0]?.contactNo || '';
          item.blacklist = item.blackListed ? 'Yes' : 'No';
          item.contracted = item.providerBasicDetails?.contracted ?? false;
          item.suspended = item.suspended || item.isSuspended ? 'Yes' : 'No';
          item.category = item?.providerCategoryHistorys?.[0]?.categoryName;
          // Extract primary email
          const primaryEmail = item?.providerBasicDetails?.emails?.find((e: any) => e.contactType === 'PRIMARY')?.emailId;
          item.providerBasicDetails.email = primaryEmail || item?.providerBasicDetails?.primaryEmail || item?.providerBasicDetails?.email || 'N/A';
          // Format specializations
          const specializations = item?.providerBasicDetails?.specializations || [];
          item.specializations = specializations.length > 0
            ? specializations.map((spec: any) => spec.name || spec).join(', ')
            : 'N/A';
          // Add county/city for searchability
          const addresses = item?.providerAddresses?.addresses || [];
          const countyCityList: string[] = [];
          addresses.forEach((addr: any) => {
            const addrDetails = addr?.addressDetails || {};
            if (addrDetails.county) countyCityList.push(addrDetails.county);
            if (addrDetails.city) countyCityList.push(addrDetails.city);
          });
          item.searchableCountyCity = countyCityList.join(', ') || 'N/A';
          // normalize provider type so column `providerType.name` works
          const typeNameFromNested = item?.providerType?.name
          const typeNameFlat = item?.providerTypeName || item?.providerType
          const resolvedTypeName = typeNameFromNested || (typeof typeNameFlat === 'string' ? typeNameFlat : undefined)
          if (resolvedTypeName) {
            item.providerTypeName = resolvedTypeName
            item.providerType = { ...(item.providerType || {}), name: resolvedTypeName }
          }
          return item;
        });
        
        // Frontend filtering and sorting removed - API handles date range filtering now
        data.content = content;
        return data;
      })
    );
  }, [selectedStatus, props?.filterTypeCode, contractedFilter, suspendedFilter, startDate, endDate]);



  const handleOpen = () => history.push('/provider?mode=create')
  const openEditSection = (provider: any) => history.push(`/provider/${provider.id}?mode=edit`)
  const openViewSection = (provider: any) => {
    history.push(`/provider/${provider.id}?mode=view`)
  }

  const handleStatusChange = (newStatus: boolean) => {
    setSelectedStatus(newStatus ? 'active' : 'inactive');
    setReloadTable(prev => !prev);
  };

  const handleSelectedRows = (selectedProviders: any) => {
    if (selectedProviders.length === 0) {
      setSelectionBlacklistMenuDisabled(true);
      setSelectionUnBlacklistMenuDisabled(true);
    } else {
      let sp: any = [];
      let blp: any = [];
      const filteredLength = selectedProviders.filter((p: any) => !p.blackListed).length;
      const blFilterdLength = selectedProviders.filter((p: any) => p.blackListed).length;

      setSelectionBlacklistMenuDisabled(filteredLength !== selectedProviders.length);
      setSelectionUnBlacklistMenuDisabled(blFilterdLength !== selectedProviders.length);
      sp = selectedProviders.filter((p: any) => !p.blackListed).map((ele: any) => ele.id);
      blp = selectedProviders.filter((p: any) => p.blackListed).map((ele: any) => ele.id);
      setState({
        ...state,
        providerIds: sp,
        blackListedProviderids: blp
      });
    }
  };

  const openBlacklist = (e: any) => {
    setState({
      ...state,
      openBlacklistModal: true
    });
  };

  const openUnBlacklist = (e: any) => {
    setState({
      ...state,
      openUnBlacklistModal: true
    });
  };

  const openContractDetails = (e: any) => {
    setState({
      ...state,
      openContractDetailsModal: true
    });
  };

  const openCategorize = (provider: any) => {
    setState({
      ...state,
      openCategoryModal: true
    });
  };

  const handleBlacklistSubmit = (payload: any) => {
    payload['providerIds'] = state.providerIds;
    providerService.blacklistProvider(payload).subscribe(res => {
      setState({ ...state, openBlacklistModal: false });
      setReloadTable(true);
    });
  };

  const handleUnBlacklistSubmit = (payload: any) => {
    payload['providerIds'] = state.blackListedProviderids;
    providerService.unblacklistProvider(payload).subscribe(res => {
      setState({ ...state, openUnBlacklistModal: false });
      setReloadTable(true);
    });
  };

  const handleContractDetails = (payload: any) => {
    providerService.getProviderAllDetails(payload, state?.providerIds?.toString() || '').subscribe(res => {
      setState({ ...state, openContractDetailsModal: false });
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully Added',
        life: 3000
      });
      setReloadTable(true);
    });
  };

  const handleCategorizeSubmit = (payload: any) => {
    payload['providerIds'] = state.providerIds;
    providerService.categorizeProvider(payload).subscribe(res => {
      setState({ ...state, openCategoryModal: false });
      setReloadTable(true);
    });
  }

  const openSuspend = (provider: any) => {
    setState({
      ...state,
      openSuspendModal: true,
      selectedProviderForSuspend: provider
    });
  };

  const openWithdrawSuspension = (provider: any) => {
    setState({
      ...state,
      openWithdrawSuspensionModal: true,
      selectedProviderForSuspend: provider
    });
  };

  const handleSuspendSubmit = (payload: any) => {
    const providerId = state.selectedProviderForSuspend?.id;
    if (providerId) {
      payload['providerIds'] = [providerId];
      providerService.suspendProvider(payload).subscribe(res => {
        setState({ ...state, openSuspendModal: false, selectedProviderForSuspend: null });
        setReloadTable(prev => !prev);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Provider suspended successfully',
          life: 3000
        });
      });
    }
  };

  const handleWithdrawSuspensionSubmit = (payload: any) => {
    const providerId = state.selectedProviderForSuspend?.id;
    if (providerId) {
      payload['providerIds'] = [providerId];
      providerService.withdrawSuspensionProvider(payload).subscribe(res => {
        setState({ ...state, openWithdrawSuspensionModal: false, selectedProviderForSuspend: null });
        setReloadTable(prev => !prev);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Suspension withdrawn successfully',
          life: 3000
        });
      });
    }
  };


  const columnsDefinations = [
    { field: 'providerBasicDetails.name', headerName: 'Provider Name', align: 'left' },
    { field: 'providerBasicDetails.code', headerName: 'Provider Code', align: 'center' },
    { field: 'providerBasicDetails.email', headerName: 'Email', align: 'center' },
    { field: 'providerBasicDetails.primaryContact', headerName: 'Contact', align: 'center' },
    { field: 'specializations', headerName: 'Specialization', align: 'center' }
  ];

  const xlsColumns = [
    'providerBasicDetails.name',
    'providerBasicDetails.code',
    'providerTypeName',
    'providerBasicDetails.primaryContact',
    'specializations',
    'category',
    'blacklist'
  ]

  const actionBtnList = [
    { key: 'view_provider', icon: <Visibility fontSize="small" />, color: '#18a2b8', className: `ui-button-info ${classes.categoryButton}`, onClick: openViewSection },
    { key: 'update_provider', icon: <Edit fontSize="small" />, color: '#fbac05', className: `ui-button-warning ${classes.categoryButton}`, onClick: openEditSection },
    {
      key: 'suspend_withdraw_toggle',
      icon: (row: any) => {
        const isSuspended = row?.suspended === 'Yes' || row?.isSuspended === true;
        return isSuspended ? <Replay fontSize="small" /> : <Block fontSize="small" />;
      },
      color: (row: any) => {
        const isSuspended = row?.suspended === 'Yes' || row?.isSuspended === true;
        return isSuspended ? '#ff9800' : '#dc3545';
      },
      className: `${classes.categoryButton}`,
      onClick: (row: any) => {
        const isSuspended = row?.suspended === 'Yes' || row?.isSuspended === true;
        if (isSuspended) {
          openWithdrawSuspension(row);
        } else {
          openSuspend(row);
        }
      },
      tooltip: (row: any) => {
        const isSuspended = row?.suspended === 'Yes' || row?.isSuspended === true;
        return isSuspended ? 'Withdraw Suspension' : 'Suspend';
      }
    }
  ]

  const configuration: any = {
    useAccordionMode: true,
    enableSelection: true,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: actionBtnList,
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false
    },
    expandableConfig: {
      gridTemplate: '60px 1fr 1fr 1fr 1fr 1fr 1fr auto', // Use 'auto' for action column to fit content
      getStatusColor: (row: any) => {
        if (row.suspended === 'Yes' || row.isSuspended) return '#dc3545';
        if (row.contracted == true) return '#28a745';
        if (row.contracted == false) return '#17a2b8';
        return '#17a2b8';
      },
      onExpand: (row: any) => {
        // Fetch provider details when row is expanded
        const providerId = row.id;
        if (providerId && !expandedProviderDetails[providerId] && !loadingProviderDetails[providerId]) {
          setLoadingProviderDetails(prev => ({ ...prev, [providerId]: true }));
          providerService.getProviderDetails(providerId).subscribe({
            next: (details: any) => {
              setExpandedProviderDetails(prev => ({ ...prev, [providerId]: details }));
              setLoadingProviderDetails(prev => ({ ...prev, [providerId]: false }));
            },
            error: (error: any) => {
              console.error('Error fetching provider details:', error);
              setLoadingProviderDetails(prev => ({ ...prev, [providerId]: false }));
            }
          });
        }
      },
      renderExpandedContent: (row: any) => {
        const providerId = row.id;
        const details = expandedProviderDetails[providerId];
        const isLoading = loadingProviderDetails[providerId];

        // Get city and county from addresses
        let cityAndCounty = 'N/A';
        if (details?.providerAddresses?.addresses?.length > 0) {
          // Try to get from all addresses and merge address details
          const allAddressDetails: any = {};
          details.providerAddresses.addresses.forEach((addr: any) => {
            if (addr?.addressDetails) {
              Object.assign(allAddressDetails, addr.addressDetails);
            }
          });

          // Try different possible field names for city and county
          const city = allAddressDetails.city || allAddressDetails.cityName || allAddressDetails.add || '';
          const county = allAddressDetails.county || allAddressDetails.countyName || allAddressDetails.district || allAddressDetails.state || '';
          cityAndCounty = [city, county].filter(Boolean).join(', ') || 'N/A';

          // If still N/A, try to get from address string fields (excluding country, state codes)
          if (cityAndCounty === 'N/A' && Object.keys(allAddressDetails).length > 0) {
            // Get all address detail values and join them, excluding country/state codes
            const addressParts = Object.entries(allAddressDetails)
              .filter(([key, val]) => {
                const keyLower = key.toLowerCase();
                return val && typeof val === 'string' && val.trim() !== '' &&
                  !keyLower.includes('country') && !keyLower.includes('code');
              })
              .map(([key, val]) => val);
            if (addressParts.length > 0) {
              cityAndCounty = addressParts.join(', ');
            }
          }
        }

        // Get contact person details
        const contactPersonName = details?.providerAddresses?.providerContactPersonDetails?.name || 'N/A';
        const contactPersonEmail = details?.providerAddresses?.providerContactPersonDetails?.emailId || 'N/A';
        const contactPersonMobile = details?.providerAddresses?.providerContactPersonDetails?.mobileNo || 'N/A';

        // Get license number - check multiple possible locations
        const licenseNo = details?.providerBasicDetails?.licenseNumber ||
          details?.providerOtherDetails?.licenseCode ||
          details?.providerOtherDetails?.serviceTaxNoOrGstNo ||
          'N/A';

        // Get bank details
        const bankAccounts = details?.providerOtherDetails?.accountDetails || [];
        const bankAccountNo = bankAccounts.length > 0 ? bankAccounts[0]?.accountNo || 'N/A' : 'N/A';
        const bankName = bankAccounts.length > 0 ? bankAccounts[0]?.bankName || 'N/A' : 'N/A';

        // Get PIN/TIN
        const pinTin = details?.providerOtherDetails?.tinOrPin || details?.providerBasicDetails?.taxPinNumber || 'N/A';

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', padding: '0 20px' }}>
            {isLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                Loading details...
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>City and County</span>
                  <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                    {cityAndCounty}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Contact Person name</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {contactPersonName}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Contact Person email</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {contactPersonEmail}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Contact Person mobile</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {contactPersonMobile}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>License No</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {licenseNo}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Bank Account No</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {bankAccountNo}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Bank Name</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {bankName}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>PIN/TIN</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {pinTin}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      }
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      enableStatusToggle: true,
      onStatusChange: handleStatusChange,
      addCreateButton: false,
      colorLegend: [
        {
          color: '#28a745',
          label: `Contracted (${contractedCount})`,
          onClick: () => handleContractedFilterClick(true),
          isActive: contractedFilter === true
        },
        {
          color: '#17a2b8',
          label: `Non-contracted (${nonContractedCount})`,
          onClick: () => handleContractedFilterClick(false),
          isActive: contractedFilter === false
        },
        {
          color: '#dc3545',
          label: `Suspended (${suspendedCount})`,
          onClick: handleSuspendedFilterClick,
          isActive: suspendedFilter
        }
      ],
      enableGlobalSearch: true,
      searchText: 'Search by code, name, specialization & county / city',
      enableDateFilter: true,
      onDateFilterClick: () => setDateFilterModalOpen(true),
      dateFilterStartDate: startDate,
      dateFilterEndDate: endDate
    }
  }

  const handleDateFilterApply = () => {
    setDateFilterModalOpen(false)
    setReloadTable(prev => !prev)
  }

  const handleDateFilterClear = () => {
    setStartDate(null)
    setEndDate(null)
    setDateFilterModalOpen(false)
    setReloadTable(prev => !prev)
  }

  return (
    <div>
      <Toast ref={toast} />
      {/* Date Filter Modal */}
      <Dialog open={dateFilterModalOpen} onClose={() => setDateFilterModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filter by Date Range</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant="outlined" />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant="outlined" />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateFilterClear} color="secondary">
            Clear
          </Button>
          <Button onClick={handleDateFilterApply} variant="contained" color="primary">
            Apply Filter
          </Button>
          <Button onClick={() => setDateFilterModalOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* Summary Cards - Above search bar */}
      <ProviderSummaryCards
        onSelectType={props.onTypeChange}
        selectedTypeCode={props.filterTypeCode}
        disabled={false}
      />
      <FettleDataGrid
        $datasource={dataSource$}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        config={configuration}
        reloadtable={reloadTable} // counter ensures it always changes
      />



      {state.openBlacklistModal && (
        <ProviderBlacklistModal
          closeBlacklistModal={() => setState({ ...state, openBlacklistModal: false })}
          openBlacklistModal={state.openBlacklistModal}
          handleBlacklistSubmit={handleBlacklistSubmit}
        />
      )}
      {state.openUnBlacklistModal && (
        <ProviderUnBlacklistModal
          closeUnBlacklistModal={() => setState({ ...state, openUnBlacklistModal: false })}
          openUnBlacklistModal={state.openUnBlacklistModal}
          handleUnBlacklistSubmit={handleUnBlacklistSubmit}
        />
      )}
      {state.openContractDetailsModal && (
        <ProviderContractDetailsModal
          closeContractDetailsModal={() => setState({ ...state, openContractDetailsModal: false })}
          openContractDetailsModal={state.openContractDetailsModal}
          handleContractDetails={handleContractDetails}
        />
      )}
      {state.openProviderNotificationModal && (
        <ProviderSendNotificationModal closeContractDetailsModal={() => setState({ ...state, openProviderNotificationModal: false })} openContractDetailsModal={state.openProviderNotificationModal} handleContractDetails={() => { }} />
      )}
      {state.openCategoryModal && (
        <ProviderCategorizeModal
          closeCategorizeModal={() => setState({ ...state, openCategoryModal: false })}
          openCategoryModal={state.openCategoryModal}
          handleCategorizeSubmit={handleCategorizeSubmit}
          providerIds={state.providerIds}
          planList={planList}
          categoryList={categoryList}
        />
      )}
      {state.openCategoryListModal && (
        <ProviderCategoryListModal openCategoryListModal={state.openCategoryListModal} closeCategoryListModal={() => setState({ ...state, openCategoryListModal: false })} planList={planList} categoryList={categoryList} providerCategoryHistorys={state.providerCategoryHistorys} />
      )}
      {categoryModal && (
        <ProviderCategoryHistoryModal openCategoryListModal={categoryModal} closeCategoryListModal={() => setCategoryModal(false)} categoryList={categoryData} />
      )}
      {state.openSuspendModal && (
        <ProviderSuspendModal
          openSuspendModal={state.openSuspendModal}
          closeSuspendModal={() => setState({ ...state, openSuspendModal: false, selectedProviderForSuspend: null })}
          handleSuspendSubmit={handleSuspendSubmit}
        />
      )}
      {state.openWithdrawSuspensionModal && (
        <ProviderWithdrawSuspensionModal
          openWithdrawSuspensionModal={state.openWithdrawSuspensionModal}
          closeWithdrawSuspensionModal={() => setState({ ...state, openWithdrawSuspensionModal: false, selectedProviderForSuspend: null })}
          handleWithdrawSuspensionSubmit={handleWithdrawSuspensionSubmit}
        />
      )}
      {/* ProviderViewModal commented out - component not available */}
    </div>
  )
}
