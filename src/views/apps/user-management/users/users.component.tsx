'use client'
import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { withStyles } from '@mui/styles';

import UsersFormComponent from './users.form.component';
import UsersListComponent from './users.list';


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

function UsersComponent(props:any) {
  const router = useRouter();
  const query = useSearchParams();

  const { classes } = props;

  const handleOpen = () => {
    router.push('/user-management/users?mode=create');
  };

  const handleEdit = (row:any) => {
    router.push(`/user-management/users/${row.userName}?mode=edit`);
  };

  React.useEffect(() => {
    if (!query.get("mode")) {
      router.replace('/user-management/users?mode=viewList');
    }
  }, [query, router]);
  
return (
    <div>
      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <UsersListComponent handleEdit={handleEdit} handleOpen={handleOpen} />;
          case 'create':
            return <UsersFormComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default withStyles(useStyles)(UsersComponent);
