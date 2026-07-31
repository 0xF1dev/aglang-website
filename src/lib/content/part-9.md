# #9: Labels and comparisons

Labels are essentially a _more flexible_ version of loops.

In short, **labels** define **points in code**, and by using **comparisons**, you can _jump_ to that point to repeat a part of the code.

Let's see how these features are implemented in Aglang!

## Labels

Labels are defined with the _Label_ operator (`~`) -- not to be confused with the Label _argument_ -- and they can only be named with **dots**. So, for example, this line:
```
~..;
```
defines a label named `..` that points at that statement.

## Comparisons

In Aglang, comparisons are composed of **two statements**: one _compares two values_, and the other _checks the result_ and jumps to a label.

The first statement is written with the _Compare_ operator (`?`), and it compares the first argument to the second, and it can result either in `Greater` (if the first argument is greater than the second), `Less` (if the first argument is smaller) or `Equal` (if the two have the same value). As you can imagine, the two arguments need to be **readable**.

So, for example:
```
01001?101;
```
this line compares the number `9` to the number `5`, and since that 9 is greater than 5, it will result in `Greater`.

> Note:
> a comparison is valid for the _next line only_.

Then, the second argument can either be a _Greater_ (`^`), _Less_ (`<`) or _Equal_ (`=`) operator, and it needs a _Label argument_ to its right to perform a jump.

Therefore, by adding one of those to the previous example:
```
01001?101;
^..;
```
we can jump to the label `..` we defined above.

---

And now, for this objective, rewrite the example in the last lesson that prints numbers from 1 up to 10 using labels.

> Hint:
> you have to check if the current number is less than 11.

> Hint 2:
> the ASCII code for the newline is `1010`, remember to print it after each number.
