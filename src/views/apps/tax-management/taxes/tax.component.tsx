'use client'
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import TaxDetails from "./tax.details.component";
import TaxDashboardMain from "./TaxDashboardMain";



// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Taxes() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get("mode")) {
      router.replace("/taxes?mode=viewList");
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
            Tax Management- Create Tax
          </span>

        </Grid>
      ) : null}

      {(() => {
        switch (query.get("mode")) {
          case "viewList":
            return <TaxDashboardMain />;
          case "create":
            return <TaxDetails />;
          default:
            return null
        }
      })()}
    </div>
  );
}

