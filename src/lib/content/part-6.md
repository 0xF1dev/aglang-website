# #6: Basic operators

Alright! **Let's learn operators!**

The first two we'll get into are the basic operators: these are the _Copy_ operator (that we've used many times before) and the _Remove_ operator.

## Copy

The Copy operator (`>`) requires two arguments and uses the following syntax:

```
[source]>[destination]
```

`[source]` needs to be **readable** and `[destination]` needs to be **writable**; if the two arguments don't follow these requirements, the compiler/interpreter will report it.

If the destination is the stack, the Copy operator pushes the value in the source to it; if the destination is a Stdout argument, it will print it value into the output.

## Remove

The Remove operator (`!`) requires one argument to the operator's left. It uses the following syntax:

```
[target]!
```

`[target]` needs to be **writable**, but Stdout arguments aren't supported. The Remove operator either _clears the target_ (in the case of a register) or _pops a value from the stack_ (if the target is the stack), but, unlike Assembly, doesn't pop that value _into_ another register.

---

In this objective's code, two values are pushed into the stack, but the one we want to print isn't at the top! Try to _pop_ the top value from the stack and print the second value (that now should be at the top) to the console.
