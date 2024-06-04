import { Box, Button, Typography } from "@mui/material";
import Colors from "./Colors";
export const RegisterPopUp = ({ show, setShow }) => {
  return (
    <Box
      sx={{
        display: "flex",
        position:"absolute",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width:"100vw",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >

      <Box sx={{backgroundColor:Colors.vertFonce,padding:20,borderRadius:10,zIndex:999}}>
        <Typography> contacter nous à l'email : xxx@gmail.com </Typography>
        <Button
        variant="contained"
        onClick={() => {
          setShow(false);
        }}
      >
        Fermer
      </Button>
      </Box>
    </Box>
  );
};
