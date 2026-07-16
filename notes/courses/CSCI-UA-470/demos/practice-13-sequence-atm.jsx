// notes/courses/CSCI-UA-470/demos/practice-13-sequence-atm.jsx
import { sequenceOrder } from "@course";

/* note 13 practice (3 of 3) — the step up: withdrawing cash at an ATM. No self-call
   this time, but TWO round-trips to the bank (authorize, then debit), so the order
   is forced by data dependencies — you cannot withdraw before you are authorized,
   and cash is only dispensed after the account is actually debited. The bank's
   activation bar therefore appears twice down its lifeline. Direction is given. */

export default sequenceOrder({
  prompt: "Order the messages of an ATM cash withdrawal. Watch the data dependencies — each call needs the result of an earlier one.",
  participants: [
    { id: "cust", label: "Customer", kind: "actor" },
    { id: "atm", label: "ATM" },
    { id: "bank", label: "Bank" },
  ],
  messages: [
    { id: "insert", from: "cust", to: "atm", label: "insertCard(card, pin)", kind: "sync",
      why: "Nothing can happen until the card and PIN enter the machine — this call opens the session." },
    { id: "auth", from: "atm", to: "bank", label: "authorize(card, pin)", kind: "sync",
      why: "The ATM must check the card with the bank before it trusts any request." },
    { id: "authok", from: "bank", to: "atm", label: "ok", kind: "return",
      why: "Authorization has to return before the customer is allowed to withdraw." },
    { id: "withdraw", from: "cust", to: "atm", label: "withdraw(amount)", kind: "sync",
      why: "The customer can ask for cash only once the card is authorized." },
    { id: "debit", from: "atm", to: "bank", label: "debit(account, amount)", kind: "sync",
      why: "The account is debited before any money is released — the bank records it first." },
    { id: "balance", from: "bank", to: "atm", label: "newBalance", kind: "return",
      why: "The bank confirms the debit before the cash comes out." },
    { id: "dispense", from: "atm", to: "cust", label: "dispense(cash)", kind: "return",
      why: "Cash is handed over last, only after the account has actually been charged." },
  ],
  activations: [
    { p: "atm", from: 0, to: 6 },
    { p: "bank", from: 1, to: 2 },
    { p: "bank", from: 4, to: 5 },
  ],
});
