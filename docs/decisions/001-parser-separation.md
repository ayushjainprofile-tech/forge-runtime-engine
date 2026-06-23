# ADR 001: Parser Separation

## Decision
We have decided to decouple the JSON Parser from the Validator and Normalizer, making it a standalone step that builds a strictly-typed Abstract Syntax Tree (AST) before any business rules are applied.

## Alternatives Considered
- Direct JSON parsing and validation using Zod schemas simultaneously.
- Passing raw JSON directly to the Validator engine.

## Why Chosen
Decoupling creates a safe boundary between external, untrusted input and internal engine representations. A strict AST layer guarantees that downstream engines (Validator, Normalizer, Optimizer) do not have to account for fundamentally broken object structures or malformed properties.

## Tradeoffs
- Slightly increased memory usage since we allocate an intermediate AST before runtime execution.
- Added boilerplate to map raw JSON objects to AST nodes.
