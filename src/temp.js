const operatorPriority = {
    "*": 4,
    "?": 4,
    "+": 4,
    ".": 3,
    "|": 2,
    "(": 1,
};

// use: https://en.wikipedia.org/wiki/Shunting-yard_algorithm
/*******************************************************************************************************************************
// This implementation does not implement composite functions,functions with variable number of arguments, and unary operators. 

while there are tokens to be read:
read a token.
if the token is a number, then:
    push it to the output queue.
else if the token is a function then:
    push it onto the operator stack 
else if the token is an operator then:
    while ((there is an operator at the top of the operator stack)
          and ((the operator at the top of the operator stack has greater precedence)
              or (the operator at the top of the operator stack has equal precedence and the token is left associative))
          and (the operator at the top of the operator stack is not a left parenthesis)):
        pop operators from the operator stack onto the output queue.
    push it onto the operator stack.
else if the token is a left parenthesis (i.e. "("), then:
    push it onto the operator stack.
else if the token is a right parenthesis (i.e. ")"), then:
    while the operator at the top of the operator stack is not a left parenthesis:
        pop the operator from the operator stack onto the output queue.
    // If the stack runs out without finding a left parenthesis, then there are mismatched parentheses. 
    if there is a left parenthesis at the top of the operator stack, then:
        pop the operator from the operator stack and discard it
// After while loop, if operator stack not null, pop everything to output queue 
if there are no more tokens to read then:
while there are still operator tokens on the stack:
    // If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses. 
    pop the operator from the operator stack onto the output queue.
exit.
*******************************************************************************************************************************/
function regex2post(str) {
    const output = [];
    const operatorStack = [];

    for (let char, i = 0, isLastChar = false, l = str.length; i < l; i++) {
        // while there are tokens to be read
        char = str[i]; // read a token

        if (char === "*" || char === "?" || char === "+") {
            // if the token is an operator
            pushOperator(char);
            isLastChar = true; // !
            continue;
        }

        if (char === "|") {
            pushOperator(char);
            isLastChar = false;
            continue;
        }

        if (char === "(") {
            if (isLastChar) {
                // !
                pushOperator(".");
            }
            operatorStack.push(char);
            isLastChar = false;
            continue;
        }

        if (char === ")") {
            let op;
            while ((op = operatorStack.pop())) {
                if (op === "(") {
                    break;
                }
                output.push(op);
            }
            if (op !== "(") {
                throw new Error(`no "(" match ")" at [${i}] of "${str}"`);
            }
            isLastChar = true;
            continue;
        }

        // normal char
        if (isLastChar) {
            pushOperator(".");
        }
        output.push(char);
        isLastChar = true;
    }

    function pushOperator(op) {
        let top;
        const priority = operatorPriority[op];
        // (there is an operator at the top of the operator stack)
        // and ((the operator at the top of the operator stack has greater precedence)
        // or (the operator at the top of the operator stack has equal precedence and the token is left associative))
        // and (the operator at the top of the operator stack is not a left parenthesis)
        while (
            (top = operatorStack[operatorStack.length - 1]) &&
            operatorPriority[top] >= priority
        ) {
            output.push(operatorStack.pop()); // pop operators from the operator stack onto the output queue
        }
        operatorStack.push(op);
    }

    // there are no more tokens to read
    let op;
    while ((op = operatorStack.pop())) {
        // while there are still operator tokens on the stack
        if (op === "(") {
            throw new Error(`not matched "(" of "${str}"`);
        }
        output.push(op);
    }

    return output.join("");
}

module.exports = regex2post;
