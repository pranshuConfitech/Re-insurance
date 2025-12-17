"use client";

import React from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import ProspectManagementForm from './prospect-management-form';


export default function ProspectActionComponent(props: any) {
    const query = useSearchParams();
    const router = useRouter();

    const clientType = "RETAIL";
    const params = useParams();
    const prospectId: any = params.id;

    // function useQuery() {
    //     return new URLSearchParams(useLocation().search);
    // }
    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace(`/prospects/${props.match.params.id}?mode=edit`);
        }
    }, [query, router]);

    return (
        <div>
            <Grid item xs={12} style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "20px",
                height: "2em",
                color: "#000",
                fontSize: "18px",
            }}
            >
                <span
                    style={{
                        fontWeight: "600",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "5px",
                    }}
                >
                    Lead Management - Edit Lead
                </span>
            </Grid>
            {(() => {
                switch (query.get("mode")) {
                    case 'edit':
                        return (
                            <ProspectManagementForm clientType={clientType} prospectId={props.match?.params?.id} />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}
