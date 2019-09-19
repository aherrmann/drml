import React, { useState } from "react";
import { Grid, Button, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import { useUserState } from "../../context/UserContext";
import { useLedgerState, getContract, useLedgerDispatch, sendCommand, fetchContracts } from "../../context/LedgerContext";

function NewOffers({ history }) {
  const classes = useStyles();
  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();
  const [state, setState] = useState({ title: "", content: "" });

  const handleChange = name => (event => {
    setState({ ...state, [name]: event.target.value });
  });

  const publisher = getContract(ledger, "Main", "Publisher");

  const offerVolumeLicense = async () => {
    const templateId = { moduleName: "Main", entityName: "Publisher" };
    const argument = {
      volumeLicence: {
        publisher: publisher.argument.publisher,
        reseller: state.reseller,
        volume: state.volume,
        book: {
          author: state.author,
          isbn: state.isbn,
          title: state.title,
          content: state.content
        }
      },
      cost: {
        value: state.value,
        currency: state.currency
      }
    };
    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, argument, meta };
    await sendCommand(ledgerDispatch, user.token, "create", command, e => { if (e) console.log("setIsSending: " + e) }, e => { if (e) console.log("setError:" + e) });
    await fetchContracts(ledgerDispatch, user.token, () => console.log("Fetching contracts"), () => console.log("Error occurred"));
    history.push("/app/offers");
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("reseller")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="Reseller"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("volume")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="Volume"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("author")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="Author"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("isbn")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="ISBN"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("title")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="Title"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("content")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="Content"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("value")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="Value"
                fullWidth
              />
              <TextField
                InputProps={{ classes: { underline: classes.textFieldUnderline, input: classes.textField } }}
                onChange={handleChange("currency")}
                onKeyDown={e => { if (e.key === "Enter") offerVolumeLicense(); }}
                margin="normal"
                placeholder="Currency"
                fullWidth
              />
              <div className={classes.formButtons}>
                <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center">
                  <Grid item xs={4}>
                    <Button
                      onClick={() => history.push("/app/offers")}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      // disabled={state.publisher === ""}
                      onClick={offerVolumeLicense}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Offer
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

export default withRouter(NewOffers);
