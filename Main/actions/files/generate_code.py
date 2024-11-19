from groq import Groq
import os
from Conf.conf import groq_api_key
api_key=groq_api_key

def generate_code(language,promt):
    language="```"+language
    client = Groq(api_key=api_key,)
    completion = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=[
        {
            "role": "user",
            "content": promt
        },
        {
            "role": "assistant",
            "content": "```python"
        }
    ],
    stop="```",
    )

    code=completion.choices[0].message.content
    return code

    
