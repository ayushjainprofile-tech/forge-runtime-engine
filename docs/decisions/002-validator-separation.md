# ADR 002: Validator Separation & Plugin System

## Decision
The Validation Engine has been implemented using a Plugin Registry pattern. The core engine is agnostic to specific rules. Adding a new rule requires implementing the `ValidationRule` interface and registering it, requiring 0 core changes.

## Alternatives Considered
- Hardcoding validation checks directly into the engine's compilation loop (`if/else` checks).
- Using third-party schema validation exclusively (like Ajv or Zod) without custom business logic.

## Why Chosen
Extensibility is a core priority for the Forge Runtime Engine. The plugin system allows for complex, domain-specific rules (e.g. checking for circular component dependencies or impossible workflow states) without bloating the core.

## Tradeoffs
- Slightly more complex setup when defining simple rules, as they require registering an entire plugin interface instead of a simple inline check.
