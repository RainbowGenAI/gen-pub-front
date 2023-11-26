import { PromptTemplate } from "langchain/prompts";

import { config } from 'dotenv';
config();

async function main() {
  const prompt = PromptTemplate.fromTemplate(
    "What is a good name for a company that makes {product}?"
  );
  
  const formattedPrompt = await prompt.format({
    product: "colorful socks",
  });


  console.log(formattedPrompt);
}
main();