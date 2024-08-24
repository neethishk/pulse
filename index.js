const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const axios = require('axios');  // Ensure axios is installed

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Slack Integration API',
    version: '1.0.0',
    description: 'API for sending Slack notifications, modals, and other integrations',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local server',
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./index.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Use swagger-ui-express for your app
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Basic route
app.get('/', (req, res) => {
  res.send('Slack Integration API is running');
});

// API endpoint to send a Slack notification
/**
 * @swagger
 * /send-slack-notification:
 *   post:
 *     summary: Send a Slack notification
 *     description: Sends a notification with a structured message to a specified Slack channel.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel:
 *                 type: string
 *                 description: Slack channel ID
 *                 example: U07C2GQCSFR
 *               blocks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: Type of the block
 *                       example: header
 *                     text:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           description: Type of text
 *                           example: plain_text
 *                         text:
 *                           type: string
 *                           description: The actual text
 *                           example: Your tasks for the day
 *                     elements:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             description: Text content
 *                             example: "*November 12, 2019*"
 *                           type:
 *                             type: string
 *                             description: Type of the element
 *                             example: mrkdwn
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       500:
 *         description: Internal server error
 */
app.post('/send-slack-notification', async (req, res) => {
  const { channel, blocks } = req.body;
console.log(req,"neethish")
  try {
    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel,
      blocks,
    }, {
      headers: {
        'Authorization': `Bearer xoxb-7179306522818-7600593957137-GfbzBQ3jBSlUHkD6LAtYnrAd`,
        'Content-Type': 'application/json',
      }
    });

    if (response.data.ok) {
      res.status(200).json({ status: 'Notification sent successfully' });
    } else {
      res.status(500).json({ status: 'Failed to send notification', error: response.data.error });
    }
  } catch (error) {
    res.status(500).json({ status: 'Internal server error', error: error.message });
  }
});

// API endpoint to send a Slack modal
/**
 * @swagger
 * /send-slack-modal:
 *   post:
 *     summary: Send a Slack modal
 *     description: Sends a modal with form inputs to a specified Slack channel.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel:
 *                 type: string
 *                 description: Slack channel ID
 *                 example: U07C2GQCSFR
 *               blocks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: Type of the block
 *                       example: header
 *                     text:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           description: Type of text
 *                           example: plain_text
 *                         text:
 *                           type: string
 *                           description: The actual text
 *                           example: New Notes
 *     responses:
 *       200:
 *         description: Modal sent successfully
 *       500:
 *         description: Internal server error
 */
app.post('/send-slack-modal', async (req, res) => {
  const { channel, blocks } = req.body;

  try {
    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel,
      blocks,
    }, {
      headers: {
        'Authorization': `Bearer xoxb-7179306522818-7600593957137-GfbzBQ3jBSlUHkD6LAtYnrAd`,
        'Content-Type': 'application/json',
      }
    });

    if (response.data.ok) {
      res.status(200).json({ status: 'Modal sent successfully' });
    } else {
      res.status(500).json({ status: 'Failed to send modal', error: response.data.error });
    }
  } catch (error) {
    res.status(500).json({ status: 'Internal server error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
