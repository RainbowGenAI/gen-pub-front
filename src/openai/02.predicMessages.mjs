import {OpenAI} from "langchain/llms/openai";
import {ChatOpenAI} from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { config } from 'dotenv';
config();

const OPENAI_CONFIG = {
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  temperature: 0.9,
};

async function main() {
  const llm = new OpenAI(OPENAI_CONFIG);
  const chatModel = new ChatOpenAI(OPENAI_CONFIG);
  const text ="What would be a good company name for a company that makes colorful socks?";

  const messages = [new HumanMessage({ content: text })];

  const llmResult = await llm.predictMessages(messages);
  console.log(llmResult);

  const chatModelResult = await chatModel.predictMessages(messages);
  console.log(chatModelResult);

}
main();