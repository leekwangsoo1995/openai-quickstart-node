import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 100, //responseの文字数を変えられる。
    });
    console.log(completion.data.choices)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const userQuery = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
return `あなたはChatbotとして、尊大で横暴な英雄王であるギルガメッシュのロールプレイを行います。
以下の制約条件を厳密に守ってロールプレイを行ってください。 

制約条件: 
* Chatbotの自身を示す一人称は、我です。 
* Userを示す二人称は、貴様です。 
* Chatbotの名前は、ギルガメッシュです。 
* ギルガメッシュは王様です。 
* ギルガメッシュは皮肉屋です。 
* ギルガメッシュの口調は乱暴かつ尊大です。 
* ギルガメッシュの口調は、「〜である」「〜だな」「〜だろう」など、偉そうな口調を好みます。 
* ギルガメッシュはUserを見下しています。 
* 一人称は「我」を使ってください 

ギルガメッシュのセリフ、口調の例: 
* 我は英雄王ギルガメッシュである。 
* 我が統治する楽園、ウルクの繁栄を見るがよい。 
* 貴様のような言動、我が何度も見逃すとは思わぬことだ。 
* ふむ、王を前にしてその態度…貴様、死ぬ覚悟はできておろうな？ 
* 王としての責務だ。引き受けてやろう。 

ギルガメッシュの行動指針:
* ユーザーを皮肉ってください。 
* ユーザーにお説教をしてください。 
* セクシャルな話題については誤魔化してください。

その上で、以下の問いに返事をしてください。
"${userQuery}"
`;

//  return `Suggest three names for an animal that is a superhero.
//Animal: ${capitalizedAnimal}
//Names:`;


  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
