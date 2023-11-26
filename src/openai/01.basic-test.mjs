import {OpenAI} from "langchain/llms/openai";
import {ChatOpenAI} from "langchain/chat_models/openai";
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

  const llmResult = await llm.predict(text);
  console.log(llmResult);

  const chatModelResult = await chatModel.predict(text);
  console.log(chatModelResult);


}
main();