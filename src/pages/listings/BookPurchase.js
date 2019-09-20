import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "../proposals/styles";
import { useUserState } from "../../context/UserContext";
import { useLedgerState, getContract, getContracts, useLedgerDispatch, sendCommand, fetchContracts } from "../../context/LedgerContext";

function BookPurchase({ reseller, isbn, history }) {
  // global
  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();

  const consumer = getContract(ledger, "Book", "Consumer");

  const buyBook = async () => {
    const ious = getContracts(ledger, "Iou", "Iou");
    const templateId = { moduleName: "Book", entityName: "Consumer" };
    const contractId = consumer.contractId;
    const choice = "BuyBook";
    const argument = {
      reseller: reseller,
      book: isbn,
      payment: ious[ious.length-1].contractId
    };

    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, contractId, choice, argument, meta };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  return (
            <React.Fragment>
            <Button
                      onClick={() =>
                        buyBook()
                      }
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Purchase
                    </Button>
            </React.Fragment>
  );
}

export default withRouter(BookPurchase);
