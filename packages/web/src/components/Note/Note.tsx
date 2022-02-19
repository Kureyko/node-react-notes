import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { NoteProps } from "../../App.types";

const defaultStyle = {
  position: "fixed",
  width: 200,
  boxShadow: 3,
  p: 1,
};

const Note = ({
  userName,
  isOwner,
  id,
  color,
  posX,
  posY,
  value,
  onUpdate,
}: NoteProps) => {
  const dynamicStyle = {
    cursor: isOwner ? "move" : "auto",
    bgcolor: color,
    outline: isOwner ? "3px solid lime" : "",
    outlineOffset: "3px",
  };

  const handleStop: DraggableEventHandler = (e, data) => {
    onUpdate?.(id, data);
  };

  return (
    <Draggable
      disabled={!isOwner}
      onStop={handleStop}
      bounds='html'
      defaultPosition={{ x: posX, y: posY }}
      position={isOwner ? undefined : { x: posX, y: posY }}
    >
      <Box sx={{ ...defaultStyle, ...dynamicStyle }}>
        <Typography id='modal-modal-title' variant='subtitle1' component='h3'>
          {userName}
        </Typography>
        <TextField
          onMouseDown={(e) => e.stopPropagation()}
          id='time'
          type='text'
          placeholder={`What\'s on your mind?`}
          multiline
          fullWidth
          rows={2}
          disabled={!isOwner}
          value={value}
          onChange={(e) => onUpdate?.(id, e.target.value)}
        />
      </Box>
    </Draggable>
  );
};

export default React.memo(Note);
