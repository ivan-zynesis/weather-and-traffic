import {orchestratePsqlContainer} from "./PostgresContainer";
import { exec } from 'child_process';

exec('docker-compose up');

// process.stdin.resume();
//
// orchestratePsqlContainer().then(container => {
//   process.on('exit', () => container.stop());
//   process.on('SIGINT', () => container.stop());
// }).catch(e => console.error(`Failed to spin up postgres container ${e}`));


