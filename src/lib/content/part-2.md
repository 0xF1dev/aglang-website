# #2: Code structure

In Aglang, each instruction is called **statement**. Statements are composed of at most _two arguments_, one on the left of the _statement operator_ and one at its right. Most statements require two arguments, some one and some none!

Arguments can be of one of these types:
- **Binary literal**: composed of zeroes and ones, they represent a numeric value;
- **Register**: one of the two available 8-bit registers in Aglang (`'` for register 0 and `''` for register 1);
- **Stack**: an array of 8-bit values;
- **Stdout**: the console output, `\\` for normal ASCII representation and `\\#` for printing the numeric value;
- **Label**: a point in code.

We'll go more in depth into some of these in future lessons, but for now, just keep the in mind.

And lastly, we have **loops**: in short, they repeat sections of code until, at the end, the top value in the _stack_ is `0`.

> **Side note:**
> Anything wrapped in two dollar signs `$ like this $` is considered a **comment**: these will be ignored.

---

The objective in this lesson consists in printing a character into the _Stdout_, and for this, you'll use the **Copy** (`>`) operator.

It will be marked as completed when you successfully print the character `A` (ASCII number 65) to the output.

To do it, pass the character's binary value `01000001` (corresponds to 65) as the left argument of the Copy operator by replacing the comment.
