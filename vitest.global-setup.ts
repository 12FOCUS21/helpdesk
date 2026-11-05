import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const testDatabaseUrl = "file:./prisma/test.db";

export default function setup() {
  rmSync(resolve("prisma/test.db"), { force: true });

  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
  });
}
