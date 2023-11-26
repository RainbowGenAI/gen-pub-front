import { ChatPromptTemplate } from "langchain/prompts";

import { config } from 'dotenv';
config();

async function main() {
  const template ="You are a helpful assistant that translates {input_language} into {output_language}.";
  const humanTemplate = "{text}";

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", template],
    ["human", humanTemplate],
  ]);

  const formattedChatPrompt = await chatPrompt.formatMessages({
    input_language: "English",
    output_language: "French",
    text: "I love programming.",
  });


  console.log(formattedChatPrompt);
}
main();