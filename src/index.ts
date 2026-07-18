import { runCluster } from '@adaptivestone/framework/cluster.js';

await runCluster(async () => {
  // Keep server construction inside the worker. The primary process only
  // supervises workers and forwards shutdown signals.
  await import('./server.ts');
});
