import { channel } from '../config/rabbitmq.js';
import { sendEmail } from '../services/email.js';

export const startEmailConsumer = async () => {
  if (!channel) return;

  await channel.consume('email_notifications', async (msg) => {
    if (msg) {
      const { to, subject, template, data } = JSON.parse(msg.content.toString());
      await sendEmail({ to, subject, html: generateEmailHTML(template, data) });
      channel.ack(msg);
    }
  });

  console.log('✅ Email consumer started');
};

const generateEmailHTML = (template: string, data: any) => {
  const templates: Record<string, (d: any) => string> = {
    admin_created: (d) => `
      <h2>Welcome ${d.name}!</h2>
      <p>Your admin account has been created.</p>
      <p>Email: ${d.email}</p>
      <p>Password: ${d.password}</p>
      <p>Please set up your password and 2FA.</p>
    `
  };

  return templates[template]?.(data) || '<p>Notification</p>';
};
