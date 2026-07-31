# #7: Arithmetic operators

Aglang supports all necessary arithmetic operators (those being `+`, `-`, `*`, `/` and `%`), and I don't think I have to explain what these do, _right?_

**But,** there are some things I should specify:
1. The result of the operation is saved into the **first argument**, so it needs to be writable;
2. If an operation overflows the 8-bit unsigned integer limit (so over 255 or under 0), the result **wraps**.

---

This was really short, since I hope you already know how math works, but anyways, time for the objective!

Try to write an operation with a result of `10` -- if you want, write it in different operations! -- and print it into the console.
