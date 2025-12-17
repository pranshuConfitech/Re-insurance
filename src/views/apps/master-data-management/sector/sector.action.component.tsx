import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import SectorFormComponent from "./sector-form.component";

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function SectorActionComponent(props: any) {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace(`/masters/sector/${props.match.params.id}?mode=edit`);
        }
    }, [query, router]);

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <SectorFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
