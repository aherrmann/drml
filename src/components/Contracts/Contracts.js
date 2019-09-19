import React from "react";
import ReactJson from "react-json-view";
import { Grid, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { useStyles } from "./styles";
import { Button } from "../Wrappers/Wrappers";

export default function Contracts({ contracts, columns, actions=[] }) {

  actions = actions ? actions : [];
  const isDefault = !columns;
  columns = columns ? columns : [ [ "Module", "templateId.moduleName" ], [ "Template", "templateId.entityName" ], [ "ContractId", "contractId" ] ];

  const classes = useStyles();

  function getByPath(data, path) {
    if (path.length === 0) return data;
    if (data[path[0]] === undefined) throw new Error("Object doesn't have key '" + path[0] + "': " + JSON.stringify(data));
    const value = getByPath(data[path[0]], path.slice(1));
    return value;
  }
  
  function getValue(data, path) {
    const split = typeof path === "string" && path !== "" ? path.split(".") : [];
    return getByPath(data, split);
  }
  
  
  return (
    <>
      <Grid container spacing={4}>
      <Grid item xs={12}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              { columns.map(col =>    (<TableCell className={classes.tableCell} key={col[0]}>{col[0]}</TableCell>)) }
              { isDefault ?           (<TableCell className={classes.tableCell} key="argument">Argument</TableCell>) : <></>}
              { actions.map(action => (<TableCell className={classes.tableCell} key={action[0]}>{action[0]}</TableCell>)) }
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((c, i) => (
              <TableRow key={i} className={classes.tableRow}>
                { columns.map(col => (<TableCell key={col[0]} className={classes.tableCell}>{getValue(c, col[1])}</TableCell>)) }
                { isDefault
                    ? (<TableCell key="argument" className={classes.tableCell}>
                        <ReactJson src={c.argument} name={false} collapsed={true} enableClipboard={false}/>
                      </TableCell>)
                    : <></> }

                { actions.map(action => (
                  <TableCell key={action[0]} className={classes.tableCell}>
                      <Button
                        color="primary"
                        size="small"
                        className="px-2"
                        variant="contained"
                        onClick={() => action[1](c)}
                      >
                        {action[0]}
                      </Button>
                    </TableCell>)
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Grid>
      </Grid>
    </>
  );
}
