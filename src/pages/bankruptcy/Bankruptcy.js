import React from "react";
import { withRouter } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, sendCommand, fetchContracts, useLedgerDispatch, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";
import { useUserState } from "../../context/UserContext";

function Bankruptcy({ history }) {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();

  const isPublisher = !!getContract(ledger, "Book", "Publisher");
  const isReseller = !!getContract(ledger, "Book", "Reseller");
  const isConsumer = !!getContract(ledger, "Book", "Consumer");
  const bankruptcyDeclaration = getContract(ledger, "Bankruptcy", "BankruptcyDeclaration");
  const bankruptcy = getContract(ledger, "Bankruptcy", "BankruptcyAgreement");

  const acceptBankruptcy = async () => {
    const command = {
      templateId: { moduleName: "Bankruptcy", entityName: "BankruptcyDeclaration" },
      contractId: bankruptcyDeclaration.contractId,
      choice: "Accept2",
      argument: {},
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  const transferVolumeLicense = async c => {
    const command = {
      templateId: { moduleName: "Bankruptcy", entityName: "BankruptcyAgreement" },
      contractId: bankruptcy.contractId,
      choice: "TransferVolumeLicense",
      argument: { isbn: c.argument.book.isbn, publisher: c.argument.publisher },
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  const transferLicense = async c => {
    const command = {
      templateId: { moduleName: "Bankruptcy", entityName: "BankruptcyAgreement" },
      contractId: bankruptcy.contractId,
      choice: "TransferLicense",
      argument: { isbn: c.argument.book.isbn, reader: c.argument.reader },
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  if (isReseller) {
    const reseller = getContract(ledger, "Book", "Reseller");
    const isOwnDeclared = bankruptcyDeclaration && bankruptcyDeclaration.argument.proposer === reseller.argument.reseller;
    const isOwn = bankruptcy && bankruptcy.argument.bankruptReseller === reseller.argument.reseller;
    return (
      <>
        { bankruptcyDeclaration
          ? (bankruptcyDeclaration.argument.proposer === reseller.argument.reseller ? <PageTitle title="Bankruptcy Declared" /> : <PageTitle title="Takeover Proposed" button="Accept Bankruptcy" onButtonClick={acceptBankruptcy} />)
          : (bankruptcy.argument.bankruptReseller === reseller.argument.reseller ? <PageTitle title="Bankruptcy Accepted" /> : <PageTitle title="Takeover Accepted" />) }
      </>
    );
  } else if (isPublisher) {
    const volumeLicenses = getContracts(ledger, "Book", "BookVolumeLicense").filter(bvl => bvl.argument.reseller === bankruptcy.argument.bankruptReseller);
    return (
      <>
        <PageTitle title="Bankruptcy" />
        <Contracts
          contracts={volumeLicenses}
          columns={[
            [ "Reseller", "argument.reseller" ],
            [ "ISBN", "argument.book.isbn"],
            [ "Volume", "argument.volume" ]
          ]}
          actions={[["Transfer", transferVolumeLicense]]}
        />
      </>
    );
  } else if (isConsumer) {
    const licenses = getContracts(ledger, "Book", "BookLicense").filter(bl => bl.argument.reseller === bankruptcy.argument.bankruptReseller);
    return (
      <>
        <PageTitle title="Bankruptcy" />
        <Contracts
          contracts={licenses}
          columns={[
            ["Reseller", "argument.reseller"],
            [ "ISBN", "argument.book.isbn"],
            [ "Title", "argument.book.title" ],
            [ "Author", "argument.book.author" ]
          ]}
          actions={[["Transfer", transferLicense]]}
        />
      </>
    );
  }
}

export default withRouter(Bankruptcy);