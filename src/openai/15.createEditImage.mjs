import OpenAI from "openai";
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

async function main() {

    const base64Image = fileToBase64("D:\\testfiles\\wireframe_sample2.png");
    const base64Mask = fileToBase64("D:\\testfiles\\wireframe_sample2.png");

    const response = await openai.images.edit({ 
      // image: fs.createReadStream("D:\\testfiles\\wireframe_sample2.png"),
      // mask: fs.createReadStream("D:\\testfiles\\wireframe_sample2.png"),
      image: base64Image,
      mask: base64Mask,
      size: "512x512",
      prompt: "A cute baby sea otter",
      // response_format: "b64_json",
    });

    console.log(response.data);
}

function fileToBase64(filename) {
  // read binary data
  const binary = fs.readFileSync(path.resolve(filename));
  // convert binary data to base64 encoded string
  return binary.toString('base64');
}

main();