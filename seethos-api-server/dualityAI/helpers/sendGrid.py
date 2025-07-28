import sendgrid
import os
from sendgrid.helpers.mail import Mail, Email, To, Content
from django.conf import settings
import os
from dotenv import load_dotenv
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
import collections


# Load environment variables from .env file
load_dotenv()
# Load environment variables from .env file
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')
print(SENDGRID_API_KEY,DEFAULT_FROM_EMAIL)
def send_email(subject,
               to_emails,
               from_email='',
               substitutions={},
               template_id=None,):
 
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)#os.environ.get('SENDGRID_API_KEY'))
    from_email = Email(DEFAULT_FROM_EMAIL)  # Change to your verified sender
    to_email = To(to_emails)  # Change to your recipient
    message = Mail(subject=subject, to_emails=to_email)
    message.from_email = from_email
    message.template_id = template_id
    message.dynamic_template_data = substitutions
    response = sg.send(message)
    print(response.status_code)
    

def send_verify_email(email,link):
    message = Mail(
    from_email=DEFAULT_FROM_EMAIL,
    to_emails=email,
    subject='Email Verification',
    html_content=link)
    try:
        sg.send(message)
        message=''
    except:
        pass


def send_news(emails,newsletter,popular):
  SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
  #print(BRANCH_IO_URL)
  #try:
  print(str(newsletter.coverPicture.url),str(popular[0].coverPicture.url),str(popular[2].coverPicture.url))
  client = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
  message = sendgrid.helpers.mail.Mail(
      from_email = Email(DEFAULT_FROM_EMAIL),  # Change to your verified sender
      #to_emails = [To("eujjwalr@gmail.com"),To("ragaslagnad28@gmail.com"), To("parfait@einsteinfi.co")],  # Change to your recipient
      #to_emails = [To("ragaslagnad28@gmail.com")],  # Change to your recipient
      to_emails = emails,
      subject=newsletter.title
    
    )

  
 
  substitutions = {
      "M":str(newsletter.coverPicture.url),#"http://cdn.mcauto-images-production.sendgrid.net/3b3828a1e9bf71b4/d1a9b4b2-0ee0-4391-80c9-6ca9d2f532f0/552x372.jpg",
      "T":newsletter.title,
      "C":"text",
      "H":newsletter.highlight.strip('[]').replace("'", "").replace(", ", " "),
      "M1":str(popular[0].coverPicture.url),#"http://cdn.mcauto-images-production.sendgrid.net/3b3828a1e9bf71b4/d1a9b4b2-0ee0-4391-80c9-6ca9d2f532f0/552x372.jpg",
      "T1":popular[0].title,
      "C1":popular[0].highlight.strip('[]').replace("'", "").replace(", ", " "),
      "L1":f"{settings.BRANCH_IO_URL}/news/{popular[0].slug}/details",
      "M2":popular[1].coverPicture.url,#"http://cdn.mcauto-images-production.sendgrid.net/3b3828a1e9bf71b4/d1a9b4b2-0ee0-4391-80c9-6ca9d2f532f0/552x372.jpg",
      "T2":popular[1].title,
      "C2":popular[1].highlight.strip('[]').replace("'", "").replace(", ", " "),
      "L2":f"{settings.BRANCH_IO_URL}/news/{popular[0].slug}/details",
      "M3":str(popular[2].coverPicture.url),#"http://cdn.mcauto-images-production.sendgrid.net/3b3828a1e9bf71b4/d1a9b4b2-0ee0-4391-80c9-6ca9d2f532f0/552x372.jpg",
      "T3":popular[2].title,
      "C3":popular[2].highlight.strip('[]').replace("'", "").replace(", ", " "),
      "L3":f"{settings.BRANCH_IO_URL}/news/{popular[2].slug}/details"
    }
  message.dynamic_template_data = substitutions
  message.template_id = 'd-359701cb91f84cbe8077153760484311'
#   attachment=Attachment(
#       file_content=base64.b64encode(pdf).decode(),
#       file_type='application/pdf',
#       file_name='document.pdf',
#     )
  #message.add_attachment(attachment)  
  response = client.send(message)
  print(response)
  #except:
  #  pass 



