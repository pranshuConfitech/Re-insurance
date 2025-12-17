// Next Imports

// Third-party Imports
// import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports

// HOC Imports

// Config Imports

// Style Imports
import '@/app/globals.css'



// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css';
import '../../public/themes/bootstrap4-light-blue/theme.css'

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import GlobalCss from '@/theme/GlobalCss';

export const metadata = {
  title: 'Cognaisure-Core',
  description: 'Cognaisure-Core'
}

const RootLayout = ({ children, }: ChildrenType) => {
  // Vars

  const direction = 'ltr'

  return (

    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <GlobalCss />
        {children}</body>
    </html>

  )
}

export default RootLayout
