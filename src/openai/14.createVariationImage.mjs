import OpenAI from "openai";
import fs from 'fs';
import { config } from 'dotenv';
config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

async function main() {

    // 주어진 이미지를 기반으로 새로운 이미지를 생성
    const response = await openai.images.createVariation({ 
      size: "1024x1024",
      image: fs.createReadStream("D:\\testfiles\\wireframe_sample2.png"),
      // response_format: "b64_json",
    });

    console.log(response.data);
}

main();