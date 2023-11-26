import fetch from 'node-fetch';
import fs from 'fs';
import { config } from 'dotenv';
config();

async function main() {

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  function encodeImage(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
  }
  
  const imagePath = '\\testfiles\\wireframe_sample2.png';
  const base64Image = encodeImage(imagePath);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const payload = {
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What’s in this image?'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    max_tokens: 300
  };

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log(data.choices[0].message);
  });
}
main();