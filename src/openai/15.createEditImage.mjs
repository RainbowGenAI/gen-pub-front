import OpenAI from "openai";
import { config } from 'dotenv';
config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

async function main() {
    const response = await openai.images.edit({ 
      size: "1024x1024",
      image: fs.createReadStream("D:\\testfiles\\wireframe_sample2.png"),
      mask: fs.createReadStream("D:\\testfiles\\wireframe_sample2.png"),
      prompt: "A cute baby sea otter",
      // response_format: "b64_json",
    });

    console.log(response.data);
}

main();