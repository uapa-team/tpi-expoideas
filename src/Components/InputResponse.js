import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Snackbar,
  List,
  TextField,
  Grid,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Backend from "../serviceBackend";
export default withRouter(function (props) {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [openG, setOpenG] = useState(false);
  const [openR, setOpenR] = useState(false);
  const [validName, setValidName] = useState(true);
  const [validResponse, setValidResponse] = useState(true);
  const handleClickG = () => {
    setOpenG(true);
  };
  const handleCloseG = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenG(false);
  };
  const handleClickR = () => {
    setOpenR(true);
  };
  const handleCloseR = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenR(false);
  };
  const classes = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
      fontWeight: 600,
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  }));
  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };
  return (
    <Grid container>
      <Grid xs={1} item style={{ maxWidth: "4%" }} />
      <Grid xs={11} item>
        <Card
          style={{ minWidth: 275, marginTop: "0.5%", marginBottom: "0.5%" }}
          variant="outlined"
        >
          <CardContent style={{ paddingBottom: "0px", paddingTop: "0px" }}>
            <List style={{ paddingBottom: "0px", paddingTop: "0px" }}>
              <ListItem
                alignItems="flex-start"
                style={{ paddingTop: "1%", paddingBottom: "0px" }}
                key="avatr"
              >
                <ListItemAvatar>
                  <Avatar alt={props.name || "name"} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <TextField
                      style={{ width: "30%" }}
                      // id="outlined-basic"
                      label="Nombre Completo"
                      variant="outlined"
                      onChange={(e) => {
                        e.preventDefault();
                        setValidName(e.target.value !== "");
                        setName(e.target.value);
                      }}
                      value={name}
                      error={!validName}
                      helperText={
                        validName ? "" : "Por favor ingresa tu nombre completo"
                      }
                    />
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      ></Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <ListItem
                style={{ paddingTop: "0px", paddingBottom: "1.5%" }}
                key="field"
              >
                <Grid container>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      style={{ marginTop: "1%", width: "100%" }}
                      id="outlined-multiline-static"
                      label="Inserta aquí tu respuesta"
                      multiline
                      rows={2}
                      value={response}
                      variant="outlined"
                      onChange={(e) => {
                        e.preventDefault();
                        setResponse(e.target.value);
                        setValidResponse(e.target.value !== "");
                      }}
                      error={!validResponse}
                      helperText={
                        validResponse ? "" : "Por favor ingresa una respuesta"
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    style={{ alignSelf: "center", textAlign: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<Send />}
                      onClick={(e) => {
                        e.preventDefault();
                        setValidName(name !== "");
                        setValidResponse(response !== "");
                        if (name === "" || response === "") return;
                        Backend.sendRequest("post", `/respond/${props.id}`, {
                          full_name: name,
                          response: response,
                        }).then(async (res) => {
                          if (res.status === 200) {
                            handleClickG();
                            setName("");
                            setResponse("");
                            let jsonResponse = await res.json();
                            props.appendResponse(jsonResponse.inserted);
                            props.disableBox();
                          } else {
                            handleClickR();
                          }
                        });
                      }}
                    >
                      Enviar respuesta
                    </Button>
                    <Snackbar
                      open={openG}
                      autoHideDuration={6000}
                      onClose={handleCloseG}
                    >
                      <Alert onClose={handleCloseG} severity="success">
                        <Typography variant="h5">Respuesta enviada!</Typography>
                      </Alert>
                    </Snackbar>
                    <Snackbar
                      open={openR}
                      autoHideDuration={6000}
                      onClose={handleCloseR}
                    >
                      <Alert onClose={handleCloseR} severity="error">
                        <Typography variant="h5">
                          Ups! Hubo un problema!
                        </Typography>
                      </Alert>
                    </Snackbar>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
});
