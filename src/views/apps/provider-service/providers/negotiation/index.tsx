'use client'

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { makeStyles } from "@mui/styles";

import NegotiationListComponent from "./negotiation.list.component";
import NegotiationFormComponent from "./negotiation.form.component";


const useStyles = makeStyles((theme:any) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0",
  },
}));

function NegotiationComponent() {
  const router = useRouter();
  const query = useSearchParams(); // Replaces useLocation().search
  const classes = useStyles();

  const handleOpen = () => {
    router.push("/provider/negotiation?mode=create");
  };

  const handleEdit = (row: any) => {
    router.push(`/provider/negotiation/${row.id}?mode=edit`);
  };

  useEffect(() => {
    if (!query.get('mode')) {
      router.replace("/provider/negotiation?mode=viewList");
    }
  }, [query, router]);

  return (
    <div >
            {(() => {
                switch (query.get("mode")) {
                    case 'viewList':
                        return (
                            <NegotiationListComponent handleEdit={handleEdit} handleOpen={handleOpen} />
                        );
                    case 'create':
                        return (
                            < NegotiationFormComponent />
                        );
                    default:
                        return null;
                }
            })()}
        </div>
  );
}

export default NegotiationComponent;
