"use client";
import * as React from "react";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import PlanDetailsComponent from "./plan.details.component";
import PlanListComponent from "./plan.list.component";





// function useQuery() {
//     return new URLSearchParams(useLocation().search);
//   }
  
export default function Plan() {
    const router = useRouter();
    const query = useSearchParams();

    useEffect(() => {
      if (!query.get("mode")) {
        router.replace("/plans?mode=viewList");
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
              color: "inherit",
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
                Plan Management- Create Plan
              </span>
            
          </Grid>
          ) : null}
    
          {(() => {
            switch (query.get("mode")) {
              case "viewList":
                return <PlanListComponent />;
              case "create":
                return <PlanDetailsComponent />;
              default:
                return null;
            }
          })()}
        </div>
      );
}
