import React from "react";
import { Grid, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import ReactJson from "react-json-view";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useStyles } from "./styles";

export default function Contracts({ contracts }) {

  const classes = useStyles();

  return (
    <>
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
            {contracts.map((c, i) => (
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
