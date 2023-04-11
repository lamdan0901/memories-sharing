import React, { useEffect, useState } from "react";
import { Snackbar as MUISnackbar } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../../store/store";
import { setSnackMsg } from "../../App/App.reducer";

function Snackbar() {
  const { snackMsg } = useAppSelector((state) => state.app);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;

    setOpen(false);
    dispatch(setSnackMsg(""));
  };

  useEffect(() => {
    setOpen(snackMsg !== "");
  }, [snackMsg]);

  return (
    <MUISnackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      message={snackMsg}
    />
  );
}

export default Snackbar;
