import { infixToPostfix } from "../src/infix-to-postfix";

describe("#infix-to-postfix", () => {
    test("should transfer infix to postfix", () => {
        expect(infixToPostfix("a")).toBe("a");
        expect(infixToPostfix("a·b")).toBe("ab·");
        expect(infixToPostfix("a·b·c")).toBe("ab·c·");

        expect(infixToPostfix("a*·b")).toBe("a*b·");
        expect(infixToPostfix("a*·b·c")).toBe("a*b·c·");
        expect(infixToPostfix("a·b*·c")).toBe("ab*·c·");

        expect(infixToPostfix("a?·b")).toBe("a?b·");
        expect(infixToPostfix("a?·b·c")).toBe("a?b·c·");
        expect(infixToPostfix("a·b?·c")).toBe("ab?·c·");

        expect(infixToPostfix("a+·b")).toBe("a+b·");
        expect(infixToPostfix("a+·b·c")).toBe("a+b·c·");
        expect(infixToPostfix("a·b+·c")).toBe("ab+·c·");

        expect(infixToPostfix("a*·(b?·(c))")).toBe("a*b?c··");
    });
});
