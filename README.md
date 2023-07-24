# Gabriel's NX Tools

A set tools for NX workspaces.

## Setup

```
npm install @gxxc/nx-tools
```

## @gxxc/nx-configs

Use this package to generate environment specific configs for your nx workspace.

It contains the following executors:

- `@gxxc/nx-configs:build` - Internally, this calls the compile executor, then builds the results.
- `@gxxc/nx-configs:compile` - Compiles the configs for the specified environment.

