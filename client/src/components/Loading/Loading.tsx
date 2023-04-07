import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <Box
      position="absolute"
      zIndex={100}
      top="50%"
      left="50%"
      sx={{ transform: "translate(-50%,-50%)" }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
