import { BaseOutputParser } from "langchain/schema/output_parser";

import { config } from 'dotenv';
config();

async function main() {
  /**
   * Parse the output of an LLM call to a comma-separated list.
   */
  class CommaSeparatedListOutputParser extends BaseOutputParser{
    async parse(text) {
      return text.split(",").map((item) => item.trim());
    }
  }

  const parser = new CommaSeparatedListOutputParser();

  const result = await parser.parse("hi, bye");

  console.log(result);
}
main();