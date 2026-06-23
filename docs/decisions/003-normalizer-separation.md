# ADR 003: Normalizer Separation & Confidence System

## Decision
The Normalizer exists as a discrete pipeline stage separate from the Validator. It reads diagnostics/auto-fixes provided by the Validator and transforms unsafe ASTs into safe ones. It also attaches a confidence score (`SAFE` or `BEST_GUESS`) to every fix.

## Alternatives Considered
- Mutating the AST directly inside the Validator.
- Rejecting configs outright upon validation failure without any autofixing.

## Why Chosen
The application must never crash because of invalid configuration. The Normalizer ensures fault tolerance by applying sensible defaults (e.g., generating missing IDs or falling back unknown components). The confidence system guarantees transparency to the developer.

## Tradeoffs
- In some edge cases, a `BEST_GUESS` fix may obscure a deeper architectural problem in the user's config, though the UI surfaces these prominently to mitigate this.
