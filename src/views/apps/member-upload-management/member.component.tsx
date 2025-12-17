'use client'

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";


import MemberListComponent from "./member.list.component";


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

export default function MembersComponent(props:any) {
    const router = useRouter();
    const query = useSearchParams();

    const { classes } = props;

    const handleOpen = () => {
        // history.push("/masters/parameters?mode=create");
    }

    const handleEdit = (row: any) => {
        // history.push(`/masters/parameters/${row.id}?mode=edit`);
    }

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace("/member-upload/member?mode=viewList");
        }
      }, [query, router]); 
    
return (
        <div>
            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <MemberListComponent />
                        );
                    case 'create':
                        return (
                            <div>Work In Progress...</div>
                        );
                    default:
                        return null;
                }
            })()}
        </div>
    );
}

