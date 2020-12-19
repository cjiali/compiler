import { insertConcatOperator } from "../src/insert-concat-operator";


describe("#insertConcatOperator", () => {
    test("should insert dots between word", () => {
        expect(insertConcatOperator("a")).toBe("a");
        expect(insertConcatOperator("ab")).toBe("a·b");
        expect(insertConcatOperator("abc")).toBe("a·b·c");
    });

    test("should insert dots between * and word", () => {
        expect(insertConcatOperator("a*b")).toBe("a*·b");
        expect(insertConcatOperator("a*bc")).toBe("a*·b·c");
        expect(insertConcatOperator("ab*c")).toBe("a·b*·c");
    });

    test("should insert dots between ? and word", () => {
        expect(insertConcatOperator("a?b")).toBe("a?·b");
        expect(insertConcatOperator("a?bc")).toBe("a?·b·c");
        expect(insertConcatOperator("ab?c")).toBe("a·b?·c");
    });

    test("should insert dots between + and word", () => {
        expect(insertConcatOperator("a+b")).toBe("a+·b");
        expect(insertConcatOperator("a+bc")).toBe("a+·b·c");
        expect(insertConcatOperator("ab+c")).toBe("a·b+·c");
    });

    test("should insert dots between * and (", () => {
        expect(insertConcatOperator("a*(b*(c))")).toBe("a*·(b*·(c))");
    });

    test("should insert dots between + and (", () => {
        expect(insertConcatOperator("a+(b*(c))")).toBe("a+·(b*·(c))");
    });

    test("should insert dots between ? and (", () => {
        expect(insertConcatOperator("a?(b*(c))")).toBe("a?·(b*·(c))");
    });

    test("should insert dots between ) and word", () => {
        expect(insertConcatOperator("(ce)df")).toBe("(c·e)·d·f");
    });
});
