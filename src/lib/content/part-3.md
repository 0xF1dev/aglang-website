# #3: Operators

As of version v1.1.0, there are a total of **13 operators**, and we'll go through each category in the following lessons.

For now, look at this table from the [Aglang reference](https://github.com/0xF1dev/aglang/blob/main/docs/reference.md) and try to understand what they do on your own:

| Operator | Name           | Structure       | Description                                                                                                                          |
| :------: | -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
|   `>`    | Copy           | `[src]>[dest];` | Copies the value in `[src]` into `[dest]`.                                                                                           |
|   `!`    | Remove         | `[dest]!;`      | Either clears (if `[dest]` is a register) or pops (if `[dest]` is the stack) a value.                                                |
|    \|    | Input          | \|;             | Pushes `0` to the stack (to act as a delimiter), gets an input from the StdIn, reverses it and pushes each character into the stack. |
|   `+`    | Sum            | `[dest]+[src];` | Sums the two arguments and puts the result in `[dest]`. If the sum is greater than 255, the result wraps to 0.                       |
|   `-`    | Subtraction    | `[dest]-[src];` | Subtracts the two arguments and puts the result in `[dest]`. If the result is less than 0, it wraps to 255.                          |
|   `*`    | Multiplication | `[dest]*[src];` | Multiplies the two arguments and puts the result in `[dest]`. If the result is greater than 255, the result wraps to 0.              |
|   `/`    | Division       | `[dest]/[src];` | Divides the `[dest]` argument by `[src]` and puts the quotient in `[dest]`.                                                          |
|   `%`    | Remainder      | `[dest]%[src];` | Divides `[dest]` by `[src]` and puts the remainder of the operation in `[dest]`.                                                     |
|   `~`    | Label          | `~[label]`      | Used to declare a label. A label can only be named using **dots** (e.g. ".", "..")                                                   |
|   `?`    | Compare        | `[src]?[dest]`  | Compares `[src]` to `[dest]`. Can either result in `Greater`, `Less` or `Equal`                                                      |
|   `^`    | Greater        | `^[label]`      | Needs to be preceded by a `Compare` statement. If the result of the comparison is `Greater`, the program will jump to `[label]`.     |
|   `<`    | Less           | `<[label]`      | Needs to be preceded by a `Compare` statement. If the result of the comparison is `Less`, the program will jump to `[label]`.        |
|   `=`    | Equal          | `=[label]`      | Needs to be preceded by a `Compare` statement. If the result of the comparison is `Equal`, the program will jump to `[label]`.       |

_(the input operators aren't in a code block because markdown parsing won't work correctly)_

---

Now, try predicting what the output of the code in the editor will be!
