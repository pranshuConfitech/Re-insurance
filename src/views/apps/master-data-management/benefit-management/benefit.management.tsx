'use client'
import React from "react";

import { useSearchParams , useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";

import BenifitHierarchyComponent from "./benefit.hierarchy.component";
import BenefitHierarchyMainComponent from "./benefit.hierarchy.main";



// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }


export default function BenefitManagement(props:any) {
    const query = useSearchParams();
    const router = useRouter();


    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace("/masters/benefit-hierarchy?mode=viewList");
        }
      }, [query, router]); 

    return (
        <div>
            {query.get("mode") === 'create' ? (
                <Grid
                    item
                    xs={12}
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginBottom: "20px",
                        height: "2em",
                        color: "inherit",
                        fontSize: "18px",
                    }}
                >
                    <span
                        style={{
                            fontWeight: "600",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        Benefit Hierarchy Management - Create Product
                    </span>
                </Grid>
            ) : null}

            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <BenefitHierarchyMainComponent />
                        );
                    case 'create':
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
