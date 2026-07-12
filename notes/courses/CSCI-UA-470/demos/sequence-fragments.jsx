import { sequenceDiagram } from "@course";

/* note 13 — a COMBINED FRAGMENT: the bank-check `alt` (from the IBM slides). The
   bank reads the amount and the balance, then branches: if the balance covers the
   amount it records the debit and stores the photo; otherwise (`else`) it charges
   a fee and marks the check returned. `alt` = mutually-exclusive branches split by
   guards; `opt` is the one-branch case (no `else`), `loop` repeats its body. */

export default sequenceDiagram({
  participants: [
    { id: "bank", label: "bank : Bank" },
    { id: "check", label: "theCheck : Check" },
    { id: "acct", label: "account : CheckingAccount" },
  ],
  messages: [
    { from: "bank", to: "check", label: "getAmount()", kind: "sync" },                       // 0
    { from: "check", to: "bank", label: "amount", kind: "return" },                          // 1
    { from: "bank", to: "acct", label: "getBalance()", kind: "sync" },                        // 2
    { from: "acct", to: "bank", label: "balance", kind: "return" },                          // 3
    { from: "bank", to: "acct", label: "addDebitTransaction(amount)", kind: "sync" },         // 4
    { from: "bank", to: "acct", label: "storePhotoOfCheck(theCheck)", kind: "sync" },         // 5
    { from: "bank", to: "acct", label: "addInsufficientFundFee()", kind: "sync" },            // 6
    { from: "bank", to: "acct", label: "noteReturnedCheck(theCheck)", kind: "sync" },         // 7
  ],
  activations: [
    { p: "bank", from: 0, to: 7 },
    { p: "check", from: 0, to: 1 },
    { p: "acct", from: 2, to: 3 },
    { p: "acct", from: 4, to: 7 },
  ],
  fragments: [
    { kind: "alt", guard: "balance >= amount", from: 4, to: 7,
      dividers: [{ at: 6, guard: "else" }] },
  ],
});
