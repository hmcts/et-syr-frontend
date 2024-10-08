import * as path from 'path';

import { Pact } from '@pact-foundation/pact';

export interface IPactTestSetupConfig {
  provider: string;
  port: number;
}

export class PactTestSetup {
  provider: Pact;
  port: number;

  constructor(config: IPactTestSetupConfig) {
    this.provider = new Pact({
      port: this.port,
      log: path.resolve(process.cwd(), 'src/test/api/pact/pacts/logs', 'mockserver-integration.log'),
      dir: path.resolve(process.cwd(), 'src/test/api/pact/pacts'),
      spec: 2,
      consumer: 'et-syr',
      provider: config.provider,
      pactfileWriteMode: 'merge',
    });
  }
}
