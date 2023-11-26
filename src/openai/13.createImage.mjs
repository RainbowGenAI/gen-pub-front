import {OpenAI} from "openai";
import { config } from 'dotenv';
config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

async function main() {

    // 프롬프트를 이용하여 새로운 이미지를 생성
    const response = await openai.images.generate({ 
      model: "dall-e-3", 
      prompt: "A cute baby sea otter", 
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    console.log(response.data);
}

main();