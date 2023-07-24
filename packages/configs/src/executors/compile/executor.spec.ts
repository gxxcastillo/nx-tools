import { CompileExecutorSchema } from './schema';
import executor from './executor';

const options: CompileExecutorSchema = {};

describe('Compile Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
