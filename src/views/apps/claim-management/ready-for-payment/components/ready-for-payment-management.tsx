// import React from "react";

// import { useRouter, useSearchParams } from "next/navigation";

// import Grid from "@mui/material/Grid";

// import RenewalListComponent from "@/views/apps/renewal-management/components/renewal.list.component";


// // function useQuery() {
// //   return new URLSearchParams(useLocation().search);
// // }


// export default function RenewalManagementComponent(props:any) {
//   const query = useSearchParams();
//   const router = useRouter();

//   React.useEffect(() => {
//     if (!query.get('mode')) {
//       router.replace("/renewals/pending?mode=viewList");
//     }
//   }, [query, router]);

//   return (
//     <div>
//       {query.get("mode") === 'create' ? (
//         <Grid
//           item
//           xs={12}
//           style={{
//             display: "flex",
//             justifyContent: "flex-start",
//             marginBottom: "20px",
//             height: "2em",
//             color: "#000",
//             fontSize: "18px",
//           }}
//         >
//           <span
//             style={{
//               fontWeight: "600",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center"
//             }}
//           >
//             Renewal Management - Create Renewal
//         </span>
//         </Grid>
//       ) : null}

//       {(() => {
//         switch (query.get("mode")) {
//           case 'viewList':
//             return (
//               <RenewalListComponent />
//             );
//           case 'create':
//             return (
//               <RenewalListComponent />
//             );
//           default:
//             return null;
//         }
//       })()}
//     </div>
//   );
// }
