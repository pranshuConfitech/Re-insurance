import React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import DocSourceFormComponent from "./doc-source-form.component";

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function DocSourceActionComponent(props: any) {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace(`/masters/doc-source/${props.match.params.id}?mode=edit`);
        }
    }, [query, router]);

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <DocSourceFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
