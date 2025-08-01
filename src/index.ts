import { MicroserviceManager } from "./core/MicroserviceManager";

(async () => {
  await new MicroserviceManager().run();
})();
