"use client"
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import LetterListComponent from "./letter.list.component";
import LetterDetailsComponent from "./letter.details.component";





// function useQuery() {
//     return new URLSearchParams(useLocation().search);
//   }
  
export default function Letter() {
    const router = useRouter();
    const query = useSearchParams();
  
    React.useEffect(() => {
      if (!query.get('mode')) {
        router.replace("/claims/letter?mode=viewList");
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
                Letter Management- Create
              </span>
            
          </Grid>
          ) : null}
    
          {(() => {
            switch (query.get("mode")) {
              case "viewList":
                return <LetterListComponent />;
              case "create":
                return <LetterDetailsComponent />;
              default:
                return null;
            }
          })()}
        </div>
      );
}
