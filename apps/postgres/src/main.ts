import { exec } from 'child_process';

/**
 * For `turbo dev` use, spin up a postgres instance accessible from host machine
 */
exec('docker-compose up');
