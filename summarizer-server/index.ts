// import axios from "axios";
// import express, { NextFunction, Request, Response } from "express";
// import * as cheerio from "cheerio";
// import cors from "cors";
// import * as dotenv from "dotenv";
// import { readFileSync, writeFileSync } from 'fs';

// dotenv.config();
// const app = express(); // create express API server
// app.use(express.json()); // app.use(...) "middleware"
// app.use(cors());
// const port = process.env.PORT || 3001;

// const url = "https://en.wikipedia.org/wiki/Artificial_intelligence";
// const openaiApiKey = process.env.OPENAI_API_KEY;

// //function to check url is valid
// function isUrlValid(userInput: string): boolean {
//   const urlRegex =
//     /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
//   return urlRegex.test(userInput);
// }
// /*
// POST (/summarize {url: "...wikipedia"})
// handler
// - use the url from req.body
// */
// app.post("/summarize", async (req: Request, res: Response) => {
//   if (!isUrlValid(req.body.url)) {
//      res.status(400).json({ error: "Invalid URL provided." });
//      return;
//   } 
//   try {
//       const response = await axios.get(req.body.url);

//       // Scraping webpage text
//       const $ = cheerio.load(response.data);
//       const content = $("body").text(); // "Hello world"

//       const contentArr = content.split(" ");
//       let newContent = "";
//       const contentLength = Math.min(5000, contentArr.length);
//       for (let i = 0; i < contentLength; i++) {
//         if (i == 0) {
//           newContent = contentArr[i];
//         } else {
//           newContent = newContent + " " + contentArr[i];
//         }
//       }

//       // Prompting llm
//       const openaiReq = {
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "Give detailed summary of the content",
//           },
//           {
//             role: "user",
//             content: newContent,
//           },
//         ],
//       };
//       const llmResponse = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         openaiReq,
//         {
//           headers: {
//             Authorization: `Bearer ${openaiApiKey}`,
//           },
//         }
//       );
//       const summary = llmResponse.data.choices[0].message;
//       // convert object to json string then convert to json object,
//       // you can't convert a regular object to json object
//       const summaryJSON = JSON.parse(JSON.stringify(summary));
//       const summaryContent = summaryJSON.content
//       writeFileSync('./fileSummary.txt', summaryContent, {
//         flag: "w"
//       });
      
//       res.json(summary) ; 
//       return;//should always be the last line
    
//   } catch (error) {
//     console.error(error);
//      res.status(400).send(error || "Error happened");
//   }
// });

// app.post('/answerQuestion', async(req: Request, res: Response) => {
//   try{
//     const {question}= req.body
//     const summary = readFileSync('./fileSummary.txt', 'utf-8')

//     if(!question){
//       res.status(400).json({error: "Question is required"})
//       return
//     }

//     const userContent = JSON.stringify({
//       summary: summary,
//       question: question
//     })

//     const openaiReq = {
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: "system",
//           content: "Answer question based on the summary provided",
//         },
//         {
//           role: "user",
//           content: userContent,
//         },
//       ],
//     }
//     const llmResponse = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       openaiReq,
//       {
//         headers: {
//           Authorization: `Bearer ${openaiApiKey}`,
//         },
//       }
//     );
//     const answer = llmResponse.data.choices[0].message;

//     res.json(answer) ; 
//     return;
//   } catch(error){
//     console.error(error);
//     res.status(400).send(error || "Error happened");
//   }
// });

// app.listen(port, () => {
//   console.log(`Summarizer app listening on port ${port}`);
// });
