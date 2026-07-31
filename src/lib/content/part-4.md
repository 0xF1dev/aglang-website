# #4: Memory

Before getting deep into operators, let's first see how Aglang lets you store values.

---

The only data type in Aglang is the 8-bit unsigned integer: this means that numbers can go from 0 to 255; this might sound bad, but it's actually enough to do everything you'd like!

## The Stack

The stack in Aglang works exactly how you'd expect if you're familiar with lower-lever programming. It is a _Last-In-First-Out (LIFO)_ array of numbers: this means that inserting a value into it (with the Copy operator) puts it at the top, and that becomes the only usable value in the stack until it is _popped_ (with the Remove operator) and another one becomes the top.

This top value cannot be directly written, so arithmetic operations aren't possible on it.

I know this can be quite confusing, so this scheme should help you out:

![Visual stack representation](/stack.png)

We can see the number `10011010` get _pushed_ to the stack, and this puts it at the top of it. Now, by reading from the stack, it becomes the _only_ accessible value.

Then, that value gets _popped_, so now the only accessible value in the stack becomes the one below it (`11110001`).

Hope it now makes more sense! If you're still unsure at times, look at the memory inspector on the right: the top value of the stack (the one that will be used) is the one in bold text.

## Registers

As we've seen before, there are **two registers** in Aglang: register 0 and register 1 (R0 and R1 for short). These two can be considered what _variables_ are in other languages, and, just like variables, they're going to be the things you'll be using most in your code.

They can be both **read** and **written**, and this makes them the most versatile thing in Aglang: it means that you can use almost all operators with them!

---

If you're still confused about memory in Aglang, imagine it like this: the arguments can either be **readable**, **writable** or **both**. So, to sum everything up:
- **Registers**: read-write;
- **Stack**: readable, can be written by pushing values;
- **Literals**: readable;
- **Stdout**: writable.

Now that I've introduced the _Stdout_, we're going to go more in-depth in the next lesson.

**But first, your objective!**

You need to print the letter `W` in the terminal by reading a value from the _stack_ (`:>\;`), but a line is missing!

First, try to run the code to see what kind of error you get...

Or, if you want, there can be another solution too, by editing the already valid code!
