export interface BuildExecutorSchema {
  appName: string;
  buildMode: 'production' | 'development'; 
  outputPath: string;
  tsConfig: string;
  watch: boolean;
}
