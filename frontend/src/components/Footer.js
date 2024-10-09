// import { color, display } from "@mui/system";
import React from "react";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          background: "rgba(0,0,0,.7)",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItem: "center",
        }}
      >
        <Box sx={{ color: "#fafafa" }}>Footer</Box>
      </Box>
    </>
  );
};

export default Footer;
