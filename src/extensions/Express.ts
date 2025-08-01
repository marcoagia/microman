import * as fs from "fs-extra";
import { MicroserviceExtension } from "../types/MicroserviceExtension";
import { join } from "path";
import { exec } from "child_process";

export class ExpressExtension implements MicroserviceExtension {
  label = "Node.js + Express";
  tech = "nodejs:express";

  async generateScaffold(msPath: string) {
    await fs.ensureDir(join(msPath, "src"));
    await this.run("npm init -y", msPath);
    await this.run("npm install express", msPath);

    await fs.writeFile(
      join(msPath, "src", "index.js"),
      `const express = require("express");
const app = express();
const PORT = 8000;
app.get("/", (req, res) => res.send("Hello from Node.js Express microservice!"));
app.listen(PORT, () => console.log(\`Listening on \${PORT}\`));
`,
    );

    await this.writeDockerfile(msPath, "Dockerfile");
    await this.writeDockerfile(msPath, "Dockerfile.dev");
    await fs.writeFile(join(msPath, ".env"), `PORT=\n`);
  }

  private async run(cmd: string, cwd: string) {
    return new Promise<void>((resolve, reject) => {
      exec(cmd, { cwd }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  private async writeDockerfile(msPath: string, name: string) {
    await fs.writeFile(
      join(msPath, name),
      `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src
EXPOSE 8000
CMD ["node", "src/index.js"]
`,
    );
  }
}
