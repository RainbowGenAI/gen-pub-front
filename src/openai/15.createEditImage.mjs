import OpenAI from "openai";
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

async function main() {
    const response = await openai.images.edit({ 
      image: fs.createReadStream("D:\\testfiles\\wireframe_sample2.png"),
      mask: fs.createReadStream("D:\\testfiles\\wireframe_sample2.png"),
      size: "512x512",
      prompt: "A cute baby sea otter",
      // response_format: "b64_json",
    });

    console.log(response.data);
}

main();