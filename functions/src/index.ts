import * as functions from "firebase-functions";
import { conversation } from "@assistant/conversation";
import fetch from "node-fetch";

const config = functions.config();
const HABITICA_BASE_URL = "https://habitica.com/api/v3/tasks/user";

const app = conversation();

app.handle("CreateHabiticaTodo", async (conv) => {
  const taskTextArr = conv.request.intent?.query?.split(" ");

  if ((taskTextArr?.length || 0) < 6) {
    functions.logger.info(`Bad Speech: ${conv.request.intent?.query}`);
    conv.add("Malformed speech.");
    return;
  }

  const taskText = taskTextArr?.slice(6).join(" ");

  const content = {
    text: taskText,
    type: "todo",
  };

  const response2 = await fetch(HABITICA_BASE_URL, {
    method: "POST",
    body: JSON.stringify(content),
    headers: {
      "Content-Type": "application/json",
      "x-api-user": config.habitica.userid,
      "x-api-key": config.habitica.apitoken,
      "x-client": functions.config.name,
    },
  });

  functions.logger.info(`Called Habitica: ${response2.ok}`);
  functions.logger.info(`Called Habitica: ${await response2.json()}`);

  if (!response2.ok) {
    conv.add("Habitica failed to respond.");
    return;
  }

  functions.logger.info(`Got Request2: ${JSON.stringify(conv.request)}`);
  conv.add(`Created task called, ${taskText}, in Habitica.`);
});

exports.fulfillment = functions.https.onRequest(app);
