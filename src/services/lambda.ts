import { slackService } from './slack';
import { KnownBlock } from '@slack/types';

export async function sendErrorNotification(
  functionName: string,
  requestBody: string,
  errorMessage: string
) {
  return slackService.sendMessage({
    text: '',
    blocks: [
      {
        type: 'section',
        block_id: 'section1',
        fields: [
          {
            type: 'mrkdwn',
            text: `:warning: Backend serverless error notification\n*Function Name:* ${functionName}\n*Request Body:*\n${requestBody}\n*Error Details:*`,
          },
        ],
      },
      {
        type: 'rich_text',
        block_id: 'section3',
        elements: [
          {
            type: 'rich_text_list',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `Message: ${errorMessage}`,
                  },
                ],
              },
            ],
            style: 'bullet',
            indent: 0,
          },
          {
            type: 'rich_text_list',
            elements: [
              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'text',
                    text: `Time: ${new Date().toLocaleString()}`,
                  },
                ],
              },
            ],
            style: 'bullet',
            indent: 0,
          },
        ],
      },
    ] as KnownBlock[],
  });
}
