import React from "react";
import { Container, Typography } from "@mui/material";

function Footer() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        pt: 2,
        borderTop: "1px solid #ccc",
        mb: 4,
      }}
    >
      <Typography fontWeight={600} fontSize={18} color="#6859f4">
        Memories Sharing - {new Date().getFullYear()}
      </Typography>
      <Typography color="textSecondary" textAlign="center" maxWidth={830}>
        Share your memories with our free photo sharing website. Upload your
        photos and share them with others for free. Store your photos online and
        access them from anywhere
      </Typography>
    </Container>
  );
}

export default Footer;
