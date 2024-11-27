from groq import Groq
from HakuCore.Conf.conf import groq_api_key

def main(cont,role):
        client = Groq(
        api_key=groq_api_key,
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

