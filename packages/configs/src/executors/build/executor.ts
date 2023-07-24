import { type ExecutorContext } from '@nx/devkit';
import { tscExecutor } from '@nx/js/src/executors/tsc/tsc.impl'
import { compileConfigs } from '../compile/executor';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {
  try {
    await compileConfigs(options, context);

    const projectRoot = context.projectsConfigurations.projects[options.appName].root;
    const outputPath = options.outputPath ? options.outputPath : `${projectRoot}/dist`;
    const tsConfig = options.tsConfig ? options.tsConfig : `${projectRoot}/tsconfig.json`;
    const main = `${projectRoot}/src/index.ts`
    const buildOptions = {
      main,
      assets: [],
      tsConfig,
      outputPath,
      transformers: [],
      watch: options?.watch ?? false,
    };
    return (await tscExecutor(buildOptions, context).next()).value;
  } catch (error) {
    return {
      success: false,
    };
  }
}



