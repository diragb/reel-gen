// Packages:
import OpenAI from 'openai'

// Functions:
const generateScript = async ({
  username,
  topic,
  request,
  pageDescription,
}: {
  username: string,
  topic: string
  request?: string
  pageDescription?: string
}) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
    })

    const userMessage = `Give me a script for "${ topic }".

This script should be under 45 seconds to a minute, and should include visuals and pauses.
${request ?? ''}

This script will be turned into an Instagram reel, which will be posted by the page "@${ username }".
The opening of the script should have an interesting hook that grab's people's attention, and a hook at the very end that asks people to follow the page.

The script will be text heavy, as the visuals will just be static pictures that are zoomed into or panned across.
Don't mention the username of the page in the script.

${ pageDescription ?? '' }

The generated output will be shown directly to a user. Start.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: userMessage }],
      temperature: 0.7,
    })

    if (response.choices[0].message.content) {
      const script = response.choices[0].message.content.trim()
      return {
        status: true,
        payload: script,
      }
    } else {
      console.error('Invalid message content from OpenAI', response.choices[0].message)
      return {
        status: false,
        payload: 'Encountered an API Error',
      }
    }
  } catch (error) {
    return {
      status: false,
      payload: (error as Error).message,
    }
  }
}

// Exports:
export default generateScript
