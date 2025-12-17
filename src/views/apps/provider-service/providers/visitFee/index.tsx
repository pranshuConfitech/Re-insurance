'use client'
import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { makeStyles } from "@mui/styles";

import VisitFeeForm from "./visitFee.detail";

const useStyles = makeStyles((theme:any) => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 0",
    },
  }));

const VisitFeeComponent = () => {
  const router = useRouter();
  const  query = useSearchParams();
  const classes = useStyles();

  const handleOpen = () => {
    router.push("/provider/negotiation?mode=create");
  };

  const handleEdit = (row: any) => {
    router.push(`/provider/negotiation/${row.id}?mode=edit`);
  };

  // Redirect to viewList if mode is missing
  useEffect(() => {
    if (!query.get("mode")) {
      router.replace("/provider/visit-fee?mode=viewList");
    }
  }, [query.get("mode"), router]);

  return (
    <div >
        {(() => {
            switch (query.get("mode")) {
                case 'viewList':
                    return (
                        <VisitFeeForm />
                    );

                // case 'create':
                //     return (
                //         < NegotiationFormComponent />
                //     );
                default:
                    return null;
            }
        })()}
    </div>
  );
};

export default VisitFeeComponent;
