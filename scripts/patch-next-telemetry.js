const fs = require("node:fs");
const path = require("node:path");

const patchFile = path.join(
  __dirname,
  "..",
  "node_modules",
  "next",
  "dist",
  "telemetry",
  "project-id.js"
);

if (!fs.existsSync(patchFile)) {
  process.exit(0);
}

const source = fs.readFileSync(patchFile, "utf-8");
const content = `"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRawProjectId", {
    enumerable: true,
    get: function() {
        return getRawProjectId;
    }
});
async function getRawProjectId() {
    return process.env.REPOSITORY_URL || process.cwd();
}
`;

fs.writeFileSync(patchFile, content);
