import { Suspense } from 'react'

import TemplateConfigComponent from '@/views/apps/master-data-management/template-config/template-config.component'

const TemplateConfig = () => {
    return (
        <Suspense fallback={null}>
            <TemplateConfigComponent />
        </Suspense>
    )
}

export default TemplateConfig
