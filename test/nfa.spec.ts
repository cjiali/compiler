import { State, NFA, buildRegexpToNFA, isMatchOf } from "../src/nfa";

describe("#automata", () => {
    describe("state", () => {
        test("should initialize as expect", () => {
            const startState = new State();
            expect(startState.isEnd).toEqual(false);
            expect(startState.transition).toEqual({});
            expect(startState.epsilonTransition).toEqual([]);

            const endState = new State(true);
            expect(endState.isEnd).toEqual(true);
            expect(endState.transition).toEqual({});
            expect(endState.epsilonTransition).toEqual([]);
        });

        test("should support invocation chaining", () => {
            const stateA = new State();
            const stateB = new State();
            const stateC = new State();
            const stateD = new State();
            stateA.addTransition("a", stateB).addEpsilonTransition(stateC).addTransition("b", stateD);

            const { transition, epsilonTransition } = stateA;
            expect(transition).toEqual({
                a: stateB,
                b: stateD,
            });
            expect(epsilonTransition).toEqual([stateC]);
        });
    });

    describe("NFA", () => {
        test("should return closure as expect", () => {
            const p1 = new State();
            const p2 = new State();
            const p3 = new State();
            const p4 = new State(true);
            p1.addEpsilonTransition(p2);
            p2.addEpsilonTransition(p3);
            p3.addEpsilonTransition(p1).addTransition("a", p4);

            const nfa = new NFA(p1, p4);
            expect(nfa.getEpsilonClosure(p1)).toEqual([p1, p2, p3]);
        });
    });

    // describe("buildRegexpToNFA", () => {
    //     test("should build string to NFA as expect", () => {
    //         const NFA1 = buildRegexpToNFA("ab|");
    //         expect(NFA1.startState.epsilonTransition[0].transition.a.epsilonTransition[0]).toEqual(new State(true));
    //         expect(NFA1.startState.epsilonTransition[1].transition.b.epsilonTransition[0]).toEqual(new State(true));

    //         const NFA2 = buildRegexpToNFA("ab·");
    //         expect(NFA2.startState.transition.a.epsilonTransition[0].transition.b).toEqual(new State(true));

    //         const NFA3 = buildRegexpToNFA("a*");
    //         expect(NFA3.startState.epsilonTransition[1]).toEqual(new State(true));
    //         expect(NFA3.startState.epsilonTransition[0].transition.a.epsilonTransition[1]).toEqual(new State(true));
    //         expect(
    //             NFA3.startState.epsilonTransition[0].transition.a.epsilonTransition[0].transition.a
    //                 .epsilonTransition[1],
    //         ).toEqual(new State(true));
    //     });

    //     test("should basic works well", () => {
    //         const basicNFAWithSymbol = NFA.basic("a");
    //         const basicNFAWithEpsilon = NFA.basic(undefined);

    //         expect(basicNFAWithSymbol.startState.transition.a).toEqual(basicNFAWithSymbol.endState);
    //         expect(basicNFAWithEpsilon.startState.epsilonTransition[0]).toEqual(basicNFAWithEpsilon.endState);
    //     });

    //     test("should union works well", () => {
    //         const NFA1 = NFA.basic("a");
    //         const NFA2 = NFA.basic("b");
    //         const unionNFA = NFA.union(NFA1, NFA2);

    //         expect(unionNFA.startState.epsilonTransition.length).toBe(2);
    //         expect(unionNFA.startState.epsilonTransition[0].transition.a.epsilonTransition[0]).toEqual(
    //             unionNFA.endState,
    //         );
    //         expect(unionNFA.startState.epsilonTransition[1].transition.b.epsilonTransition[0]).toEqual(
    //             unionNFA.endState,
    //         );
    //     });

    //     test("should concat works well", () => {
    //         const NFA1 = NFA.basic("a");
    //         const NFA2 = NFA.basic("b");
    //         const concatNFA = NFA.concat(NFA1, NFA2);

    //         expect(concatNFA.startState).toEqual(NFA1.startState);
    //         expect(concatNFA.endState).toEqual(NFA2.endState);
    //         expect(concatNFA.startState.transition.a.epsilonTransition[0].transition.b).toEqual(concatNFA.endState);
    //     });

    //     test("should closure works well", () => {
    //         const NFA1 = NFA.basic("a");
    //         const closureNFA = NFA.closure(NFA1);

    //         expect(closureNFA.startState.epsilonTransition[1]).toEqual(closureNFA.endState);
    //         expect(closureNFA.startState.epsilonTransition[0].transition.a.epsilonTransition[1]).toEqual(
    //             closureNFA.endState,
    //         );
    //         expect(
    //             closureNFA.startState.epsilonTransition[0].transition.a.epsilonTransition[0].transition.a
    //                 .epsilonTransition[1],
    //         ).toEqual(closureNFA.endState);
    //     });

    //     test("should zeroOrOne works well", () => {
    //         const NFA1 = NFA.basic("a");
    //         const closureNFA = NFA.zeroOrOne(NFA1);

    //         expect(closureNFA.startState.epsilonTransition[1]).toEqual(closureNFA.endState);
    //         expect(closureNFA.startState.epsilonTransition[0].transition.a.epsilonTransition.length).toBe(1);
    //         expect(closureNFA.startState.epsilonTransition[0].transition.a.epsilonTransition[0]).toEqual(
    //             closureNFA.endState,
    //         );
    //     });

    //     test("should oneOrMore works well", () => {
    //         const NFA1 = NFA.basic("a");
    //         const closureNFA = NFA.oneOrMore(NFA1);

    //         expect(closureNFA.startState.epsilonTransition.length).toBe(1);
    //         expect(closureNFA.startState.epsilonTransition[0].transition.a.epsilonTransition[1]).toEqual(
    //             closureNFA.endState,
    //         );
    //         expect(
    //             closureNFA.startState.epsilonTransition[0].transition.a.epsilonTransition[0].transition.a
    //                 .epsilonTransition[1],
    //         ).toBe(closureNFA.endState);
    //     });
    // });

    // describe("isMatchOf", () => {
    //     test("should return match result as expect", () => {
    //         const q0 = new State();
    //         const q1 = new State();
    //         const q2 = new State();
    //         const q3 = new State();
    //         const q4 = new State();
    //         const q5 = new State();
    //         const q6 = new State();
    //         const q7 = new State();
    //         const q8 = new State(true);
    //         q0.addEpsilonTransition(q7);
    //         q0.addEpsilonTransition(q1);
    //         q1.addEpsilonTransition(q2);
    //         q1.addEpsilonTransition(q4);
    //         q2.addTransition("a", q3);
    //         q3.addEpsilonTransition(q6);
    //         q4.addTransition("b", q5);
    //         q5.addEpsilonTransition(q6);
    //         q6.addEpsilonTransition(q1);
    //         q6.addEpsilonTransition(q7);
    //         q7.addTransition("c", q8);

    //         const nfa = new NFA(q0, q8);
    //         expect(isMatchOf("aaabc", nfa)).toBe(true);
    //         expect(isMatchOf("c", nfa)).toBe(true);
    //         expect(isMatchOf("bac", nfa)).toBe(true);
    //         expect(isMatchOf("d", nfa)).toBe(false);
    //     });
    // });
});
