import { ChatOpenAI } from "@langchain/openai";
import {z} from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
dotenv.config({path:"./.env"})

const testSchema = z.object({
    name: z.string().describe("Person name mentioned in the statement"),
    price: z.number().describe("Price in USD mentioned in the statement"),
    starRating: z.number().describe("Rating mentioned in fraction or decimal or number or string")
})

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature:0,
    apiKey: process.env.OPENAI_API_KEY
})

const parser = StructuredOutputParser.fromZodSchema(testSchema);

const prompt = new PromptTemplate({
    template:"Based on the statement passed in user input return the name, price and star rating. Given user statement:{input}. Always return the results using instructions as {format_instructions}",
    inputVariables:["input", "format_instructions"]
})

const chain = prompt.pipe(model).pipe(parser);

const response =  await chain.invoke({input:"BrightLens 4K Projector approximtely $349, rated 4/5 stars", "format_instructions": parser.getFormatInstructions()})

console.log(response);

