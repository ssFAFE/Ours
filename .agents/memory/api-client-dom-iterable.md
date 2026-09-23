---
name: Generated API client DOM iterable support
description: TypeScript lib settings needed by Orval's generated fetch helpers in this workspace.
---

The generated React API client uses `Headers.entries()`, so its TypeScript `lib` must include both `dom` and `dom.iterable`.

**Why:** The generated code can be valid at runtime while the workspace typecheck fails if iterable DOM types are omitted.

**How to apply:** Keep `dom.iterable` alongside `dom` in the API client package compiler options when regenerating hooks.