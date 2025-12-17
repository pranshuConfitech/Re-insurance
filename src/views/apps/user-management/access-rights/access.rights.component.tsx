'use client'
import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { withStyles } from '@mui/styles';

import AccessRightsFormComponent from './access.rights.form';
import AccessRightsList from './access.rights.list';


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

const useStyles = (theme:any) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
  },
});

function AccessRightsComponent(props:any) {
  const router = useRouter();
  const query = useSearchParams();

  const { classes } = props;

  const handleOpen = () => {
    // history.push("/user-management/access-rights/?mode=create");
  };

  // const handleEdit = row => {
  //   // history.push(`/user-management/access-rights/${row.id}?mode=edit`);
  //   // <ParametersListComponent handleEdit={handleEdit} handleOpen={handleOpen} />
  // };
  React.useEffect(() => {
    if (!query.get("mode")) {
      router.replace('/user-management/access-rights?mode=viewList');
    }
  }, [query, router]);
  
return (
    <div>
      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <AccessRightsList />;
          case 'create':
            return <AccessRightsFormComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default withStyles(useStyles)(AccessRightsComponent);
