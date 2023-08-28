import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';

class SlackService {
  private webhook: IncomingWebhook;
  private static instance: SlackService;

  private constructor() {
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL || '');
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): SlackService {
    if (!SlackService.instance) {
      SlackService.instance = new SlackService();
    }

    return SlackService.instance;
  }

  sendMessage(message: string | IncomingWebhookSendArguments) {
    return this.webhook.send(message);
  }
}

export const slackService = SlackService.getInstance();
