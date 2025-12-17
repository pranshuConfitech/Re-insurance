import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import QuotationFormComponent from './quotation.form';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function QuotationManagementAction(props:any) {
    const query = useSearchParams();
    const router = useRouter();

    React.useEffect(() => {
        if (!query.get("mode")) {
            router.replace(`/quotations/${props.match.params.quotationId}?mode=edit`);
        }
      }, [query, router]);
    
return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <QuotationFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
