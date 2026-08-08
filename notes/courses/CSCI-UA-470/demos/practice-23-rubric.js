/* AUTO-GENERATED from practice-23-rubric.jsx by `npm run build:artifacts` — do not edit. */
import { matchBuild } from "@course";

/* note 23 practice — L22's review rubric, used the way the deck says to use it. Six
   units that a model returned, six rubric lines, each used exactly once.

   The framing matters and is not decoration: every snippet here COMPILES, PASSES ITS
   TESTS, and does what was asked. That is what makes the rubric worth having — the
   failure mode of generated code is not "wrong", it is "structurally expensive", and
   nothing in your toolchain reports that. You do.

   The palette is the slide's own six lines, including the last one (Patterns), which
   is the only rubric item that is about the READER rather than the code. */

export default matchBuild({
  prompt: "Six units a model returned. Every one compiles, passes its tests, and does what was asked — so the only thing left to judge is structure. Stamp the rubric line each one fails; each is used exactly once.",
  options: [{
    value: "S",
    label: "S — Single Responsibility"
  }, {
    value: "O",
    label: "O — Open–Closed"
  }, {
    value: "L",
    label: "L — Liskov Substitution"
  }, {
    value: "I",
    label: "I — Interface Segregation"
  }, {
    value: "D",
    label: "D — Dependency Inversion"
  }, {
    value: "P",
    label: "Patterns — is the intent obvious?"
  }],
  items: [{
    code: "// prompt: \"write a UserService that registers users\"\nclass UserService {\n    void register(User u) {\n        validateEmail(u);  hashPassword(u);\n        db.insert(u);      mailer.sendWelcome(u);\n        audit.append(\"registered \" + u.id);\n    }   // 90 lines, all green\n}",
    answer: "S",
    why: "Rubric line one: *does this unit have exactly one reason to change?* Five, here — a validation rule, a hash algorithm, a schema, an email template, an audit format. The tests passing says nothing about it; the bill arrives the first time one of the five moves and you have to re-read all ninety lines to find out whether you broke the other four."
  }, {
    code: "// prompt: \"add a third payment provider\"\nvoid processPayment(Order o) {\n    switch (o.provider) {\n        case STRIPE: ...\n        case PAYPAL: ...\n        case ADYEN:  ...   // <- the model added this\n    }\n}",
    answer: "O",
    why: "*Can I add the next feature without editing this code?* No — and notice the model did exactly what it was told. It optimises for the current prompt, not for the shape of the system, so it extends the switch rather than replacing it. Naming Strategy in the prompt is what would have produced a `PaymentProvider` interface and a fourth *class* instead of a fourth *branch*."
  }, {
    code: "class CachedRepository extends Repository {\n    @Override void save(Entity e) {\n        cache.put(e.id, e);      // and nothing else —\n    }                            // the DB write waits for flush()\n}\n// every existing caller of Repository.save() is unchanged",
    answer: "L",
    why: "*Would any subtype behave as its interface promises?* It compiles, it is a `Repository`, and it quietly breaks every caller that assumed `save()` persisted. LSP is a **semantic** contract, which is exactly why neither the compiler nor the model catches it — nothing in the type signature was violated, only the meaning."
  }, {
    code: "interface Storage { read(); write(); lock(); unlock(); }\n\nclass S3Storage implements Storage {\n    public void read()  { /* works */ }\n    public void write() { /* works */ }\n    public void lock()   { throw new UnsupportedOperationException(); }\n    public void unlock() { throw new UnsupportedOperationException(); }\n}",
    answer: "I",
    why: "*Does it depend on interfaces it fully uses — nothing fatter?* The thrown stub is the smell, the same one note 16's empty `jump() { }` was. The model will happily satisfy any contract you hand it, including one this class cannot honour — so the fix is upstream, in the interface you specified, not in the class it generated."
  }, {
    code: "class ReportBuilder {\n    private PostgresConnection db;\n\n    ReportBuilder() {\n        db = new PostgresConnection(System.getenv(\"DB_URL\"));\n    }\n}",
    answer: "D",
    why: "*Does it depend on abstractions I control, not concrete details?* A high-level policy naming a low-level detail — and the practical tell is that you cannot test `ReportBuilder` without a live database. Specify a `ReportStore` interface and inject it, and the same model produces something you can mock, swap, or regenerate behind a fixed contract."
  }, {
    code: "// prompt: \"retry the request up to three times\"\nRunnable retry = new Runnable() {\n    int n = 0;\n    public void run() {\n        try { call(); }\n        catch (E e) { if (++n < 3) run(); else throw e; }\n    }\n};   // 40 lines. It works.",
    answer: "P",
    why: "The rubric's last line, and the only one that is about the **reader** rather than the code: *is the intent obvious — a named pattern, not a clever tangle?* Nothing here is technically wrong, which is the trap. Generation is nearly free and review is not, so the scarce resource is attention — and code whose shape you can name in one word costs a reviewer seconds instead of minutes."
  }]
});