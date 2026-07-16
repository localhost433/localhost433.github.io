/* AUTO-GENERATED from practice-02-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 02 practice — the pointer/reference model: which parameter mode can change
   the caller's variable, why &r == &x, that a pointer holds an ADDRESS not an int,
   and the manual heap-cleanup bugs (double free, dangling) C++ has and Java does not. */

export default mcq({
  questions: [{
    stem: "After these three calls, what is `a`? (each `inc` is overloaded by parameter mode)",
    figure: {
      code: "void inc(int x)  { x = x + 1; }   // by value\nvoid inc(int* x) { *x = *x + 1; } // by pointer\nvoid inc(int& x) { x = x + 1; }   // by reference\n\nint a = 5;\ninc(a);    // by value\ninc(&a);   // by pointer\ninc(a);    // by reference",
      lang: "cpp"
    },
    choices: [{
      text: "7 — by value leaves `a` at 5, then by pointer makes it 6, then by reference makes it 7",
      correct: true
    }, {
      text: "8 — all three calls increment `a`"
    }, {
      text: "5 — none of the calls can change `a`"
    }, {
      text: "6 — only the by-pointer call changes `a`"
    }],
    why: "**By value** copies the argument, so the first `inc(a)` changes only the copy — `a` stays 5. **By pointer** (`inc(&a)`) and **by reference** (`inc(a)`) both reach the caller's storage, so each adds one: 5 → 6 → 7. Reference just gives the cleaner syntax for the same effect."
  }, {
    stem: "Given `char x = 5; char* p = &x; char& r = x;`, which is true of the addresses?",
    figure: {
      code: "cout << &x;   // 0xFA\ncout << &r;   // ?\ncout << &p;   // ?",
      lang: "cpp"
    },
    choices: [{
      text: "`&r` equals `&x` (a reference is no new storage), but `&p` is a different address (the pointer is its own object)",
      correct: true
    }, {
      text: "`&r`, `&x`, and `&p` are all the same address"
    }, {
      text: "`&r` and `&p` are the same; `&x` differs"
    }, {
      text: "All three are different addresses"
    }],
    why: "A **reference introduces no new storage** — `r` *is* `x`, so `&r == &x`. A **pointer is a real object** that lives somewhere and holds an address, so `&p` is its own distinct cell (different from `&x`). That is the core difference: an alias vs. an object-that-holds-an-address."
  }, {
    stem: "Why is `p = 5;` below wrong?",
    figure: {
      code: "char x = 'A';\nchar* p;\np = 5;      // ?\np = &x;     // ?",
      lang: "cpp"
    },
    choices: [{
      text: "A pointer holds an **address**, not an integer; `5` is not an address, so only `p = &x` is valid",
      correct: true
    }, {
      text: "It is fine — `p` now points at address 5, which is legal"
    }, {
      text: "`5` is too small to be a pointer; a larger literal would work"
    }, {
      text: "`p = &x` is the wrong one — you cannot take the address of a local"
    }],
    why: "A pointer's value is a memory **address**. A bare integer literal like `5` is not an address, so `p = 5` is an error. You assign it with the address-of operator, `p = &x`. (The one integer a pointer accepts is `0` / `nullptr`, the null pointer.)"
  }, {
    stem: "In C++, what frees heap memory obtained with `new`?",
    choices: [{
      text: "You do, explicitly with `delete` / `delete[]` — there is no garbage collector",
      correct: true
    }, {
      text: "A garbage collector, as in Java"
    }, {
      text: "It is freed automatically when the enclosing function returns"
    }, {
      text: "The `new` operator schedules its own cleanup"
    }],
    why: "**Stack** variables are freed automatically when their function returns, but **heap** memory from `new` is not — C++ has **no garbage collector**. You must release it yourself: `delete p` for a single object, `delete[] arr` for an array. Forgetting to is a memory leak."
  }, {
    stem: "What does `delete p;` actually do to the pointer `p` and its target?",
    choices: [{
      text: "It marks the memory free to reuse but leaves `p`'s value unchanged — `p` is now a **dangling** pointer",
      correct: true
    }, {
      text: "It sets `p` to `nullptr` automatically"
    }, {
      text: "It zeroes both `p` and the memory it pointed to"
    }, {
      text: "It is a no-op unless `p` is the last pointer to that memory"
    }],
    why: "`delete` only tells the allocator the memory may be reused; it does **not** change `p`'s value or the bytes at the target. So `p` still holds the old address — it is now **dangling**. Reading it, or `delete`-ing it again (a **double free**), is undefined behavior. The fix: `p = nullptr;` right after the delete."
  }, {
    stem: "What is a **double free**, and what does the standard promise about it?",
    choices: [{
      text: "Calling `delete` twice on the same memory — undefined behavior; it may crash, corrupt the heap, or appear to work",
      correct: true
    }, {
      text: "Allocating twice without freeing — a guaranteed leak"
    }, {
      text: "A safe operation the runtime silently ignores the second time"
    }, {
      text: "Freeing memory that was never allocated — always a clean crash"
    }],
    why: "A **double free** is releasing the same block twice (often via two pointers to it, or a `delete` on a dangling pointer). It is **undefined behavior** — the standard guarantees nothing, so it might crash, silently corrupt the heap, or seem to work. Setting a pointer to `nullptr` after deleting prevents the second `delete` from doing harm (`delete nullptr` is a safe no-op)."
  }]
});