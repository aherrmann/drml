import React, { useState } from "react";
import { Grid, Typography, Button, TextField, Fade } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import { useUserState } from "../../context/UserContext";
import { useLedgerState, getContract, useLedgerDispatch, sendCommand, fetchContracts } from "../../context/LedgerContext";

function NewProposal({ history }) {
  var classes = useStyles();

  // global
  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();

  // local
  var [state, setState] = useState({ publisher: "", royalties: 0, book: "" });

  const handleChange = name => (event => {
    setState({ ...state, [name]: event.target.value });
  });

  const author = getContract(ledger, "Main", "Author");

  const proposeDeal = async () => {
    const templateId = { moduleName: "Main", entityName: "Author" };
    const contractId = author.contractId;
    const choice = "ProposeBookDeal";
    const argument = { bookDeal: { author: author.argument.author, publisher: state.publisher, royalties: state.royalties, book: state.book } };
    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, contractId, choice, argument, meta };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, e => console.log("setIsSending: " + e), e => console.log("setError:" + e));
    await fetchContracts(ledgerDispatch, user.token, e => console.log("setIsFetching: " + e), e => console.log("setError:" + e));
    history.push("/app/author/proposals");
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
                onChange={handleChange("publisher")}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    proposeDeal();
                  }
                }}
                margin="normal"
                placeholder="Publisher"
                fullWidth
              />
              <TextField
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                onChange={handleChange("royalties")}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    proposeDeal();
                  }
                }}
                margin="normal"
                placeholder="Royalties (in %)"
                fullWidth
              />
              <TextField
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                onChange={handleChange("book")}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    proposeDeal();
                  }
                }}
                margin="normal"
                placeholder="Book Cid"
                fullWidth
              />
              <div className={classes.formButtons}>
                <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center">
                  <Grid item xs={4}>
                    <Button
                      onClick={() =>
                        history.push("/app/author/proposals")
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
                        proposeDeal()
                      }
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Propose
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

export default withRouter(NewProposal);