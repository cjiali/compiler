/************************************************************************************
NFA with ε-moves: 
For an NFA with ε-moves (also called an ε-NFA), the construction must be modified 
    to deal with these by computing the ε-closure of states: 
    the set of all states reachable from some given state using only ε-moves. 

The Subset Construction: NFA --> DFA

The algorithm begins with an initial set, q0, that contains n0 and any states
in the NFA that can be reached from n0 along paths that contain only epsilon-transitions.

q0 <- epsilon-closure(n0);
Q <- q0;
WorkList <- {q0};
while (WorkList != ∅ ) do
    remove q from WorkList;
    for each character c do
        t <- epsilon-closure(Delta(q, c));
        T[q, c] <- t;
        if t not in Q then
            add t to Q and to WorkList;
************************************************************************************/
