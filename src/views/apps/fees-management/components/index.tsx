'use client'
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import FeesListComponent from "./fees.list.component";
import FeesDetailsComponent from "./fees.details.component";



// function useQuery() {
//     return new URLSearchParams(useLocation().search);
//   }
  
export default function Fees() {
    const router = useRouter();
    const query = useSearchParams();

    React.useEffect(() => {
      if (!query.get('mode')) {
        router.replace("/fees?mode=viewList");
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
                Fees Config- Create Fee
              </span>
            
          </Grid>
          ) : null}
    
          {(() => {
            switch (query.get("mode")) {
              case "viewList":
                return <FeesListComponent />;
              case "create":
                return <FeesDetailsComponent />;
              default:
                return null;
            }
          })()}
        </div>
      );
}
