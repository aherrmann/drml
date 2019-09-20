import React, { useState } from "react";
import { Grid, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "./styles";
import { useUserState } from "../../context/UserContext";
import { useLedgerState, getContract, useLedgerDispatch, sendCommand, fetchContracts, getContracts } from "../../context/LedgerContext";

function NewBankrupcy({ history }) {
  var classes = useStyles();

  // global
  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();

  // local
  var [state, setState] = useState({ reseller: "Reseller1" });
  const handleChange = name => (event => { setState({ ...state, [name]: event.target.value }); });

  const reseller = getContract(ledger, "Book", "Reseller");

  const proposeBankrupcy = async () => {
    const templateId = { moduleName: "Bankruptcy", entityName: "BankruptcyDeclaration" };
    const publishers = getContracts(ledger, "Book", "BookVolumeLicense").map(bvl => bvl.argument.publisher);
    const consumers = getContracts(ledger, "Book", "BookLicense").map(bl => bl.argument.reader);
    const affectedParties = [...new Set(publishers), ...new Set(consumers)];
    const argument = {
      proposer: reseller.argument.reseller,
      receiver: state.reseller,
      proposal: {
        reseller: reseller.argument.reseller,
        newReseller: state.reseller,
        affectedParties
      }
    };
    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, argument, meta };
    await sendCommand(ledgerDispatch, user.token, "create", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
    history.push("/app/bankrupcy");
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="reseller">New Reseller</InputLabel>
                <Select
                  value={state.reseller}
                  onChange={handleChange("reseller")}
                  inputProps={{ id: "reseller" }}
                >
                  <MenuItem value="Reseller1">Reseller1</MenuItem>
                  <MenuItem value="Reseller2">Reseller2</MenuItem>
                  <MenuItem value="Reseller3">Reseller3</MenuItem>
                </Select>
              </FormControl>
              <div className={classes.formButtons}>
                <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center">
                  <Grid item xs={4}>
                    <Button
                      onClick={() => history.push("/app/bankrupcy")}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      onClick={() => proposeBankrupcy()}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Declare Bankrupcy
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

export default withRouter(NewBankrupcy);
