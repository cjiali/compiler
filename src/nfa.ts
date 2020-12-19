export const CONCATENATION_OPERATOR = "·";
export const UNION_OPERATOR = "|";
export const CLOSURE_OPERATOR = "*";
export const ZERO_OR_ONE_OPERATOR = "?";
export const ONE_OR_MORE_OPERATOR = "+";
export const GROUP_LEFT_OPERATOR = "(";
export const GROUP_RIGHT_OPERATOR = ")";

export class State {
    static unique = 0;
    identity: number;
    isEnd: boolean;
    transition: { [key: string]: State };
    epsilonTransition: State[];

    constructor(isEnd: boolean = false) {
        this.identity = State.unique++;
        this.isEnd = isEnd;
        this.transition = {};
        this.epsilonTransition = [];
    }

    addTransition(token: string, to: State): State {
        this.transition[token] = to;
        return this;
    }

    addEpsilonTransition(to: State): State {
        this.epsilonTransition.push(to);
        return this;
    }
}

export class NFA {
    static basic(token: string | undefined) {
        const startState = new State();
        const endState = new State(true);
        if (token) {
            startState.addTransition(token, endState);
        } else {
            startState.addEpsilonTransition(endState);
        }

        return new NFA(startState, endState);
    }

    static union(s: NFA, t: NFA): NFA {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(s.startState).addEpsilonTransition(t.startState);
        s.endState.addEpsilonTransition(newEndState).isEnd = false;
        t.endState.addEpsilonTransition(newEndState).isEnd = false;

        return new NFA(newStartState, newEndState);
    }

    static concat(aNFA: NFA, bNFA: NFA): NFA {
        const newStartState = aNFA.startState;
        const newEndState = bNFA.endState;

        aNFA.endState.addEpsilonTransition(bNFA.startState).isEnd = false;

        return new NFA(newStartState, newEndState);
    }

    static closure(nfa: NFA) {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(nfa.startState).addEpsilonTransition(newEndState);
        nfa.endState.addEpsilonTransition(nfa.startState).addEpsilonTransition(newEndState).isEnd = false;

        return new NFA(newStartState, newEndState);
    }

    static zeroOrOne(nfa: NFA) {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(nfa.startState).addEpsilonTransition(newEndState);
        nfa.endState.addEpsilonTransition(newEndState).isEnd = false;

        return new NFA(newStartState, newEndState);
    }

    static oneOrMore(nfa: NFA) {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(nfa.startState);
        nfa.endState.addEpsilonTransition(nfa.startState).addEpsilonTransition(newEndState).isEnd = false;

        return new NFA(newStartState, newEndState);
    }

    startState: State;
    endState: State;

    constructor(startState: State, endState: State) {
        this.startState = startState;
        this.endState = endState;
    }

    getEpsilonClosure(state: State): Array<State> {
        let visited: Set<State> = new Set([state]);
        // bfs
        let curr;
        let queue: Array<State> = [state];
        while ((curr = queue.shift())) {
            curr.epsilonTransition.forEach((item) => {
                if (!visited.has(item)) {
                    queue.push(item);
                    visited.add(item);
                }
            });
        }
        return Array.from(visited);
    }
}
/**
 * 由后缀表达式构建 NFA 就容易多了，从左到右读入表达式内容：
 * - 如果为 `|`，弹出栈内两个元素 `N(t)`、`N(s)`，构建 `N(r)` 将其入栈（`r = s|t`）
 * - 如果为 `·`，弹出栈内两个元素 `N(t)`、`N(s)`，构建 `N(r)` 将其入栈（`r = st`）
 * - 如果为 `*`，弹出栈内一个元素 `N(s)`，构建 `N(r)` 将其入栈（`r = s*`）
 * - 如果为 `?`，弹出栈内一个元素 `N(s)`，构建 `N(r)` 将其入栈（`r = s?`）
 * - 如果为 `+`，弹出栈内一个元素 `N(s)`，构建 `N(r)` 将其入栈（`r = s+`）
 * - 如果为字母 s，构建基本 NFA `N(s)`，并将其入栈
 */
export const buildRegexpToNFA = (regexp: string) => {
    const stack: Array<NFA> = [];

    let r, s, t;
    for (let i = 0, token; (token = regexp[i]); i++) {
        switch (token) {
            case "|":
                if (!(t = stack.pop()) || !(s = stack.pop())) {
                    throw new Error("There are mismatched with `|`!");
                }
                r = NFA.union(s, t);
                break;
            case `·`:
                if (!(t = stack.pop()) || !(s = stack.pop())) {
                    throw new Error("There are mismatched with `·`!");
                }
                r = NFA.concat(s, t);
                break;
            case "*":
                if (!(s = stack.pop())) {
                    throw new Error("There are mismatched with `*`!");
                }
                r = NFA.closure(s);
                break;
            case "?":
                if (!(s = stack.pop())) {
                    throw new Error("There are mismatched with `?`!");
                }
                r = NFA.zeroOrOne(s);
                break;
            case "+":
                if (!(s = stack.pop())) {
                    throw new Error("There are mismatched with `+`!");
                }
                r = NFA.oneOrMore(s);
            default:
                r = NFA.basic(token);
        }
        stack.push(r);
    }

    return stack.pop();
};

export const isMatchOf = (exp: string, nfa: NFA) => {
    const startState = nfa.startState;
    let currentStates = nfa.getEpsilonClosure(startState);

    for (let i = 0, token: string; (token = exp[i]); i++) {
        let nextStates: Array<State> = [];

        currentStates.forEach((state) => {
            if (state.transition[token]) {
                nextStates = nextStates.concat(
                    nfa.getEpsilonClosure(state.transition[token]).filter((item) => !nextStates.includes(item)),
                );
            }
        });

        currentStates = nextStates;
    }

    let queue = [nfa.startState];
    let curr;
    while ((curr = queue.shift())) {}

    return currentStates.some((state) => state.isEnd);
};
