'use client'
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import DenominationsAddComponent from "./denomination.create.component";
import DenominationListComponent from "./denomination.list.component";


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function DenominationComponent() {
  const router = useRouter();
  const query = useSearchParams();
  
  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace("/masters/denominations?mode=viewList");
    }
  }, [query, router]); 

  return (
    <div>
       {query.get("mode") === "create" ? (
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
          fontWeight: 600,
        }}
      >
       
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Denomination Management- Add Denomination
          </span>
        
      </Grid>
      ) : null}

      {(() => {
        switch (query.get("mode")) {
          case "viewList":
            return <DenominationListComponent />;
          case "create":
            return <DenominationsAddComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
