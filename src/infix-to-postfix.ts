export const CONCATENATION_OPERATOR = "·";
export const UNION_OPERATOR = "|";
export const CLOSURE_OPERATOR = "*";
export const ZERO_OR_ONE_OPERATOR = "?";
export const ONE_OR_MORE_OPERATOR = "+";
export const GROUP_LEFT_OPERATOR = "(";
export const GROUP_RIGHT_OPERATOR = ")";


// Reference: https://en.wikipedia.org/wiki/Shunting-yard_algorithm
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

const operatorPriorityMap: { [key: string]: number } = {
    "|": 1,
    "·": 2,
    "*": 3,
    "?": 3,
    "+": 3,
};
export const infixToPostfix = (regexp: string): string => {
    let output = [];
    const stack: string[] = [];

    // while there are tokens to be read
    for (let i = 0, token; (token = regexp[i]); i++) {
        // if the token is a left parenthesis (i.e. "(")
        if (token === "(") {
            // push it onto the operator stack
            stack.push(token);
        }
        // if the token is a right parenthesis (i.e. ")")
        else if (token === ")") {
            // while the operator at the top of the operator stack is not a left parenthesis,
            //      pop the operator from the operator stack onto the output queue.
            let top;
            while ((top = stack.pop()) && top !== "(") {
                output.push(top);
            }
            // if the stack runs out without finding a left parenthesis, then there are mismatched parentheses
            if (!top) throw Error("There are mismatched parentheses!");
            // if there is a left parenthesis at the top of the operator stack, pop the operator from the operator stack and discard it
            // stack.pop();
        }
        // if the token is an operator
        else if (token === "|" || token === "·" || token === "*" || token === "?" || token === "+") {
            // while ((there is an operator at the top of the operator stack)
            //   and ((the operator at the top of the operator stack has greater precedence)
            //       or (the operator at the top of the operator stack has equal precedence and the token is left associative))
            //   and (the operator at the top of the operator stack is not a left parenthesis))
            let priority;
            while (
                (priority = operatorPriorityMap[stack[stack.length - 1]]) &&
                priority >= operatorPriorityMap[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
        // if the token is not a operator or parentheses
        else {
            output.push(token);
        }
    }
    // After while loop, if operator stack not null, pop everything to output queue
    while (stack.length) {
        output.push(stack.pop());
    }

    return output.join("");
};
