import * as React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'
import ClaimMatrixModal from "./modal";

export default function ClaimMatrixComponent() {
  const [openModal, setOpenModal] = React.useState(false);
  const [type, setType] = React.useState('');
  // Data for IP claims
  const ipClaimsRows = [
    { fromAmount: "0", toAmount: "150,000", assessor: "Originate", supervisor: "Originate/Approve", manager: "Originate/Approve", general: "Originate/Approve", board: "" },
    { fromAmount: "150,000", toAmount: "450,000", assessor: "", supervisor: "Originate", manager: "Originate/Approve", general: "Originate/Approve", board: "" },
    { fromAmount: "450,000", toAmount: "1000,000", assessor: "", supervisor: "", manager: "Originate/Approve", general: "Originate/Approve", board: "" },
    { fromAmount: "1000,000", toAmount: "2000,000", assessor: "", supervisor: "", manager: "Originate", general: "Originate/Approve", board: "" },
    { fromAmount: "2000,000", toAmount: "", supervisor: "", manager: "Originate", general: "Originate/Approve", board: "Informed" },
  ];

  // Data for OP claims
  const opClaimsRows = [
    { fromAmount: "0", toAmount: "25,000", assessor: "Originate", supervisor: "Originate/Approve", manager: "Originate/Approve", general: "Originate/Approve", board: "" },
    { fromAmount: "25,000", toAmount: "45,000", assessor: "Originate", supervisor: "Originate/Approve", manager: "Originate/Approve", general: "Originate/Approve", board: "" },
    { fromAmount: "45,000", toAmount: "100,000", assessor: "Originate", supervisor: "Originate/Approve", manager: "Originate/Approve", general: "Originate/Approve", board: "" },
    { fromAmount: "100,000", toAmount: "200,000", assessor: "Originate", supervisor: "Originate/Approve", manager: "Originate/Approve", general: "Originate/Approve", board: "" },
    { fromAmount: "200,000", toAmount: "", assessor: "", supervisor: "Originate", manager: "Originate/Approve", general: "Originate/Approve", board: "Informed" },
  ];

  React.useEffect(() => {

    const token = (window as any).getToken?.()
    console.log('Authorization', `Bearer ${token}`) // Use the token in the headers
  }, []);


  return (
    <>
      {/* Modal for adding new claim matrix entries */}
      {openModal && (
        <ClaimMatrixModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          type={type}
        />
      )}
      <Box p={2}>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2}>
          <Typography variant="h6" gutterBottom>
            Processing of IP claims
          </Typography>
          <Button type='button' variant='contained' onClick={() => { setOpenModal(true); setType("IP") }}>
            <AddIcon />
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>From Amount</TableCell>
                <TableCell>To Amount</TableCell>
                <TableCell>Claims Assessor</TableCell>
                <TableCell>Supervisor</TableCell>
                <TableCell>Claims Manager</TableCell>
                <TableCell>General Manager</TableCell>
                <TableCell>Board Representative</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ipClaimsRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.fromAmount}</TableCell>
                  <TableCell>{row.toAmount}</TableCell>
                  <TableCell>{row.assessor}</TableCell>
                  <TableCell>{row.supervisor}</TableCell>
                  <TableCell>{row.manager}</TableCell>
                  <TableCell>{row.general}</TableCell>
                  <TableCell>{row.board}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mb={2}>
          <Typography variant="h6" gutterBottom>
            Processing of OP claims
          </Typography>
          <Button type='button' variant='contained' onClick={() => { setOpenModal(true); setType("OP") }}>
            <AddIcon />
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>From Amount</TableCell>
                <TableCell>To Amount</TableCell>
                <TableCell>Claims Assessor</TableCell>
                <TableCell>Supervisor</TableCell>
                <TableCell>Claims Manager</TableCell>
                <TableCell>General Manager</TableCell>
                <TableCell>Board Representative</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opClaimsRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.fromAmount}</TableCell>
                  <TableCell>{row.toAmount}</TableCell>
                  <TableCell>{row.assessor}</TableCell>
                  <TableCell>{row.supervisor}</TableCell>
                  <TableCell>{row.manager}</TableCell>
                  <TableCell>{row.general}</TableCell>
                  <TableCell>{row.board}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
