import { createApp } from './app';
import { config } from './config';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    const app = await createApp();

    await app.listen({
      port: config.port,
      host: config.host,
    });

    app.log.info(`Server Started on ${config.host}:${config.port}`);
    app.log.info(`Environment: ${config.nodeEnv}`);
  } catch (err) {
    console.error('Error Starting Server:', err);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
}); 