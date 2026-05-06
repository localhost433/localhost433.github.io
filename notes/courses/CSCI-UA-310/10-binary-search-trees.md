---
title: 10 - Binary Search Trees
date: 2026-02-23
---

## Roadmap

This lecture introduces **Binary Search Trees (BSTs)** as a data structure for dynamic ordered sets. We define the BST property, present the fundamental operations, and analyze their running time.

1. **BST Property**: Definition and representation.
2. **Traversal**: In-order, pre-order, post-order.
3. **Searching**: `SEARCH`, `MINIMUM`, `MAXIMUM`, `SUCCESSOR`, `PREDECESSOR`.
4. **Modification**: `INSERT` and `DELETE`.
5. **Analysis**: Running time and the problem of balance.

---

## 1. The BST Property

A **binary search tree** is a rooted binary tree where each node $x$ has fields: `key`, `left`, `right`, and `parent`.

**BST Property**: For any node $x$:

* If $y$ is in the **left subtree** of $x$: $y.\text{key} \leq x.\text{key}$.
* If $y$ is in the **right subtree** of $x$: $y.\text{key} \geq x.\text{key}$.

The **height** $h$ of a BST determines the cost of all operations. In the worst case $h = \Theta(n)$ (degenerate tree); for a balanced tree $h = \Theta(\log n)$.

---

## 2. Tree Traversal

**In-order traversal** visits nodes in sorted order.

```text
INORDER-TREE-WALK(x)
1. if x != NIL
2.     INORDER-TREE-WALK(x.left)
3.     print x.key
4.     INORDER-TREE-WALK(x.right)
```

Running time: $\Theta(n)$ for a tree with $n$ nodes.

Similarly, **pre-order** (root, left, right) and **post-order** (left, right, root) traversals are defined.

---

## 3. Searching

### SEARCH

```text
TREE-SEARCH(x, k)
1. if x == NIL or k == x.key
2.     return x
3. if k < x.key
4.     return TREE-SEARCH(x.left, k)
5. else return TREE-SEARCH(x.right, k)
```

Running time: $O(h)$.

### MINIMUM and MAXIMUM

```text
TREE-MINIMUM(x)
1. while x.left != NIL
2.     x = x.left
3. return x
```

```text
TREE-MAXIMUM(x)
1. while x.right != NIL
2.     x = x.right
3. return x
```

Both run in $O(h)$.

### SUCCESSOR

The **successor** of node $x$ is the node with the smallest key greater than $x.\text{key}$.

```text
TREE-SUCCESSOR(x)
1. if x.right != NIL
2.     return TREE-MINIMUM(x.right)
3. y = x.parent
4. while y != NIL and x == y.right
5.     x = y
6.     y = y.parent
7. return y
```

Running time: $O(h)$.

---

## 4. Modification

### INSERT

```text
TREE-INSERT(T, z)
1. y = NIL
2. x = T.root
3. while x != NIL
4.     y = x
5.     if z.key < x.key
6.         x = x.left
7.     else x = x.right
8. z.parent = y
9. if y == NIL
10.    T.root = z        // tree was empty
11. elif z.key < y.key
12.    y.left = z
13. else y.right = z
```

Running time: $O(h)$.

### DELETE

Three cases when deleting node $z$:

1. **$z$ has no children**: Simply remove $z$.
2. **$z$ has one child**: Splice out $z$, linking $z$'s parent to $z$'s child.
3. **$z$ has two children**: Find $z$'s successor $y$ (which has at most one child). Copy $y$'s key into $z$, then delete $y$ (falls into case 1 or 2).

We use a helper `TRANSPLANT` to replace one subtree with another:

```text
TRANSPLANT(T, u, v)
1. if u.parent == NIL
2.     T.root = v
3. elif u == u.parent.left
4.     u.parent.left = v
5. else u.parent.right = v
6. if v != NIL
7.     v.parent = u.parent
```

```text
TREE-DELETE(T, z)
1. if z.left == NIL
2.     TRANSPLANT(T, z, z.right)
3. elif z.right == NIL
4.     TRANSPLANT(T, z, z.left)
5. else y = TREE-MINIMUM(z.right)
6.     if y.parent != z
7.         TRANSPLANT(T, y, y.right)
8.         y.right = z.right
9.         y.right.parent = y
10.    TRANSPLANT(T, z, y)
11.    y.left = z.left
12.    y.left.parent = y
```

Running time: $O(h)$.

---

## 5. Analysis

All BST operations run in $O(h)$ time. The height $h$ depends on how balanced the tree is:

| Tree Shape | Height | Operation Cost |
|---|---|---|
| Balanced | $\Theta(\log n)$ | $\Theta(\log n)$ |
| Degenerate (sorted input) | $\Theta(n)$ | $\Theta(n)$ |
| Random insertions (expected) | $\Theta(\log n)$ | $\Theta(\log n)$ |

**Problem**: Without rebalancing, adversarial input order yields a degenerate tree. This motivates **Red-Black Trees**, which maintain balance explicitly.

---

## References

* **CLRS**: Chapter 12 — Binary Search Trees.
