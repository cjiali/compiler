export const insertConcatOperator = (regexp: string): string => {
    let output = [];

    let i = 0,
        curr,
        next;
    while ((curr = regexp[i++])) {
        output.push(curr);

        // Should not insert dots after `(` and `|`.
        if (curr === "(" || curr === "|") {
            continue;
        }

        next = regexp[i];
        // Should not insert dots before `*`, `?`, `+`, `)` and `|`.
        if (next === "*" || next === "?" || next === "+" || next === ")" || next === "|") {
            continue;
        }
        // Should not insert dots after the last char.
        next && output.push("·");
    }

    return output.join("");
};
