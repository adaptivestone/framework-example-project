import Cli from '@adaptivestone/framework/Cli.js';
import folderConfig from './folderConfig.ts';

const cli = new Cli(folderConfig);

const result = await cli.run();
process.exit(result ? 0 : 1);
