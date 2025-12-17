// import React from "react";

// import { Box, Grid, Typography } from "@mui/material";

// const TypographyStyle2:any = {
//   fontSize:"13px", alignItems:"center", display:"flex", textTransform:"capitalize",color:"#3C3C3C",
// }

// const TypographyStyle1:any = {
//   fontSize:"13px", alignItems:"center", display:"flex", textTransform:"capitalize",color:"#A1A1A1",
// }

// const MemberGenralInfoDetails = () => {
//   const [expanded, setExpanded] = React.useState(false);

//   const handleChange = (panel:any) => (event:any, isExpanded:any) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   return (
//     <Box padding={"0 0 5% 0"}>
//       <Grid container >
//         <Grid xs={6} margin={"5% 2%"}>
//           <Box  height={"100%"} width={"95%"}>
//           <Box border={"1px solid lightgray"} display={"flex"} justifyContent={"center"} alignItems={"center"}  height={"100%"}>
//             No Photo
//           </Box>
//           <Box display={"flex"} justifyContent={"center"}>
//             <Typography style={TypographyStyle1} >family ID / employee code</Typography>&nbsp;
//             <span>:</span>&nbsp;
//             <Typography style={TypographyStyle2} >SC999</Typography>
//           </Box>
//           </Box>
//         </Grid>
//         <Grid xs={6} >
//           <Box  height={"100%"} width={"95%"}>
//             <Box border={"1px solid lightgray"} display={"flex"} justifyContent={"center"} alignItems={"center"}  height={"30%"} marginY={"1px"}>
//               No Signature
//             </Box>
//             <Box border={"1px solid lightgray"} display={"flex"} justifyContent={"center"} alignItems={"center"}  height={"70%"} marginY={"1px"}>
//               No Age Proof Doc
//             </Box>
//             <Box display={"flex"} justifyContent={"space-between"}>
//               <Box display={"flex"}>
//                 <Typography style={TypographyStyle1} >Institution</Typography>&nbsp;
//                 <span style={TypographyStyle1}>:</span>&nbsp;
//                 <Typography style={TypographyStyle2} >Subham LTD</Typography>
//               </Box>
//               <Box display={"flex"}>
//                 <Typography style={TypographyStyle1} >Insurance</Typography>&nbsp;
//                 <span style={TypographyStyle1}>:</span>&nbsp;
//                 <Typography style={TypographyStyle2} >Demo Insurance company</Typography>
//               </Box>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>

//     </Box>
//   )
// }

// export default MemberGenralInfoDetails;


import React from "react";
import { Box, Grid, Typography, Card, CardContent, Divider } from "@mui/material";

const labelStyle = {
  fontSize: "13px",
  color: "#777",
  textTransform: "capitalize",
};

const valueStyle = {
  fontSize: "13px",
  color: "#333",
  fontWeight: 500,
  textTransform: "capitalize",
};

const placeholderStyle = {
  border: "1px dashed #ccc",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "13px",
  color: "#999",
  backgroundColor: "#fafafa",
};

const MemberGenralInfoDetails = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Side - Photo + Family ID */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: "0px 3px 8px rgba(0,0,0,0.05)" }}>
            <CardContent>
              {/* Photo Placeholder */}
              <Box sx={{ ...placeholderStyle, height: 180, mb: 2 }}>
                No Photo
              </Box>

              {/* Family ID */}
              <Box display="flex" justifyContent="center" gap={1}>
                <Typography sx={labelStyle}>Family ID / Employee Code</Typography>
                <Typography sx={{ color: "#999" }}>:</Typography>
                <Typography sx={valueStyle}>SC999</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - Signature, Age Proof, Institution, Insurance */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: "0px 3px 8px rgba(0,0,0,0.05)" }}>
            <CardContent>
              {/* Signature Placeholder */}
              <Box sx={{ ...placeholderStyle, height: 80, mb: 1 }}>
                No Signature
              </Box>

              {/* Age Proof Placeholder */}
              <Box sx={{ ...placeholderStyle, height: 140, mb: 2 }}>
                No Age Proof Doc
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Institution & Insurance */}
              <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={labelStyle}>Institution</Typography>
                  <Typography sx={{ color: "#999" }}>:</Typography>
                  <Typography sx={valueStyle}>Subham LTD</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={labelStyle}>Insurance</Typography>
                  <Typography sx={{ color: "#999" }}>:</Typography>
                  <Typography sx={valueStyle}>Demo Insurance Company</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberGenralInfoDetails;
