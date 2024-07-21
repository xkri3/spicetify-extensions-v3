// V 0.1.1

import type { Module } from "/hooks/index.ts";

export function load(mod: Module) {
  return import("./mod.js").then(m => m.default(mod));
}