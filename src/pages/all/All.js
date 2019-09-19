import React from "react";
import { useLedgerDispatch, sendCommand, useLedgerState } from "../../context/LedgerContext";
import { useUserState } from "../../context/UserContext";
import Contracts from "../../components/Contracts/Contracts";
import PageTitle from "../../components/PageTitle/PageTitle";

export default function All() {

  const user = useUserState();
  const ledger = useLedgerState();
  const dispatch = useLedgerDispatch();

  const exerciseChoice = async () => {
    const templateId = { moduleName: "MyModule", entityName: "MyTemplate" };
    const contractId = "#1:0";
    const choice = "MyChoice";
    const argument = { arg1: "", arg2: 0, arg3: { arg3a: "", arg3b: "" }};
    const meta = { ledgerEffectiveTime: 0 }; // Required if sandbox runs with static time
    const command = { templateId, contractId, choice, argument, meta };
    await sendCommand(dispatch, user.token, "exercise", command, e => { if (e) console.log("setIsSending: " + e) }, e => { if (e) console.log("setError:" + e) });
  }
  
  return (
    <>
      <PageTitle title="Contracts" button="Exercise choice" onButtonClick={exerciseChoice}/>
      <Contracts contracts={ledger.contracts} />
    </>
  );
}
