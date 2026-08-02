import { mcq } from "@course";

/* note 02 practice — the pointer/reference model: which parameter mode can change
   the caller's variable, why &r == &x, that a pointer holds an ADDRESS not an int,
   and the manual heap-cleanup bugs (double free, dangling) C++ has and Java does not. */

export default mcq({
  questions: [
    {
      stem: "After these three calls, what is `a`? (one `inc` per parameter mode)",
      figure: { code: "void inc_val(int x)  { x = x + 1; }   // by value\nvoid inc_ptr(int* x) { *x = *x + 1; } // by pointer\nvoid inc_ref(int& x) { x = x + 1; }   // by reference\n\nint a = 5;\ninc_val(a);    // by value\ninc_ptr(&a);   // by pointer\ninc_ref(a);    // by reference", lang: "cpp" },
      choices: [
        { text: "7 — by value unchanged; pointer and reference each add one", correct: true },
        { text: "8 — all three modes reach and modify the caller's storage" },
        { text: "5 — none of the calls can modify `a`" },
        { text: "6 — only pointer reaches `a`; reference copies like by value" },
      ],
      why: "**By value** copies the argument, so `inc_val(a)` changes only the copy — `a` stays 5. **By pointer** (`inc_ptr(&a)`) and **by reference** (`inc_ref(a)`) both reach the caller's storage, so each adds one: 5 → 6 → 7. Reference just gives the cleaner syntax for the same effect.",
    },
    {
      stem: "Given `int x = 5; int* p = &x; int& r = x;`, which is true of the addresses?",
      figure: { code: "cout << &x;   // 0xFA\ncout << &r;   // ?\ncout << &p;   // ?", lang: "cpp" },
      choices: [
        { text: "`&r` equals `&x`; `&p` is different (pointer has its own storage)", correct: true },
        { text: "`&r`, `&x`, and `&p` are all the same address" },
        { text: "`&r` and `&p` are the same; `&x` differs" },
        { text: "All three are different addresses with separate storage" },
      ],
      why: "A **reference introduces no new storage** — `r` *is* `x`, so `&r == &x`. A **pointer is a real object** that lives somewhere and holds an address, so `&p` is its own distinct cell (different from `&x`). That is the core difference: an alias vs. an object-that-holds-an-address.",
    },
    {
      stem: "Why is `p = 5;` below wrong?",
      figure: { code: "char x = 'A';\nchar* p;\np = 5;      // ?\np = &x;     // ?", lang: "cpp" },
      choices: [
        { text: "Pointers hold addresses, not integers; use `&x` instead", correct: true },
        { text: "It is fine — `p` now points at address 5" },
        { text: "`5` is too small; a larger literal would work" },
        { text: "`p = &x` is wrong — cannot take address of a local" },
      ],
      why: "A pointer's value is a memory **address**. A bare integer literal like `5` is not an address, so `p = 5` is an error. You assign it with the address-of operator, `p = &x`. (The one integer a pointer accepts is `0` / `nullptr`, the null pointer.)",
    },
    {
      stem: "In C++, what frees heap memory obtained with `new`?",
      choices: [
        { text: "You do, explicitly with `delete` or `delete[]`", correct: true },
        { text: "A garbage collector like in Java" },
        { text: "Automatically when the function ends" },
        { text: "The `new` operator schedules cleanup automatically" },
      ],
      why: "**Stack** variables are freed automatically when their function returns, but **heap** memory from `new` is not — C++ has **no garbage collector**. You must release it yourself: `delete p` for a single object, `delete[] arr` for an array. Forgetting to is a memory leak.",
    },
    {
      stem: "What does `delete p;` actually do to the pointer `p` and its target?",
      choices: [
        { text: "Frees the memory but leaves `p` unchanged — now a dangling pointer", correct: true },
        { text: "Sets `p` to `nullptr` automatically" },
        { text: "Zeroes both `p` and the memory" },
        { text: "No-op unless `p` is the last pointer to that memory" },
      ],
      why: "`delete` only tells the allocator the memory may be reused; it does **not** change `p`'s value, and it typically leaves the target's bytes as-is — but they are formally indeterminate, so never read them. `p` still holds the old address — it is now **dangling**. Reading it, or `delete`-ing it again (a **double free**), is undefined behavior. The fix: `p = nullptr;` right after the delete.",
    },
    {
      stem: "What is a **double free**, and what does the standard promise about it?",
      choices: [
        { text: "Calling `delete` twice on the same memory — undefined behavior", correct: true },
        { text: "Allocating twice without freeing — standard guarantees a leak" },
        { text: "A safe no-op when the runtime ignores the second call" },
        { text: "Freeing unallocated memory — guarantees a clean crash" },
      ],
      why: "A **double free** is releasing the same block twice (often via two pointers to it, or a `delete` on a dangling pointer). It is **undefined behavior** — the standard guarantees nothing, so it might crash, silently corrupt the heap, or seem to work. Setting a pointer to `nullptr` after deleting prevents the second `delete` from doing harm (`delete nullptr` is a safe no-op).",
    },
  ],
});
