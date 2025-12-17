'use client'
import React, { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { withStyles } from "@mui/styles";

import IndustryListComponent from "./industry.list.component";
import IndustryFormComponent from "./industry-form.component";


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

function Industry(props: any) {
    const router = useRouter();
    const query = useSearchParams();

    const { classes } = props;

    useEffect(() => {
        if (!query.get("mode")) {
            router.replace("/masters/industries?mode=viewList");
        }
    }, [query, router]);


    const handleOpen = () => {
        router.push("/masters/industries?mode=create");
    }

    const handleEdit = (row: any) => {
        router.push(`/masters/industries/${row.id}?mode=edit`);
    }

    return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <IndustryListComponent handleEdit={handleEdit} handleOpen={handleOpen} />
                        );
                    case 'create':
                        return (
                            <IndustryFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}

export default withStyles(useStyles)(Industry);
