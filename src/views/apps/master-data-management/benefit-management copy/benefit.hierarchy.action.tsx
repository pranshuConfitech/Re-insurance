import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import BenifitHierarchyComponent from './benefit.hierarchy.component';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function BenefitHierarchyAction(props:any) {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace(`/masters/benefit-hierarchy/${props.match.params.id}?mode=edit`);
        }
      }, [query, router]); 

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <BenifitHierarchyComponent />
                        );
                    default:
                       return null;
                }
            })()}
        </div>
    );
}
