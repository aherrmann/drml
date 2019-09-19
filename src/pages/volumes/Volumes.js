import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useLedgerState, getContracts, sendCommand, fetchContracts, useLedgerDispatch, getContract } from "../../context/LedgerContext";
import Contracts from "../../components/Contracts/Contracts";
import { useUserState } from "../../context/UserContext";

function Volumes() {

  const user = useUserState();
  const ledger = useLedgerState();
  const ledgerDispatch = useLedgerDispatch();
  const volumes = getContracts(ledger, "Main", "BookVolumeLicense");
  const isReseller = !!getContract(ledger, "Main", "Reseller");
  
  const createLicense = async (c, reader) => {
    const command = {
      templateId: { moduleName: "Main", entityName: "BookVolumeLicense" },
      contractId: c.contractId,
      choice: "CreateLicense",
      argument: { reader },
      meta: { ledgerEffectiveTime: 0 }
    };
    await sendCommand(ledgerDispatch, user.token, "exercise", command, () => {}, () => {});
    await fetchContracts(ledgerDispatch, user.token, () => {}, () => {});
  }

  return (
    <>
      <PageTitle title="Volumes" />
      <Contracts
        contracts={volumes}
        columns={[
          [ "Publisher", "argument.publisher" ],
          [ "ISBN", "argument.book.isbn"],
          [ "Volume", "argument.volume" ]
        ]}
        actions={isReseller ? [[ "License", createLicense, "reader" ]] : []}/>
    </>
  );
}

export default Volumes;