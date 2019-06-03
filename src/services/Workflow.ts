import { LambdaFunction } from 'lamool/src/lambda';
import { Lamool } from 'lamool/src/lamool';
import { Woolf } from 'woolf/src/woolf';

const fib: LambdaFunction<{ num: number }, number> = (event, _, cb) => {
  const fibFunc = n => (n <= 1 ? n : fibFunc(n - 1) + fibFunc(n - 2));
  cb(null, fibFunc(event.num));
};

const sleep: LambdaFunction<{ ms: number }, number> = (event, _, cb) => {
  setTimeout(() => cb(null, event.ms), event.ms);
};

export class Workflow {
  private lamool = new Lamool();
  private woolf = new Woolf(this.lamool);
  public async addFibonacciJob(num: number) {
    const job = this.woolf.newJob();
    await job.addFunc(fib, {
      Parameters: { num }
    });
  }

  public async addSleepJob(ms: number) {
    const job = this.woolf.newJob();
    await job.addFunc(sleep, {
      Parameters: { ms }
    });
  }

  public async run() {
    return await this.woolf.run({});
  }
}
