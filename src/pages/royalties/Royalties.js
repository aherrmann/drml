import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, getContract, sendCommand, useLedgerDispatch, fetchContracts } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";
import { useUserState } from "../../context/UserContext";

function Royalties() {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();
  const isAuthor = !!getContract(ledger, "Book", "Author");
  const royalties = getContracts(ledger, "Book", "RoyaltyPayment");

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

  const payout = async c => {
    const bookDeal = getContracts(ledger, "Book", "BookDeal").find(d => d.argument.book.isbn === c.argument.bookISBN);
    if (!bookDeal) throw new Error("Couldn't find book deal for ISBN " + c.argument.bookISBN);
    const payoutAmount = parseFloat(c.argument.amount.value) * parseFloat(bookDeal.argument.royalties);
    var ious = getContracts(ledger, "Iou", "Iou");
    var iou = ious.find(i => i.argument.amount.currency === c.argument.amount.currency && parseFloat(i.argument.amount.value) === payoutAmount);
    if (!iou) {
      await splitIou(payoutAmount, c.argument.amount.currency);
      ious = getContracts(ledger, "Iou", "Iou");
      iou = ious.find(i => i.argument.amount.currency === c.argument.amount.currency && i.argument.amount.value === payoutAmount);
    }
    const command = {
      templateId: { moduleName: "Book", entityName: "RoyaltyPayment" },
      contractId: c.contractId,
      choice: "PayOut",
      argument: { iouId: iou.contractId },
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  return (
    <>
      <PageTitle title="Royalties" />
      <Contracts
        contracts={royalties}
        columns={[
          isAuthor ? ["Publisher", "argument.publisher"] : ["Author", "argument.author"],
          ["ISBN", "argument.bookISBN"],
          ["Notional", "argument.amount.value"],
          ["Currency", "argument.amount.currency"]
        ]}
        actions={isAuthor ? [] : [["Payout", payout]]}
      />
    </>
  );
}

export default Royalties