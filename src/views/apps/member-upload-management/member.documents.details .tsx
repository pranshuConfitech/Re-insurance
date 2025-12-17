// import React from "react";

// import { Box, Typography } from "@mui/material";

// const TypographyStyle2:any = {
//   fontSize:"14px", padding:"5px 2px", textTransform:"capitalize",color:"#3C3C3C",
// }

// const TypographyStyle1:any = {
//   fontSize:"14px", display:"flex", alignItems:"center", textTransform:"capitalize",color:"#A1A1A1",
// }

// const MemberDocumentsDetails = () => {
//   const [expanded, setExpanded] = React.useState(false);

//   const handleChange = (panel:any) => (event:any, isExpanded:any) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   return (
//     <>
//     <Box>
//       <Box display={"flex"} marginY={"1%"}>
//         <Typography style={TypographyStyle1}>is this an employee?</Typography>&nbsp;
//         <span>:</span>&nbsp;
//         <select style={TypographyStyle2} disabled>
//           <option>No</option>
//           <option>Yes</option>
//         </select>
//       </Box>
//       <Box display={"flex"} marginY={"1%"}>
//         <Typography style={TypographyStyle1}>hardcopy of proposal form(y/n)</Typography>&nbsp;
//         <span>:</span>&nbsp;
//         <select style={TypographyStyle2} disabled>
//           <option>No</option>
//           <option>Yes</option>
//         </select>&nbsp;
//         <input type="file" disabled/>
//       </Box>
//     </Box>
//     </>
//   )
// }

// export default MemberDocumentsDetails;

import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";

const labelStyle = {
  fontSize: "14px",
  color: "#555",
  minWidth: "220px",
};

const selectStyle = {
  fontSize: "14px",
  borderRadius: "8px",
  backgroundColor: "#fafafa",
};

const MemberDocumentsDetails = () => {
  const [isEmployee, setIsEmployee] = React.useState("No");
  const [hasHardCopy, setHasHardCopy] = React.useState("No");

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
        backgroundColor: "white",
        maxWidth: 600,
      }}
    >
      {/* Employee Status */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography sx={labelStyle}>Is this an employee?</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={isEmployee}
            onChange={(e) => setIsEmployee(e.target.value)}
            disabled
            sx={selectStyle}
          >
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Proposal Form Upload */}
      <Box display="flex" alignItems="center" gap={2}>
        <Typography sx={labelStyle}>
          Hardcopy of proposal form (Y/N)
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={hasHardCopy}
            onChange={(e) => setHasHardCopy(e.target.value)}
            disabled
            sx={selectStyle}
          >
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="file"
          size="small"
          disabled
          sx={{
            flex: 1,
            "& input": {
              fontSize: "14px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MemberDocumentsDetails;
