// notes/courses/CSCI-UA-470/demos/practice-13-sequence-admit.jsx
import { sequenceOrder } from "@course";

/* note 13 practice (2 of 3) — a second, shorter interaction to order: admitting a
   patient. The message `Admit(patientID, roomType)` is the one named in the note's
   Messages table; here the student sees where it sits in a whole conversation. The
   twist versus the coffee-shop drill is the SELF-CALL: admissions validates the
   record itself before it commits a bed, so a self-message nests inside its own
   activation. Direction is given; the sole task is time order. */

export default sequenceOrder({
  prompt: "Order the messages that admit a patient. One of them is a self-call — an object messaging itself.",
  participants: [
    { id: "clerk", label: "Clerk", kind: "actor" },
    { id: "adm", label: "Admissions" },
    { id: "ward", label: "Ward" },
  ],
  messages: [
    { id: "admit", from: "clerk", to: "adm", label: "Admit(patientID, roomType)", kind: "sync",
      why: "The clerk starts the admission — this is the first call into the system." },
    { id: "validate", from: "adm", to: "adm", label: "validateInsurance(patientID)", kind: "sync", self: true,
      why: "A self-call: admissions checks the patient's own record before it commits a bed." },
    { id: "reserve", from: "adm", to: "ward", label: "reserveBed(roomType)", kind: "sync",
      why: "A bed is reserved only after the patient's details check out." },
    { id: "bed", from: "ward", to: "adm", label: "bedId", kind: "return",
      why: "The ward must return which bed before the clerk can be told." },
    { id: "confirm", from: "adm", to: "clerk", label: "confirmation(bedId)", kind: "return",
      why: "The clerk gets the final confirmation last, once a bed actually exists." },
  ],
  activations: [
    { p: "adm", from: 0, to: 4 },
    { p: "ward", from: 2, to: 3 },
    { p: "adm", from: 1, to: 1, dx: 4 }, // nested self-call bar
  ],
});
