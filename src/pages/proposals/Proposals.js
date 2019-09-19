import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, sendCommand, fetchContracts, useLedgerDispatch, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";
import { useUserState } from "../../context/UserContext";

function Proposals({ history }) {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();

  // const isAuthor = !!getContract(ledger, "Main", "Author");
  const proposals = getContracts(ledger, "Main", "BookDealProposal");
  const isPublisher = !!getContract(ledger, "Main", "Publisher");

  const acceptProposal = async (c) => {
    const command = {
      templateId: { moduleName: "Main", entityName: "BookDealProposal" },
      contractId: c.contractId,
      choice: "Accept",
      argument: {},
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  const rejectProposal = async (c) => {
    const command = {
      templateId: { moduleName: "Main", entityName: "BookDealProposal" },
      contractId: c.contractId,
      choice: "Reject",
      argument: {},
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  return (
    <>
      <PageTitle title="Proposals" button="New Proposal" onButtonClick={() => history.push("/app/proposals/new")}/>
      <Contracts
        contracts={proposals}
        columns={[["Author", "argument.proposer"], ["ISBN", "argument.proposal.book.isbn"], ["Title", "argument.proposal.book.title"], ["Royalties", "argument.proposal.royalties"]]}
        actions={isPublisher ? [["Accept", acceptProposal], ["Reject", rejectProposal]] : []}
      />
    </>
  );
}

export default withRouter(Proposals);