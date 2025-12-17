'use client'
import React, { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { withStyles } from "@mui/styles";

import ParameterFormComponent from './parameters-form.component';
import ParametersListComponent from './parameters.list.component';


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

function ParametersComponent(props:any) {
    const router = useRouter();
    const query = useSearchParams();

    const { classes } = props;

    useEffect(() => {
        if (!query.get("mode")) {
            router.replace("/masters/parameters?mode=viewList");
        }
      }, [query, router]); 

      
    const handleOpen = () => {
        router.push("/masters/parameters?mode=create");
    }

    const handleEdit = (row:any) => {
        router.push(`/masters/parameters/${row.id}?mode=edit`);
    }

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <ParametersListComponent handleEdit={handleEdit} handleOpen={handleOpen} />
                        );
                    case 'create':
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

export default withStyles(useStyles)(ParametersComponent);
