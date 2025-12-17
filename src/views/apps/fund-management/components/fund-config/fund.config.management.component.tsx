'use client'
import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import FundConfigListComponent from "./fund.config.list.component";
import FundConfigForm from "./fund.config.form";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }


export default function FundConfigManagementComponent(props:any) {
  const query = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace("/funds/config?mode=viewList");
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
            color: "#000",
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
            Fund Config Management - Create
        </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get("mode")) {
          case 'viewList':
            return (
              <FundConfigListComponent />
            );
          case 'create':
            return (
              <FundConfigForm />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
