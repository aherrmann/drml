import React from "react";
import { Grid, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import ReactJson from "react-json-view";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, useLedgerDispatch, sendCommand } from "../../context/LedgerContext";
import { useStyles } from "./styles";
import { useUserState } from "../../context/UserContext";

export default function Contracts() {

  const classes = useStyles();
  const user = useUserState();
  const ledger = useLedgerState();
  const dispatch = useLedgerDispatch();

  const exerciseChoice = async () => {
    const templateId = { moduleName: "MyModule", entityName: "MyTemplate" };
    const contractId = "#1:0";
    const choice = "MyChoice";
    const argument = { arg1: "", arg2: 0, arg3: { arg3a: "", arg3b: "" }};
    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, contractId, choice, argument, meta };
    await sendCommand(dispatch, user.token, "exercise", command, e => { if (e) console.log("setIsSending: " + e) }, e => { if (e) console.log("setError:" + e) });
  }
  
  return (
    <>
      <PageTitle title="Contracts" button="Exercise choice" onButtonClick={exerciseChoice}/>
      <Grid container spacing={4}>
      <Grid item xs={12}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell key="moduleName" className={classes.cell1}>Module</TableCell>
              <TableCell key="entityName" className={classes.cell1}>Template</TableCell>
              <TableCell key="contractId" className={classes.cell2}>ContractId</TableCell>
              <TableCell key="argument" className={classes.cell3}>Argument</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ledger.contracts.map((c, i) => (
              <TableRow key={i} className={classes.tableRow}>
                <TableCell className={classes.tableCell}>{c.templateId.moduleName}</TableCell>
                <TableCell className={classes.tableCell}>{c.templateId.entityName}</TableCell>
                <TableCell className={classes.tableCell}>{c.contractId}</TableCell>
                <TableCell className={classes.tableCell}>
                  <ReactJson src={c.argument} name={false} collapsed={true} enableClipboard={false}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Grid>
      </Grid>
    </>
  );
}
