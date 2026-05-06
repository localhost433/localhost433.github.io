---
title: 11 - Red-Black Trees
date: 2026-02-25
---

## Roadmap

**Red-Black Trees** are a self-balancing variant of BSTs that guarantee $O(\log n)$ height. This lecture covers the structural invariants, rotations, and insertion.

1. **Red-Black Properties**: The five invariants.
2. **Height Guarantee**: Why the properties ensure $O(\log n)$ height.
3. **Rotations**: The primitive restructuring operation.
4. **Insertion**: Inserting and restoring the invariants.
5. **Deletion** (overview).

---

## 1. Red-Black Properties

A **red-black tree** is a BST where each node has one extra bit: a **color** (RED or BLACK). It satisfies the following five properties:

1. Every node is either RED or BLACK.
2. The root is BLACK.
3. Every leaf (`NIL`) is BLACK.
4. If a node is RED, both its children are BLACK. *(No two consecutive red nodes.)*
5. For each node $x$, all simple paths from $x$ to descendant leaves contain the same number of BLACK nodes.

The **black-height** $\text{bh}(x)$ of a node $x$ is the number of black nodes on any simple path from $x$ (not including $x$) to a descendant leaf.

---

## 2. Height Guarantee

**Lemma**: A red-black tree with $n$ internal nodes has height at most $2\lg(n+1)$.

**Proof sketch**:

* By Property 5, the subtree rooted at any node $x$ contains at least $2^{\text{bh}(x)} - 1$ internal nodes.
* By Property 4, at least half the nodes on any root-to-leaf path are black, so $\text{bh}(\text{root}) \geq h/2$.
* Therefore $n \geq 2^{h/2} - 1$, giving $h \leq 2\lg(n+1)$.

**Consequence**: All BST operations (SEARCH, MINIMUM, MAXIMUM, SUCCESSOR, PREDECESSOR) run in $O(\log n)$ worst-case time.

---

## 3. Rotations

**Rotations** are local restructuring operations that preserve the BST property and run in $O(1)$ time.

### Left Rotation on node $x$

```text
LEFT-ROTATE(T, x)
1. y = x.right           // y is x's right child
2. x.right = y.left      // move y's left subtree to x's right
3. if y.left != T.nil
4.     y.left.parent = x
5. y.parent = x.parent   // link x's parent to y
6. if x.parent == T.nil
7.     T.root = y
8. elif x == x.parent.left
9.     x.parent.left = y
10. else x.parent.right = y
11. y.left = x            // put x on y's left
12. x.parent = y
```

`RIGHT-ROTATE` is symmetric. Both run in $O(1)$.

---

## 4. Insertion

Insertion proceeds in two phases:

1. Insert node $z$ as in a standard BST, color it **RED**.
2. Call `RB-INSERT-FIXUP(T, z)` to restore the red-black properties.

The only property potentially violated is **Property 2** (root is black) or **Property 4** (red parent has red child).

```text
RB-INSERT(T, z)
1. ... (standard BST insert, set z.color = RED)
2. RB-INSERT-FIXUP(T, z)
```

### Fixup Cases

Let $z$ be the newly inserted red node, $z.\text{parent}$ be red (violation of Property 4), and $y$ be $z$'s **uncle** (sibling of $z$'s parent).

**Case 1: Uncle $y$ is RED.**

* Recolor: $z.\text{parent}$ and $y$ become BLACK; $z.\text{grandparent}$ becomes RED.
* Move $z$ up to grandparent and continue.

**Case 2: Uncle $y$ is BLACK, $z$ is a right child.**

* Left-rotate on $z$'s parent to convert to Case 3.

**Case 3: Uncle $y$ is BLACK, $z$ is a left child.**

* Recolor $z$'s parent BLACK and $z$'s grandparent RED.
* Right-rotate on $z$'s grandparent. Done.

```text
RB-INSERT-FIXUP(T, z)
1. while z.parent.color == RED
2.     if z.parent == z.parent.parent.left
3.         y = z.parent.parent.right   // uncle
4.         if y.color == RED           // Case 1
5.             z.parent.color = BLACK
6.             y.color = BLACK
7.             z.parent.parent.color = RED
8.             z = z.parent.parent
9.         else
10.            if z == z.parent.right  // Case 2
11.                z = z.parent
12.                LEFT-ROTATE(T, z)
13.            z.parent.color = BLACK  // Case 3
14.            z.parent.parent.color = RED
15.            RIGHT-ROTATE(T, z.parent.parent)
16.    else (symmetric, with left and right swapped)
17. T.root.color = BLACK
```

Running time: $O(\log n)$ — the fixup traverses up at most $O(\log n)$ levels, and only Case 1 moves the pointer upward.

---

## 5. Deletion (Overview)

Deletion is similar in structure: remove the node with standard BST deletion, then call a fixup procedure. The fixup handles four cases (symmetric to insertion) and runs in $O(\log n)$ time.

The key insight is that a "double-black" violation is introduced when a black node is removed, and the fixup redistributes blackness through rotations and recolorings.

---

## Summary

| Operation             | Time        |
|-----------------------|-------------|
| SEARCH                | $O(\log n)$ |
| INSERT                | $O(\log n)$ |
| DELETE                | $O(\log n)$ |
| MINIMUM/MAXIMUM       | $O(\log n)$ |
| SUCCESSOR/PREDECESSOR | $O(\log n)$ |

---

## References

* **CLRS**: Chapter 13 — Red-Black Trees.
