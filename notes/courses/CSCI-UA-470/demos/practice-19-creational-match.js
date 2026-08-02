/* AUTO-GENERATED from practice-19-creational-match.jsx by `npm run build:artifacts` — do not edit. */
import { matchBuild } from "@course";

/* note 19 practice — pick the creational pattern. Only three labels, so the drill
   cannot be "recognise the name"; it has to be "tell the neighbours apart". The
   pairs built to confuse: #2 vs #5 (one hierarchy vs several related families) and
   #4 vs #1 (a class with a static accessor is not automatically a Singleton — the
   question is whether a SECOND instance is possible). Labels are reused, not
   consumed. One-shot: Check locks the board, Reset to retry. */

export default matchBuild({
  prompt: "Six designs. Stamp the creational pattern each one is reaching for — labels are reused, so count carefully rather than eliminating.",
  paletteLabel: "Patterns",
  slotLabel: "is a",
  slotPlaceholder: "pattern",
  options: [{
    value: "singleton",
    label: "Singleton"
  }, {
    value: "factory",
    label: "Factory"
  }, {
    value: "abstract",
    label: "Abstract Factory"
  }],
  items: [{
    text: "A `Logger` whose constructor is private, with a `static getLogger()` that creates the object on the first call and returns that same object on every call after.",
    answer: "singleton",
    why: "Private constructor + static accessor + a stored reference reused forever. The tell is not the static method on its own — it is that a **second** object cannot be made: the constructor is the only way in, and it is closed."
  }, {
    text: "`ParserFactory.get(fileExtension)` returns a `Parser`. The caller's variable is declared `Parser`; whether it holds a `JsonParser`, `XmlParser`, or `CsvParser` is decided inside the factory from the extension it was handed.",
    answer: "factory",
    why: "**One** product hierarchy (`Parser`), one door, and the concrete class chosen at runtime from an argument. That is Factory. It would only be Abstract Factory if there were several *related* hierarchies each with their own matching door."
  }, {
    text: "A cross-platform toolkit ships `WinWidgets` and `MacWidgets`. Each offers `makeButton()`, `makeMenu()`, and `makeScrollbar()`, returning the abstract `Button`, `Menu`, and `Scrollbar` — and the app picks one toolkit at startup, then never names a concrete widget again.",
    answer: "abstract",
    why: "Several **related** product hierarchies (Button, Menu, Scrollbar) produced as a matched set, with one door per family. Picking `MacWidgets` commits you to a whole consistent family — which is exactly what \"a family of related objects\" means."
  }, {
    text: "`MathUtils` has a private constructor and only `static` methods — `sqrt`, `abs`, `round`. There is no instance field and nothing ever calls `new MathUtils()`.",
    answer: "singleton",
    why: "The closest of the three, and it is the trap: this is a *static utility class*, not really the pattern — there is **no instance at all**, so there is nothing for the pattern to guarantee one of. Of the three labels offered it is the Singleton family (private constructor, class-level access), but the exam-usable distinction is that a Singleton **hands you an object**; a utility class never does."
  }, {
    text: "A game has `MedievalFactory` and `SciFiFactory`. Each returns a `Weapon`, an `Enemy`, and a `Vehicle` from its own theme, so a sword never turns up beside a laser rifle.",
    answer: "abstract",
    why: "Three product hierarchies (`Weapon`, `Enemy`, `Vehicle`) kept **consistent** by choosing one factory. \"They must match each other\" is the signature of Abstract Factory; Factory alone has no way to express that constraint."
  }, {
    text: "`ShapeFactory.getRandomShape()` returns a `Shape` the caller did not choose. The caller draws it without ever asking which one it is.",
    answer: "factory",
    why: "Still one hierarchy and one door — the fact that the *factory* picks at random rather than from a criteria argument changes nothing. Both `getShape(type)` and `getRandomShape()` are the slide's own two Factory methods."
  }]
});