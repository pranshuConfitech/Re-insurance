"use client";
import * as React from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import TreatyConfigListComponent from "./treaty-config.list.component";
import TreatyConfigFormComponent from "./treaty-config.form.component";

export default function TreatyConfig() {
  const router = useRouter();
  const query = useSearchParams();

  useEffect(() => {
    if (!query.get("mode")) {
      router.replace("/reinsurance/treaty-config?mode=viewList");
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
            Create Treaty Configuration
          </span>

        </Grid>
      ) : null}

      {(() => {
        switch (query.get("mode")) {
          case "viewList":
            return <TreatyConfigListComponent />;
          case "create":
            return <TreatyConfigFormComponent />;
          default:
            return null;
        }
      })()}
    </div>
  );
}
