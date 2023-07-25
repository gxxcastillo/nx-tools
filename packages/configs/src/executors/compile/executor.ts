import { writeFileSync } from 'node:fs';
import { ExecutorContext } from '@nx/devkit';
import * as nconf from 'nconf';
import { dump, load } from 'js-yaml';
import { camelCase } from 'change-case';

import { CompileExecutorSchema } from './schema';

const allowlistedEnvKeys = [];

export default async function runExecutor(
  options: CompileExecutorSchema,
  context: ExecutorContext
) {
  try {
    compileConfigs(options, context);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error(error)

    return {
      success: false
    };
  }
}

export async function compileConfigs({
    // NX does not provide a way to pass configs to dependent builds, as a result we use NODE_ENV to determine buildMode
    buildMode = process.env.NODE_ENV === 'production' ? 'production' : 'development',
    appName
  }: CompileExecutorSchema,
  {
    root,
    projectName,
    projectsConfigurations,
  }: ExecutorContext) {
  const sourceProjectPath = `${root}/${projectsConfigurations.projects[appName].root}`;
  const sourceConfigsPath = `${sourceProjectPath}/configs`;
  const destination =  `${root}/${projectsConfigurations.projects[projectName].root}/src/configs.json`;
  console.info(`Reading configs from ${sourceConfigsPath}`);

  nconf.env({
    transform({ key, value }) {
      if (allowlistedEnvKeys.includes(key)) {
        const isJsonString = value.trim().startsWith('{') && value.endsWith('}');
        if (isJsonString) {
          nconf.overrides(JSON.parse(value));
          return false;
        }

        const camelCaseKey = camelCase(key);
        return {
          key: camelCaseKey,
          value
        };
      }

      return false;
    }
  });

  const configs = [
    `${sourceConfigsPath}/base/${buildMode}-user.yaml`,
    `${sourceConfigsPath}/defaults-user.yaml`,
    `${sourceConfigsPath}/base/${buildMode}.yaml`,
    `${sourceConfigsPath}/defaults.yaml`
  ].reduce((current, configFile) => {
    if (!configFile) {
      return current;
    }

    return current.file(configFile, {
      file: configFile,
      format: {
        stringify: dump,
        parse: load
      }
    });
  }, nconf);

  const content = JSON.stringify(configs.get());
  console.info(`Writing ${buildMode} configs to ${destination}`);
  writeFileSync(destination, content);

  return { success: true };
};
