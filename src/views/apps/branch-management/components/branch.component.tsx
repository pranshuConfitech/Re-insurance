'use client'
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import BranchDashboardMain from "./BranchDashboardMain";
import BasicDetails from "./branch.details.component";
import UnitBasicDetailsComponent from "./unit.details.component";

export default function Branch() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace("/branch?mode=viewList");
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
            {query.get("type") === "region" 
              ? "Region Management- Create Region" 
              : query.get("type") === "unit"
                ? "Unit Management- Create Unit"
                : "Branch Management- Create Branch"}
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get("mode")) {
          case "viewList":
            return <BranchDashboardMain />;
          case "create":
            return query.get("type") === "unit" ? <UnitBasicDetailsComponent /> : <BasicDetails />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
