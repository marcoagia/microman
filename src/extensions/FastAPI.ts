import * as fs from "fs-extra";
import { exec } from "child_process";
import { join } from "path";
import { MicroserviceExtension } from "../types/MicroserviceExtension";

export class FastAPIExtension implements MicroserviceExtension {
  label = "Python + FastAPI";
  tech = "python:fastapi";

  async generateScaffold(msPath: string) {
    const py_exec = process.platform === "win32" ? "python" : "python3";
    await this.run(`${py_exec} -m venv .venv`, msPath);

    await fs.ensureDir(join(msPath, "app"));
    await fs.writeFile(
      join(msPath, "app", "main.py"),
      `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Hello from Python FastAPI microservice!"}
`,
    );

    await fs.writeFile(
      join(msPath, "requirements.txt"),
      `fastapi\nuvicorn[standard]\n`,
    );
    await this.writeDockerfile(msPath, "Dockerfile", false);
    await this.writeDockerfile(msPath, "Dockerfile.dev", true);
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

  private async writeDockerfile(msPath: string, name: string, isDev: boolean) {
    const host = isDev ? "0.0.0.0" : ":";
    await fs.writeFile(
      join(msPath, name),
      `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "${host}", "--port", "8000"]
`,
    );
  }
}
