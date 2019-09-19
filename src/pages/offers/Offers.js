import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, sendCommand, fetchContracts, useLedgerDispatch, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";
import { useUserState } from "../../context/UserContext";

function Offers({ history }) {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();
  const offers = getContracts(ledger, "Main", "BookVolumeLicenseCostlyProposal");
  const isPublisher = !!getContract(ledger, "Main", "Publisher");
  const isReseller = !!getContract(ledger, "Main", "Reseller");
  
  const splitIou = async (amount, ccy) => {
    const ious = getContracts(ledger, "Iou", "Iou");
    const iou = ious.find(i => i.argument.amount.currency === ccy && i.argument.amount.value >= amount);
    if (iou.argument.amount.value === amount) return;
    if (!iou) throw new Error("Couldn't find IOU with large enough amount");
    const command = {
      templateId: { moduleName: "Iou", entityName: "Iou" },
      contractId: iou.contractId,
      choice: "Split",
      argument: { newAmount: amount },
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  const acceptOffer = async c => {
    await splitIou(c.argument.cost.value, c.argument.cost.currency);
    const ious = getContracts(ledger, "Iou", "Iou");
    const iou = ious.find(i => i.argument.amount.currency === c.argument.cost.currency && i.argument.amount.value === c.argument.cost.value);
    const command = {
      templateId: { moduleName: "Main", entityName: "BookVolumeLicenseCostlyProposal" },
      contractId: c.contractId,
      choice: "AcceptAndPay",
      argument: { iouId: iou.contractId },
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  const rejectOffer = async c => {
    const command = {
      templateId: { moduleName: "Main", entityName: "BookDealProposal" },
      contractId: c.contractId,
      choice: "RejectDontPay",
      argument: {},
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  return (
    <>
      { isPublisher
        ? <PageTitle title="Offers" button="New Offer" onButtonClick={() => history.push("/app/offers/new")}/>
        : <PageTitle title="Offers" /> }
      <Contracts
        contracts={offers}
        columns={[
          [ "ISBN", "argument.proposal.book.isbn"],
          [ "Volume", "argument.proposal.volume" ],
          [ "Price", "argument.cost.value" ],
          [ "Currency", "argument.cost.currency"]]}
        actions={isReseller ? [[ "Accept", acceptOffer ], [ "Reject", rejectOffer ]] : []}/>
    </>
  );
}

export default withRouter(Offers);