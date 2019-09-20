import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, sendCommand, fetchContracts, useLedgerDispatch, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";
import { useUserState } from "../../context/UserContext";

function Purchases({ history }) {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();

  const purchases = getContracts(ledger, "Book", "BookPurchase");

  const acceptPurchase = async (c) => {
    const command = {
      templateId: { moduleName: "Book", entityName: "BookPurchase" },
      contractId: c.contractId,
      choice: "AcceptPurchase",
      argument: {},
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  return (
    <>
      <PageTitle title="Purchaess" />
      <Contracts
        contracts={purchases}
        columns={[
          ["Consumer", "argument.consumer"],
          ["ISBN", "argument.book"],
          ["payment", "argument.payment"],
        ]}
        actions={[["Accept", acceptPurchase]]}
      />
    </>
  );
}

export default withRouter(Purchases);