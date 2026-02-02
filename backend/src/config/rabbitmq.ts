import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    
    await channel.assertQueue('auth_logs', { durable: true });
    await channel.assertQueue('email_notifications', { durable: true });
    
    console.log('✅ RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
};

export const publishToQueue = async (queue: string, data: any) => {
  if (channel) {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
  }
};

export { channel };
