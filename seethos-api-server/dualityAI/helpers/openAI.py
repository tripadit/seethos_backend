import openai
from django.conf import settings
import json
import time

# Initialize the API client
openai.api_key =settings.OPENAI_API_KEY  # "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"

# Define the prompt for the model
def analyze_article(conversation,question):
    #while 1:
        #seperate the comma from question and make a list
        question_list = question.split(",")
        #create a json schema of question list
        schema = {}
        for q in question_list:
            schema[q] = ""
        #schema = json.dumps(schema)
        print(schema)
        prompt =  f"Please analyze below conversation provided by use \n and extract answer of users not asistance of there question {question},  , if these is no answer just return null . Give the output in json format like this {schema}"
    #title = "give the attractive title for article about "+ keys

    # Call the API to generate text
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f'{conversation}' }
            ]
        )

        # Extract the generated text
        text = response.choices[0].message.content
        #replace \n and \t if any
        try:
            #remove if "Output" text from response
            text = text.replace("Output:","")
            #remove text outside ofn {} brackets
            text = text[text.find("{"):text.rfind("}")+1]
            #remove space from start and end
            text = text.strip()
            text = text.replace("\n","")
            text = text.replace("\t","")
            #check if sctring have null  convert it to "null"
            text = text.replace("null","\'none\'")
            #regex that will give a valiid json and also check if string have null  convert it to "null"
            #replace "\" with ""
            text = text.replace("\\","")
        except:
            pass
        print(text)

        return text
        

def analyze_conversation(conversation):

        # create json schema for Engagement Level,Communication Style ,Intent , Purpose ,Responsiveness,Information Sharing ,Needs or Requirements ,Call to Action Response.
        schema = {
            "Engagement Level":"",
            "Communication Style":"",
            "Intent":"",
            "Purpose":"",
            "Responsiveness":"",
            "Information Sharing":"",
            "Needs or Requirements":"",
            "Call to Action Response":"",
            "Tone of Conversation":"",
        }

        prompt =  f"""Analyze  this conversation of a human website visitor with an AI chatbot in terms of
            Engagement Level, Intent, Purpose, Responsiveness, Tone of Conversation, Information Sharing, Needs or Requirements and Call to Action Response with a maximum of 4 words on every field.
                Give the output only in json format like this schema {schema}. Remove Output text in response.

                

                
        """
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f'{conversation}' }
            ]
        )

        # Extract the generated text
        text = response.choices[0].message.content
        #replace \n and \t if any
        try:
            #remove if "Output" text from response
            text = text.replace("Output:","")
            #remove space from start and end
            text = text[text.find("{"):text.rfind("}")+1]
            text = text.strip()
            #remove \n and \t if any
            text = text.replace("\n","")
            text = text.replace("\t","")
            #check if sctring have null  convert it to "null"
            text = text.replace("null","\'none\'")
            #regex that will give a valiid json and also check if string have null  convert it to "null"
            #replace "\" with ""
            text = text.replace("\\","")
        except:
            pass
        return text


def metawrite(keys):
        prompt = keys + " please give the output in html format" #"Please generate a JSON object with the following fields:\n\n\"title\": [title of the blog]\n\"content\": [content of the blog in HTML format with sub headings]\n\"keywords\": [list of keywords related to the blog]\n\"highlight\": [list of highlight sentences from the blog]\n\nHere is some context to help generate the blog post:\nwrite a long form article about"+ keys #write long form article about socrates"#keys +", the output text should be in html format <body> tags" #"Generate a full article in html format about "+ keys
    #title = "give the attractive title for article about "+ keys

    # Call the API to generate text
        completions = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.5,
        )

        text = completions.choices[0].text
        return text    


def generate_asistant_name(description,business_name,location,business_type,gender):
    prompt = """- You are an expert at giving AI professional assistants human first and last names that fit perfectly with the information provided, and are easy for a person to remember.
            - Your goal is to recommend five different first and last names based on the following information you have been given about a business.  Your output should ONLY be five first and last names.
            - You should always recommend four traditional names that match the gender provided based on the business information.
            - You should always recomend the human name
            - You should always recommend one name that uniquely reflects diversity and inclusion by stemming from a minority group or having a neutral gender.Generate 5 names for a virtual assistant. give response in json format like this {\"names\": [\"Assistant Name_1\", \"Assistant Name_2\", \"Assistant Name_3\"]}"""
    
    content = f"""Business Name: {business_name} , Location: {location} , Description: {description} , Business Type: {business_type} , Asistant Gender :{gender}"""
    
    response = openai.chat.completions.create(
            model="gpt-4-1106-preview",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f'{content}' }
            ]
        )
    
    # Extract the generated text
    text = response.choices[0].message.content

    try:
         json_data = json.loads(text)

    except:
        json_data = {"names":["John Doe","Jane Doe","Alice Smith","Bob Smith","Alex Kim"]}

    return json_data
