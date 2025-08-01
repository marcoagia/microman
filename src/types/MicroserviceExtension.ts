export interface MicroserviceExtension {
  label: string;
  tech: string;
  generateScaffold(msPath: string): Promise<void>;
}
