import { channel } from '../config/rabbitmq.js';
import { LoginActivity } from '../models/LoginActivity.js';

export const startAuthLogConsumer = async () => {
  if (!channel) return;

  await channel.consume('auth_logs', async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      await LoginActivity.insertOne(data);
      channel.ack(msg);
    }
  });

  console.log('✅ Auth log consumer started');
};
