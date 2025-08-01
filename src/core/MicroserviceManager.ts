import * as fs from "fs-extra";
import * as path from "path";
import prompts from "prompts";
import YAML from "yaml";

import { ExpressExtension } from "../extensions/Express";
import { FastAPIExtension } from "../extensions/FastAPI";
import { MicroserviceExtension } from "../types/MicroserviceExtension";

const EXTENSIONS: MicroserviceExtension[] = [
  new ExpressExtension(),
  new FastAPIExtension(),
];

export class MicroserviceManager {
  private microservicesDir = "microservices";
  private dockerComposeFile = "docker-compose.yml";

  private slugify(name: string): string {
    return name
      .trim()
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  }

  public async run() {
    const args = process.argv.slice(2);
    if (!(args[0] === "new")) {
      console.error("Usage: microman new");
      process.exit(1);
    }

    const { name } = await prompts({
      type: "text",
      name: "name",
      message: "Enter microservice name:",
    });
    if (!name) process.exit(1);

    const slug = this.slugify(name);
    const msPath = path.join(this.microservicesDir, slug);

    if (await fs.pathExists(msPath)) {
      console.error(`Microservice ${slug} already exists!`);
      process.exit(1);
    }

    const { techChoice } = await prompts({
      type: "select",
      name: "techChoice",
      message: "Select technology:",
      choices: EXTENSIONS.map((ext, idx) => ({
        title: ext.label,
        value: idx,
      })),
    });

    if (techChoice === undefined) process.exit(1);
    const extension = EXTENSIONS[techChoice];

    await fs.ensureDir(msPath);
    await extension.generateScaffold(msPath);

    await this.updateDockerCompose(slug, msPath);

    console.log(`Microservice "${slug}" created successfully!`);
  }

  private async updateDockerCompose(serviceName: string, msPath: string) {
    // If docker-compose.yml does not exist, create a minimal one
    if (!(await fs.pathExists(this.dockerComposeFile))) {
      const initialCompose = {
        version: "3.8",
        services: {},
      };
      await fs.writeFile(this.dockerComposeFile, YAML.stringify(initialCompose));
      console.log("Created new docker-compose.yml at project root.");
    }
    const dcContent = await fs.readFile(this.dockerComposeFile, "utf-8");
    const dc = YAML.parse(dcContent) || {};
    if (!dc.services) {
      dc.services = {};
    }

    dc.services[serviceName] = {
      build: {
        context: msPath,
        dockerfile: "Dockerfile.dev",
      },
      env_file: [path.join(msPath, ".env")],
    };

    const newDcContent = YAML.stringify(dc);
    await fs.writeFile(this.dockerComposeFile, newDcContent);
    console.log(`Added ${serviceName} to docker-compose.yml.`);
  }
}
