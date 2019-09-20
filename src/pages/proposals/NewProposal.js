import React, { useState } from "react";
import { Grid, Button, TextField } from "@material-ui/core";
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
  var [state, setState] = useState({ publisher: "", royalties: 0, isbn: "", title: "", content: "" });
  const handleChange = name => (event => { setState({ ...state, [name]: event.target.value }); });

  const author = getContract(ledger, "Book", "Author");

  const proposeDeal = async () => {
    const templateId = { moduleName: "Book", entityName: "Author" };
    const contractId = author.contractId;
    const choice = "ProposeBookDeal";
    const argument = {
      bookDeal: {
        author: author.argument.author,
        publisher: state.publisher,
        royalties: state.royalties,
        book: {
          isbn: state.isbn,
          title: state.title,
          content: state.content,
          author: author.argument.author
        }
      }
    };
    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, contractId, choice, argument, meta };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
    history.push("/app/proposals");
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("publisher")}
                onKeyDown={e => { if (e.key === "Enter") proposeDeal(); }}
                margin="normal"
                placeholder="Publisher"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("royalties")}
                onKeyDown={e => { if (e.key === "Enter") proposeDeal(); }}
                margin="normal"
                placeholder="Royalties (in %)"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("isbn")}
                onKeyDown={e => { if (e.key === "Enter") proposeDeal(); }}
                margin="normal"
                placeholder="ISBN"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("title")}
                onKeyDown={e => { if (e.key === "Enter") proposeDeal(); }}
                margin="normal"
                placeholder="Title"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("content")}
                onKeyDown={e => { if (e.key === "Enter") proposeDeal(); }}
                margin="normal"
                placeholder="Content"
                fullWidth
              />
              <div className={classes.formButtons}>
                <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center">
                  <Grid item xs={4}>
                    <Button
                      onClick={() => history.push("/app/proposals")}
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
                      onClick={() => proposeDeal()}
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
