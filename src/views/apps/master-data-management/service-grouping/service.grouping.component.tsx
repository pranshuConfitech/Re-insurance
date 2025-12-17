'use client'
import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { withStyles } from "@mui/styles";

import ServiceGroupingFormComponent from './service.grouping.form';
import ServiceGroupingList from './service.grouping.list';


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

function ServiceGroupingComponent(props:any) {
    const router = useRouter();
    const query = useSearchParams();

    const { classes } = props;

    const handleOpen = () => {
        router.push("/masters/service-grouping?mode=create");
    }

    const handleEdit = (row:any) => {
        router.push(`/masters/service-grouping/${row.id}?mode=edit`);
    }

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace("/masters/service-grouping?mode=viewList");
        }
      }, [query, router]); 

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <ServiceGroupingList handleEdit={handleEdit} handleOpen={handleOpen} />
                        );
                    case 'create':
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

export default withStyles(useStyles)(ServiceGroupingComponent);
