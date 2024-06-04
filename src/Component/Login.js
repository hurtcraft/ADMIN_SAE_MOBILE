import React, {  useState } from "react";
import { Box, TextField, Button, Typography, Slide, Fade } from "@mui/material";
import Colors from "../Utils.js/Colors";
import logoPharmacie from "../Assets/logoPharmacie.png";
import { LoadingButton } from "@mui/lab";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { getToken } from "../Utils.js/FetchData";
import { Alert } from "@mui/material";
import { RegisterPopUp } from "../Utils.js/RegisterPopUp";
const Login = ({ setIsConnected }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [seSouvenir, setSeSouvenir] = useState(false);
  const [idNotFoundErreur, setIdNotFoundErreur] = useState(false);
  const handleSubmit = () => {
    let isValid = true;

    if (email.trim() === "") {
      setEmailError("un email est requis");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("un mot de passe est requis");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      setLoading(true);
      console.log("Email:", email);
      console.log("Password:", password);
      // Ajoutez votre logique de soumission ici

      login();
    }
  };

  const login = () => {
    fetch(process.env.REACT_APP_IP_SERVER + "admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 401) {
          console.log("pas authjorize");
          setIdNotFoundErreur(true);
          setLoading(false);
          return -1;
        }
        return response.json();
      })
      .then((data) => {
        if (data === -1) {
          return;
        }
        let accessToken = data.accessToken;
        let tokenType = data.tokenType;
        let token = tokenType + accessToken;

        console.log(data.status);
        if (seSouvenir) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        setIsConnected(true);
        console.log(data);
        setLoading(false);
        console.log("token");
        console.log(getToken());
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi des données:", error);
      });
  };
  sessionStorage.getItem("token");

  const [showPremiereCo, setShowPremiereCo] = useState(false);

  return (
    <Box
      style={{
        display: "flex",
        gap: "5%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Slide in={true} direction="top" timeout={300}>
        <img
          src={logoPharmacie}
          alt="logoPharmacie"
          style={{ marginBottom: "20px", width: "10vw", minWidth: 200 }}
        />
      </Slide>

      <Fade in={true} timeout={900}>
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", color: Colors.vertFonce }}
        >
          Bienvenue cher administrateur
        </Typography>
      </Fade>

      {idNotFoundErreur ? (
        <Alert
          severity="error"
          onClose={() => {
            setIdNotFoundErreur(false);
          }}
        >
          Mot de passe ou email inconnu :({" "}
        </Alert>
      ) : null}
      <Slide in={true} direction="left" timeout={300}>
        <TextField
          id="filled-basic"
          label="Email *"
          variant="filled"
          style={{ width: "20%", minWidth: 300 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
      </Slide>

      <Slide in={true} direction="right" timeout={300}>
        <TextField
          id="filled-password-input"
          required
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="filled"
          style={{ width: "20%", minWidth: 300 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />
      </Slide>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={seSouvenir}
              defaultChecked
              style={{ color: Colors.vertFonce }}
              onChange={(e) => {
                setSeSouvenir(!seSouvenir);
              }}
            />
          }
          label="se souvenir de moi?"
        />
      </FormGroup>

      <Slide in={true} timeout={300} direction="up">
        <LoadingButton
          loading={loading}
          variant="contained"
          size="large"
          style={{ backgroundColor: Colors.vertFonce }}
          onClick={handleSubmit}
        >
          Connexion
        </LoadingButton>
      </Slide>

      <Slide in={true} timeout={650} direction="up">
        <Button
          onClick={() => {
            setShowPremiereCo(true);
            console.log("shooooo");
          }}
          variant="text"
          style={{ fontSize: 20, color: Colors.vertFonce, fontWeight: "900" }}
        >
          première connexion?
        </Button>
      </Slide>
      {showPremiereCo && (
        <RegisterPopUp setShow={setShowPremiereCo} />
      )}

      <Slide in={true} timeout={950} direction="up">
        <Button
          variant="text"
          style={{ fontSize: 15, color: Colors.vertFonce, fontWeight: "900" }}
        >
          Mot de passe oublié?
        </Button>
      </Slide>
    </Box>
  );
};

export default Login;
