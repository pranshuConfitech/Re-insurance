'use client'
import React from "react";


// import { useHistory, useLocation } from "react-router-dom";
import { useRouter, useSearchParams } from "next/navigation";

import { withStyles } from "@mui/styles";

import ProductPremiumListComponent from "./product.premium.list.component";

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }



const useStyles = (theme:any) => ({

});

function PremiumDesignComponent(prop:any) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode');

  React.useEffect(() => {
    if (!mode) {
        router.replace("/premium?mode=viewList");
    }
  }, [mode, router]); 

    return (
        <div>
            {(() => {
                switch (mode) {
                    case 'viewList':
                        return (
                            <ProductPremiumListComponent  />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}

export default withStyles(useStyles)(PremiumDesignComponent);