def send_emails(emails,title,content,image,highlight):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)

    #html_content = render_to_string(mark_safe('newsletter/newtest.html'), {'content': mark_safe(content),"post_image":image,title:title,highlight:highlight})
    html_content =  render_to_string('newsletter/newtest.html', {'title': mark_safe(title), 'content': mark_safe(content), 'popular': ''})
    print(html_content)
    message = sendgrid.helpers.mail.Mail(
        from_email=Email(DEFAULT_FROM_EMAIL),
        to_emails="ragaslagnad28@gmail.com",
        subject="New News from ScaleBuild.ai",
        html_content=html_content)

    response = sg.send(message)
    print(response)

def send_lets_talk(name,email,phone,comments):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)

    #html_content = render_to_string(mark_safe('newsletter/newtest.html'), {'content': mark_safe(content),"post_image":image,title:title,highlight:highlight})
    #html_content =  render_to_string('newsletter/newtest.html', {'title': mark_safe(title), 'content': mark_safe(content), 'popular': ''})
    message = f"New lets talk request from website \n name:{name} \n email:{email} \n phone: {phone} \n comments:{comments}   "
    
    message = sendgrid.helpers.mail.Mail(
        from_email=Email(DEFAULT_FROM_EMAIL),
        to_emails=["ragaslagnad28@gmail.com","eujjwalr@gmail.com"],
        subject="Lets Talk (AI newsletter) ",
        plain_text_content=message)

    response = sg.send(message)
    print(response)  


#get stats by sender email
def get_stats_by_sender_email(email,start_date,end_date,filter_by,api_key):
    #SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    sg = sendgrid.SendGridAPIClient(api_key=api_key)
    params = {
    'start_date': "2024-01-01",
    'aggregated_by': 'month', 
    'senders': ['test@gmail.com'],
    }
    response = sg.client.stats.get(query_params=params)
    import json

    convert_to_json = json.loads(response.body)
        

    # Initialize a dictionary to hold the yearly stats
    yearly_stats = collections.defaultdict(lambda: collections.defaultdict(int))

    # Loop through the monthly stats and aggregate them by year
    for stat in convert_to_json:
        year = stat['date'].split('-')[0]  # Extract the year from the date
        for metric, value in stat['stats'][0]['metrics'].items():
            yearly_stats[year][metric] += value

    #add 
    
    # print(response.status_code)
    # print(response.body)
    # print(response.headers) 

    try:
        
        convert_to_json = json.loads(response.body)
        return yearly_stats
    except:
        return response.body



def add_contact(email, custom_fields):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    
    data = {
        "contacts": [
            {
                "email": "ragas@gmail.com",
                "custom_fields": {
                    "email_contain": custom_fields["email_contain"],
                    "email_subject": custom_fields["email_subject"],
                }
            }
        ]
    }
    
    response = sg.client.contactdb.recipients.post(json_body=data)
    
    return response 

#function to create campaign
def create_campaign(sender_id, subject, html_content, plain_text_content, list_ids):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    
    data = {
        "sender_id": sender_id,
        "subject": subject,
        "html_content": html_content,
        "plain_text_content": plain_text_content,
        "suppression_group_id": 42,
        "custom_unsubscribe_url": "https://www.example.com/unsubscribe",
        "ip_pool": "marketing",
        "list_ids": list_ids,
        "dynamic_template_data": {
            "field1": "value1",
            "field2": "value2",
            "field3": "value3"
        }
    }
    
    response = sg.client.marketing.campaigns.post(json_body=data)
    
    return response

#function to get sender id by email
def get_sender_id(email):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    
    response = sg.client.senders.get(query_params={"email": email})
    
    return response.body

#function to get list ids
def get_list_ids():
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    
    response = sg.client.marketing.lists.get()
    
    return response.body

#function to add contact to list
def add_contact_to_list(contact_id, list_id):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    
    response = sg.client.marketing.lists._(list_id).contacts._(contact_id).put()
    
    return response

#function to create list
def create_list(name):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    
    data = {
        "name": name
    }
    
    response = sg.client.marketing.lists.post(json_body=data)
    print(response)
    
    return response

