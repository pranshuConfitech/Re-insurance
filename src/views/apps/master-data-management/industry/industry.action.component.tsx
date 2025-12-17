import React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import IndustryFormComponent from "./industry-form.component";

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function IndustryActionComponent(props: any) {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace(`/masters/industries/${props.match.params.id}?mode=edit`);
        }
    }, [query, router]);

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <IndustryFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
