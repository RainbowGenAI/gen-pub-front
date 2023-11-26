import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";

import { config } from 'dotenv';
config();

const OPENAI_CONFIG = {
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  temperature: 0.9,
};

async function main() {
  /**
   * Parse the output of an LLM call to a comma-separated list.
   */
  class CommaSeparatedListOutputParser extends BaseOutputParser{
    async parse(text) {
      return text.split(",").map((item) => item.trim());
    }
  }

  const template = `You are a helpful assistant who generates comma separated lists.
  A user will pass in a category, and you should generate 5 objects in that category in a comma separated list.
  ONLY return a comma separated list, and nothing more.`;

  const humanTemplate = "{text}";

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", template],
    ["human", humanTemplate],
  ]);

  const model = new ChatOpenAI(OPENAI_CONFIG);

  const parser = new CommaSeparatedListOutputParser();

  const chain = chatPrompt.pipe(model).pipe(parser);

  const result = await chain.invoke({
    text: "colors",
  });

  console.log(result);
}
main();