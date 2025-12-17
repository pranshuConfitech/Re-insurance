'use client'
import React, { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { withStyles } from "@mui/styles";

import DocSourceListComponent from "./doc-source.list.component";
import DocSourceFormComponent from "./doc-source-form.component";


// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

const useStyles = (theme: any) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 0'
    }
});

function DocSource(props: any) {
    const router = useRouter();
    const query = useSearchParams();

    const { classes } = props;

    useEffect(() => {
        if (!query.get("mode")) {
            router.replace("/masters/doc-source?mode=viewList");
        }
    }, [query, router]);


    const handleOpen = () => {
        router.push("/masters/doc-source?mode=create");
    }

    const handleEdit = (row: any) => {
        router.push(`/masters/doc-source/${row.id}?mode=edit`);
    }

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <DocSourceListComponent handleEdit={handleEdit} handleOpen={handleOpen} />
                        );
                    case 'create':
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

export default withStyles(useStyles)(DocSource);
