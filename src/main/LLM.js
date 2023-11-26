import { OpenAI } from "openai";
// import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";

const api_config = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  temperature: 0.9,
}

const langchain_api_config = {
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  temperature: 0.9,
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${api_config.apiKey}`
};

const openai = new OpenAI(api_config);
// const langchainOpenAI = new OpenAI(langchain_api_config);
// const langchainChatModel = new ChatOpenAI(langchain_api_config);

const initOpenAI = () => {
  console.log("initOpenAI");
}

const test = async () => {
  console.log("test");

  const text = "What would be a good company name for a company that makes colorful socks?";
        
  const llmResult = await OpenAI.predict(text);
  console.log("llmResult", llmResult);

  // const chatResult = await langchainChatModel.predict(text);
  // console.log("chatResult", chatResult);

  return llmResult;
}

const createImagePrpomt = async (userInput, selecedImage) => {
  console.log("createImage!!");

  const payload = {
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please analyze the image and make a prompt\n' + 
                  'I will create an same image based on the prompt.\n' +
                  'The image style is similar to the image below.\n' +
                  'The image style can be chaged by userPrompt.\n' + 
                  'userInput : ' + userInput 
          },
          {
            type: 'image_url',
            image_url: {
              // url: `data:image/jpeg;base64,${selecedImage}`
              url: selecedImage
            }
          }
        ]
      }
    ],
    max_tokens: 300
  };

  return await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    console.log(data.choices[0].message);
    return (data.choices[0].message.content);
  });
}

const createImage = async (prompt) => {
  return await openai.images.generate({ 
    model: "dall-e-3", //dall-e-2, dall-e-3
    prompt: prompt, 
    n: 1,
    size: "1024x1024", // 512x512 for dalle2, 1024x1024 for dalle3
    response_format: "b64_json",
  }).then((result) => {
    // console.log(result);
    const image = result.data[0];
    // const image_url = image.url;
    const base64_image = 'data:image/jpeg;base64,' + image.b64_json;
    return base64_image;
  });
}

export default {
  initOpenAI: initOpenAI,
  test: test,
  createImagePrpomt: createImagePrpomt,
  createImage: createImage,
};
