import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";

function Proposals({ history }) {

  const ledger = useLedgerState();
  const proposals = getContracts(ledger, "Main", "BookDealProposal");

  return (
    <>
      <PageTitle title="Proposals" button="New Proposal" onButtonClick={() => history.push("/app/author/proposals/new")}/>
      <Contracts contracts={proposals} />
    </>
  );
}

export default withRouter(Proposals);