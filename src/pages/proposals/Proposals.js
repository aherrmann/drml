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

  const proposals = getContracts(ledger, "Book", "BookDealProposal");
  const isPublisher = !!getContract(ledger, "Book", "Publisher");
  const isAuthor = !!getContract(ledger, "Book", "Author");

  const acceptProposal = async (c) => {
    const command = {
      templateId: { moduleName: "Book", entityName: "BookDealProposal" },
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
      templateId: { moduleName: "Book", entityName: "BookDealProposal" },
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
      { isAuthor
        ? <PageTitle title="Proposals" button="New Proposal" onButtonClick={() => history.push("/app/proposals/new")} />
        : <PageTitle title="Proposals" /> }
      <Contracts
        contracts={proposals}
        columns={[
          isAuthor ? ["Publisher", "argument.receiver"] : ["Author", "argument.proposer"],
          ["ISBN", "argument.proposal.book.isbn"],
          ["Title", "argument.proposal.book.title"],
          ["Royalties", "argument.proposal.royalties"]
        ]}
        actions={isPublisher ? [["Accept", acceptProposal], ["Reject", rejectProposal]] : []}
      />
    </>
  );
}

export default withRouter(Proposals);