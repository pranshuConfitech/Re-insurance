import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import AccessRightsFormComponent from './access.rights.form';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function AccessRightsAction(props:any) {
  const query = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (!query.get("mode")) {
      router.replace(`/user-management/access-rights/${props.match.params.roleName}?mode=edit`);
    }
  }, [query, router]);

  return (
    <div>
      {(() => {
        switch (query.get('mode')) {
          case 'edit':
            return <AccessRightsFormComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
