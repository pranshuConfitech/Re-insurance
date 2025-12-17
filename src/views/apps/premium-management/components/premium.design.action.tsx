import React, { useEffect } from "react";


import { useRouter, useSearchParams } from "next/navigation";

import PremiumDesignFormComponent from './premium.design.form';

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function PremiumDesignAction(props:any) {
    const query = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!query.get("mode")) {
            router.push(`/premium/${props.match.params.productId}?mode=edit`);
        }
      }, [query, router]); 
    
return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <PremiumDesignFormComponent />
                        );
                    default:
                        null
                }
            })()}
        </div>
    );
}
