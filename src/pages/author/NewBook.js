import React, { useState } from "react";
import { Grid, Typography, Button, TextField, Fade } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { useStyles } from "./styles";
import { useUserState } from "../../context/UserContext";
import { useLedgerState, getContract, useLedgerDispatch, sendCommand, fetchContracts } from "../../context/LedgerContext";

function NewBook({ history }) {
  const classes = useStyles();
  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();
  const [state, setState] = useState({ title: "", content: "" });

  const handleChange = name => (event => {
    setState({ ...state, [name]: event.target.value });
  });

  const author = getContract(ledger, "Main", "Author");

  const createBook = async () => {
    const templateId = { moduleName: "Main", entityName: "Book" };
    const argument = { author: author.argument.author, title: state.title, content: state.content };
    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, argument, meta };
    await sendCommand(ledgerDispatch, user.token, "create", command, e => { if (e) console.log("setIsSending: " + e) }, e => { if (e) console.log("setError:" + e) });
    await fetchContracts(ledgerDispatch, user.token, () => console.log("Fetching contracts"), () => console.log("Error occurred"));
    history.push("/app/author/books");
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <TextField
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                onChange={handleChange("title")}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    createBook();
                  }
                }}
                margin="normal"
                placeholder="Title"
                fullWidth
              />
              <TextField
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                onChange={handleChange("content")}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    createBook();
                  }
                }}
                margin="normal"
                placeholder="Content"
                fullWidth
              />
              <div className={classes.formButtons}>
                <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center">
                  <Grid item xs={4}>
                    <Button
                      onClick={() =>
                        history.push("/app/author/books")
                      }
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      disabled={state.publisher === ""}
                      onClick={() =>
                        createBook()
                      }
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </React.Fragment>
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(NewBook);
