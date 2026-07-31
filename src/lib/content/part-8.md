# #8: Loops

Loops allow you to repeat sections of code.

They can be started with the `[` token and end with the `]` token, and they will repeat until the top value in the stack is `0`: that's why, when using the _Input_ operator, a `0` gets pushed to the stack!

Let's look at an example:
```
1010>:;

[
    :>';
    :!;
    '>\#;
    '-1;
    '>:;
]
```
this code puts a `10` in the stack, then in the loop it does the following:
1. Copies the value in the stack into _register 0_ and pops it from the stack;
2. Prints the numeric value of _register 0_;
3. Subtracts `1` from register 0;
4. Pushes the value of register 0 into the stack.

So, at one point, at the end of the loop the top value in the stack is going to be `0`, making the loop end!

---

Remember that "mirror" program that printed back the first character the user inputs? Try to rewrite it with loops so that it prints back the whole input!
