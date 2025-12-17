'use client'
import React, { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import ServiceGroupingFormComponent from './service.grouping.form';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function ServiceGroupingAction(props:any) {
    const query = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!query.get("mode")) {
            router.replace(`/masters/service-grouping/${props.match.params.id}?mode=edit`);
        }
      }, [query, router]); 

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <ServiceGroupingFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
