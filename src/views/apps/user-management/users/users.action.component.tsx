import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import UsersFormComponent from './users.form.component';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function UsersActionComponent(props:any) {
  const query = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (!query.get("mode")) {
      router.replace(`/user-management/users/${props.match.params.userName}?mode=edit`);
    }
  }, [query, router]);
  
return (
    <div>
      {(() => {
        switch (query.get('mode')) {
          case 'edit':
            return <UsersFormComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
