import React, { useState } from "react";
import StyledModal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const MIN_CHAR_LENGTH = 2;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export interface ModalProps {
  open: boolean;
  onSubmit: (value: string) => void;
  loading: boolean;
}

const Modal = ({ open, onSubmit, loading }: ModalProps) => {
  const [userName, setUserName] = useState("");

  return (
    <StyledModal open={open} aria-labelledby='modal-modal-title'>
      <Box sx={style}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Authentication
            </Typography>
            <TextField
              color={userName.length >= MIN_CHAR_LENGTH ? "success" : undefined}
              id='your-name'
              label='Your name'
              variant='standard'
              required
              fullWidth
              margin='dense'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Box mt={2}>
              <Button
                disabled={userName.length < MIN_CHAR_LENGTH}
                variant='outlined'
                type='button'
                onClick={() => onSubmit(userName)}
              >
                Submit
              </Button>
            </Box>
          </>
        )}
      </Box>
    </StyledModal>
  );
};

export default Modal;
