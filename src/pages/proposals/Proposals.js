import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, sendCommand, fetchContracts, useLedgerDispatch } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";
import { useUserState } from "../../context/UserContext";

function Proposals({ history }) {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();
  const proposals = getContracts(ledger, "Main", "BookDealProposal");

  const acceptProposal = async (c) => {
    const command = {
      templateId: { moduleName: "Main", entityName: "BookDealProposal" },
      contractId: c.contractId,
      choice: "Accept",
      argument: {},
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, e => console.log("setIsSending: " + e), e => console.log("setError:" + e));
    await fetchContracts(ledgerDispatch, user.token, e => console.log("setIsFetching: " + e), e => console.log("setError:" + e));
  }

  return (
    <>
      <PageTitle title="Proposals" button="New Proposal" onButtonClick={() => history.push("/app/author/proposals/new")}/>
      <Contracts contracts={proposals} actions={[["Accept", acceptProposal]]}/>
    </>
  );
}

export default withRouter(Proposals);