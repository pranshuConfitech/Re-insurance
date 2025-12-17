import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import ParameterFormComponent from './parameters-form.component';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function ParametersActionComponent(props:any) {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace(`/masters/parameters/${props.match.params.id}?mode=edit`);
        }
      }, [query, router]); 

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <ParameterFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
