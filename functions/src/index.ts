import * as functions from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
const config = functions.config();
const HABITICA_BASE_URL = "https://habitica.com/api/v3/tasks/user";

export const helloWorld = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs! ", { structuredData: true });

  const content = {
    text: "request",
    type: "todo"
  }

  const response2 = await fetch(HABITICA_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(content),
    headers: {
      'Content-Type': 'application/json',
      'x-api-user': config.habitica.userid,
      'x-api-key': config.habitica.apitoken,
      'x-client': functions.config.name
    }
  });


  response.send(`Hello from Firebase! ${config.habitica.userid} blarg. ${response2.ok} ${JSON.stringify(await response2.json())}`);
});
