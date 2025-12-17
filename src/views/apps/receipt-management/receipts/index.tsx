"use client"
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";

import ReceiptDetails from "./receipts.details.component";
import ReceiptDashboardMain from "./ReceiptDashboardMain";

export default function Receipts() {
  const router = useRouter();
  const query = useSearchParams();

  React.useEffect(() => {
    if (!query.get("mode")) {
      router.replace("/receipts?mode=viewList");
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
            Receipt Management- Create Receipt
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get("mode")) {
          case "viewList":
            return <ReceiptDashboardMain />;
          case "create":
            return <ReceiptDetails />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
