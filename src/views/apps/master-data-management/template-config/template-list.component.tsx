import React, { useRef } from 'react'

import { useRouter } from 'next/navigation'

import { withStyles } from '@mui/styles'
import { Toast } from 'primereact/toast'

import { TemplateConfigService } from '@/services/remote-api/api/master-services'
import RoleService from '@/services/utility/role'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'TEMPLATE_CONFIG'
const roleService = new RoleService()

const templateConfigService = new TemplateConfigService()
let templateConfigService$ = templateConfigService.getAllTemplateConfigs()

const useStyles = (theme: any) => ({
    tableBg: {
        height: 400,
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
        borderRadius: '4px'
    }
})

const dataSource$: any = (
    pageRequest: any = {
        page: 0,
        size: 10,
        summary: true,
        active: true
    }
) => {
    if (pageRequest.searchKey) {
        pageRequest['templateName'] = pageRequest.searchKey.trim()
    }

    delete pageRequest.searchKey

    return (templateConfigService$ = templateConfigService.getAllTemplateConfigs(pageRequest))
}

const columnsDefinations = [
    { field: 'documentOriginalName', headerName: 'Template Name' },
    { field: 'templateType', headerName: 'Type' },
    {
        field: 'startDate',
        headerName: 'Start Date',
        body: (rowData: any) => {
            if (rowData.startDate) {
                const date = new Date(rowData.startDate)
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                })
            }
            return ''
        }
    }
]

interface TemplateListComponentProps {
    onCreateTemplate: () => void
}

function withRouter(Component: any) {
    return function WrappedComponent(props: any) {
        const router = useRouter()
        const toast: any = useRef(null)

        return <Component {...props} router={router} toast={toast} />
    }
}

class TemplateListComponent extends React.Component<any, any> {
    configuration: any
    constructor(props: any) {
        super(props)

        this.state = {
            templateList: [],
            reloadTable: false
        }

        this.initConfig()
    }

    initConfig = () => {
        this.configuration = {
            enableSelection: false,
            scrollHeight: '300px',
            pageSize: 10,
            actionButtons: [
                {
                    key: 'download_template',
                    icon: 'pi pi-download',
                    onClick: this.downloadTemplate,
                    tooltip: 'Download'
                }
            ],
            header: {
                enable: true,
                addCreateButton: true,
                createButtonText: 'Create',
                onCreateButtonClick: this.handleOpen,
                text: 'Template Configuration',
                enableGlobalSearch: false
            }
        }
    }

    handleOpen = () => {
        this.props.onCreateTemplate()
    }

    downloadTemplate: any = (row: any) => {
        if (!row.templateType) {
            this.props.toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Template type is missing',
                life: 3000
            })
            return
        }

        templateConfigService
            .getTemplateView(row.templateType)
            .subscribe({
                next: (response: { blob: Blob; filename: string }) => {
                    const { blob, filename } = response

                    // Create a URL for the blob
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url

                    // Use filename from backend, or fallback to row data
                    link.download = filename || row.documentOriginalName || `${row.templateType}_template`

                    // Trigger download for all file types
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)

                    // Clean up the URL after a delay
                    setTimeout(() => window.URL.revokeObjectURL(url), 100)

                    this.props.toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Template downloaded successfully',
                        life: 3000
                    })
                },
                error: (err: any) => {
                    this.props.toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: err?.response?.data?.message || 'Failed to download template',
                        life: 3000
                    })
                    console.error('Error downloading template:', err)
                }
            })
    }

    render() {
        const { classes } = this.props

        return (
            <>
                <Toast ref={this.props.toast} />
                <FettleDataGrid
                    $datasource={dataSource$}
                    config={this.configuration}
                    columnsdefination={columnsDefinations}
                    reloadtable={this.state.reloadTable}
                />
            </>
        )
    }
}

export default withRouter(withStyles(useStyles)(TemplateListComponent))
