import React from 'react';

import { Modal, Box, IconButton } from '@mui/material';

import BiometricComponent from './biometric';

// import OtpComponent from "./otp-component";
// import { MemberService } from "../remote-api/api/member-services";

const modalStyle:any = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '80%',
  width: { xs: '95%', sm: '75%', md: '50%' },
  backgroundColor: '#ffffffff',
  borderRadius: '10px',
  boxShadow: 50,
  padding: 4,
};

// const memberservice = new MemberService();
const BioModal = ({ open, setOpen, memberId }:{open:any, setOpen:any, memberId:any }) => {
  const handleClose = () => setOpen(false);

  const matchResult = (value:any) => {
    console.log(value);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open Modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box style={modalStyle}>
          <IconButton
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}>
            {/* <ClearIcon /> */}
          </IconButton>

          <BiometricComponent
            matchResult={matchResult}
            memberId={memberId}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default BioModal;
