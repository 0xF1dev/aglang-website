# #5: Input/Output

## Output

In Aglang, output (as you previously saw) is handled by **moving the character** you want to print into the `\\` or `\\#` arguments with the _Copy_ operator.

The `\\` (Stdout) argument prints a value as its ASCII value (so moving _65_ into it prints `A`), while the `\\#` (Stdout as number) argument prints it as its numeric value (that same _65_ gets printed as `65`).

To know what code corresponds to a certain character, refer to an [ASCII code table](https://en.wikipedia.org/wiki/ASCII#Table_of_codes).

## Input

Input, instead, is obtained with the _Input_ operator: this requires no arguments, so it is written as `|;`.

It first pushes a `0` into the stack to act as a delimiter, then reverses the user input and pushes it so that the first character in the input is at the top of the stack.

If this feels confusing, this scheme shows how the stack will look after the user inputs `Hello`:

![Visual representation of the stack after user input](/input.png)

---

Now, for this lesson's objective, write a program that takes the user's input and prints back the first character they've written (don't worry, we'll get to printing the entire input back soon!). This will be the first program you'll try to write from scratch, so good luck!

To complete the objective, input `a` so that another `a` gets printed.
