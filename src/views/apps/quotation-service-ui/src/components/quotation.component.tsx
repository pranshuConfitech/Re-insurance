"use client"
import React, { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { withStyles } from "@mui/styles";

import QuotationListComponent from './quotation.list';
import QuotationFormComponent from './quotation.form';
import QuotationDashboardMain from './QuotationDashboardMain';


// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

const useStyles = (theme:any) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 0'
    }
});

function QuotationsComponent(props:any) {
    const router = useRouter();
    const query = useSearchParams();

    const { classes } = props;

    useEffect(() => {
        if (!query.get("mode")) {
          router.replace("/quotations?mode=viewList");
        }
      }, [query, router]);
 
    const handleOpen = () => {
        router.push("/quotations?mode=create");
    }

    const handleEdit = (row:any) => {
        router.push(`/quotations/${row.id}?mode=edit`);
    }

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <QuotationDashboardMain />
                        );
                    case 'create':
                        return (
                            < QuotationFormComponent />
                        );
                    default:
                       return null;
                }
            })()}
        </div>
    );
}

export default withStyles(useStyles)(QuotationsComponent);
