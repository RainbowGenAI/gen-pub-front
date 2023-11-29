import { OpenAI } from "openai";
// import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";
import { Prompt } from './Prompt.js'
import { Readable } from 'stream';

const api_config = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  temperature: 0.9,
}

// const langchain_api_config = {
//   openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
//   temperature: 0.9,
// }

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

const createPromptByImage = async (userInput, selecedImage) => {
  console.log("createPromptByImage");

  const payload = {
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: Prompt.ANALYZE_IMAGE + userInput 
          },
          {
            type: 'image_url',
            image_url: {
              // url: `data:image/jpeg;base64,${selecedImage}`
              url: selecedImage,
              detail: 'low', //high
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


const createCodeByImage = async (selecedImage) => {
  console.log("createCodeByImage");

  const payload = {
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: Prompt.GENERATE_HTML_CODE,
          },
          {
            type: 'image_url',
            image_url: {
              url: selecedImage,
              detail: 'low',
            }
          }
        ]
      }
    ],
    max_tokens: 2000
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
  console.log("createImage");
  return await openai.images.generate({ 
    model: "dall-e-3", //dall-e-2, dall-e-3
    prompt: prompt, 
    n: 1,
    size: "1024x1024", // 512x512 for dalle2, 1024x1024 for dalle3
    quality: "standard", // standard, hq
    response_format: "b64_json",
  }).then((result) => {
    // console.log(result);
    const image = result.data[0];
    // const image_url = image.url;
    const base64_image = 'data:image/jpeg;base64,' + image.b64_json;
    return base64_image;
  });
}

const modifyImage = async (selectedImage, maskedImage, labelInfo) => {
  console.log("modifyImage", labelInfo);

  const prompt = labelInfo[0]?.comment;

  let selectedImageStream = null;
  let maskedImageStream = null;

  return await base64ToFile(selectedImage, "\\selectedImage.png")
  .then((result) => {
    selectedImageStream = result;
  })
  .then(async (result) => {
    return await base64ToFile(maskedImage, "\\maskedImage.png")
  })
  .then((result) => {
    maskedImageStream = result;
  })
  .then(async (result) => {
    // console.log(selectedImageStream);
    // console.log(maskedImageStream);

    return await openai.images.edit({ 
      image: selectedImageStream,
      mask: maskedImageStream,
      // prompt: Prompt.MODIFY_IMAGE, 
      prompt: prompt, 
      size: "512x512", // 512x512 for dalle2, 1024x1024 for dalle3
      response_format: "b64_json",
    }).then((result) => {
      const image = result.data[0];
      // const image_url = image.url;
      const base64_image = 'data:image/jpeg;base64,' + image.b64_json;
      return base64_image;
    });
  })

  // return await openai.images.edit({ 
  //   image: selectedBuffer,
  //   mask: maskedBuffer,
  //   prompt: Prompt.MODIFY_IMAGE, 
  // }).then((result) => {
  //   console.log(result);
  //   const image = result.data[0];
  //   // const image_url = image.url;
  //   const base64_image = 'data:image/jpeg;base64,' + image.b64_json;
  //   return base64_image;
  // });

}

async function base64ToFile(base64String, filename) {
  // fetch the base64 string
  const response = await fetch(base64String);

  // get a Blob from the response
  const blob = await response.blob();

  // create a File from the Blob
  const file = new File([blob], filename, { type: blob.type });

  return file;
}



export default {
  initOpenAI: initOpenAI,
  test: test,
  createPromptByImage: createPromptByImage,
  createImage: createImage,
  createCodeByImage: createCodeByImage,
  modifyImage: modifyImage,
};
