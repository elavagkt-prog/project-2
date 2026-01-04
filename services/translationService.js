const { TranslationServiceClient } = require("@google-cloud/translate");

const client = new TranslationServiceClient({
  keyFilename: null, // we will use API key directly
});

const PROJECT_ID = "gov-scheme-ai";
const LOCATION = "global";
const API_KEY = "AIzaSyCMUY52vatDgIv3LhZ8V56QfljKBKy41yY";

exports.translateToEnglish = async (text) => {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: "en",
      }),
    }
  );

  const data = await response.json();
  return data.data.translations[0].translatedText;
};
