from groq import Groq
import os

def answer_model(cont,role):
        client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
        )
        chat_completion = client.chat.completions.create(
        messages=[
            {
               "role": "system" ,
               "content": role,
            },
            {
               "role": "user" ,
               "content": cont,
            }
        ],
        model="llama3-8b-8192",
        )
        response=chat_completion.choices[0].message.content
        return response