from pymongo import MongoClient
from collections.abc import MutableMapping
#import djano settings here
from django.conf import settings
from bson.objectid import ObjectId
from bson.json_util import dumps
from subscription.utils import get_next_billing_date
import json
import datetime
import demjson3



# client = MongoClient(settings.MONGO_URL)
# db = client["Bots"] 

def get_chatbot(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"] 
    # Retrieve all documents in the specified subdomain
    documents = db[subdomain].find({})

    session_info_with_ids = []

    for document in documents:
        session_info_list = document.get("session_info", [])
        document_id = str(document.get("_id", None))  # Get the _id and convert it to a string

        for session_info in session_info_list:
            # Calculate the duration
            first_timestamp = session_info_list[0]["timestamp"]
            last_timestamp = session_info_list[-1]["timestamp"]
            duration = last_timestamp - first_timestamp
            
            # Check if the last timestamp is older than now
            status = "active" if last_timestamp < datetime.datetime.utcnow() else "inactive"
            session_info_with_ids.append({"_id": document_id, "session_info": session_info})

    return session_info_with_ids


def get_ids_and_info_lengths(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]

    # Retrieve all documents in the specified subdomain
    documents = db[subdomain].find({})

    ids_and_info_lengths = []

    for document in documents:
        try:
            document_id = str(document.get("_id", None))  # Get the _id and convert it to a string
            session_info_list = document.get("session_info", [])
            if len(session_info_list) > 1:
                info_length = len(session_info_list)
                #calculate duration , status of session
                first_timestamp = session_info_list[0]["timestamp"]
                last_timestamp = session_info_list[-1]["timestamp"]
                duration = last_timestamp - first_timestamp 

                #if duration is greater that 5 min set to to 5 min
                if duration > datetime.timedelta(minutes=5):
                    duration = datetime.timedelta(minutes=5)

                # add 5 minutes to last timestamp to check if it is active or not
                last_timestamp_active = last_timestamp + datetime.timedelta(minutes=5)
                status = "active" if last_timestamp_active > datetime.datetime.utcnow() else "inactive"
                conversion = document.get("conversion", "False")
        
                ids_and_info_lengths.append({"_id": document_id, "info_length": info_length, "duration": duration, "status": status,"conversion":conversion,"created_at":str(first_timestamp)})
        except: 
            pass
    return ids_and_info_lengths

def get_details_by_id(subdomain, document_id):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]

    # Assuming 'document_id' is the MongoDB ObjectId of the document you want to retrieve
    document = db[subdomain].find_one({"_id": ObjectId(document_id)})
    if not document:
        return None
    session_info_list = document.get("session_info", [])
    if len(session_info_list) > 1:
        document["_id"] = str(document["_id"])
        #calculate total duration of this doc
        session_info_list = document.get("session_info", [])
        duration = 0
        conversion_duration = 0
        if len(session_info_list) > 1:
            first_timestamp = session_info_list[0]["timestamp"]
            last_timestamp = session_info_list[-1]["timestamp"]
            duration = last_timestamp - first_timestamp
            #if duration is greater than 10 min set it to 10 min
            if duration > datetime.timedelta(minutes=10):
                duration = datetime.timedelta(minutes=10)
            try:
                conversion_duration = document["conversion_time"] - first_timestamp

            except:
                pass
        document["total_time_of_conversation"] = duration   
        document["conversion_duration"] = conversion_duration 

        return document
    else:
        return None    

def get_query_count(chatbot):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]
    query_count = 0
    query_count_month = 0
    subscription_due_date = get_next_billing_date(chatbot[0].account)
    for subdomain in chatbot:
        #count the session of each chatbot
        try:
            documents = db[subdomain.bot_id].find({})
            for document in documents:
                #count the query for the subscription due data , get ue date from get_next_billing_date
                #count query if the session is created within the one month of subscription due date
                query_count += len(document["session_info"])
                #get date from created_at and check if it is within the one month of subscription due date
                
                try:
                    if document["created_at"].date() >= (subscription_due_date -  datetime.timedelta(days=30)).date():
                        query_count_month += len(document["session_info"])
                except:
                    pass
        except:
            pass

    #calculate the % of change in query count vs last month , last week , last day
    last_month = 0
    last_week = 0
    last_day = 0
    for subdomain in chatbot:
        #count the session of each chatbot
        try:
            documents = db[subdomain.bot_id].find({})
            for document in documents:
                #check if document is created in last month
                if document["created_at"] < datetime.datetime.utcnow() - datetime.timedelta(days=30):
                    last_month += len(document["session_info"])
                #check if document is created in last week
                if document["created_at"] < datetime.datetime.utcnow() - datetime.timedelta(days=7):
                    last_week += len(document["session_info"])
                #check if document is created in last day
                if document["created_at"] < datetime.datetime.utcnow() - datetime.timedelta(days=1):
                    last_day += len(document["session_info"])
        except:
            pass
    if last_month > 0:
        last_month = (query_count - last_month) / last_month * 100
    else:
        last_month = 0
    if last_week > 0:
        last_week = (query_count - last_week) / last_week * 100
    else:
        last_week = 0
    if last_day > 0:
        last_day = (query_count - last_day) / last_day * 100
    else:
        last_day = 0

    return {"query_count":query_count,"last_month":last_month,"last_week":last_week,"last_day":last_day,"query_count_month":query_count_month}                   


#fun to count query of each chatbot by analyzing the session_info query
def get_query_count_by_chatbot(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]
    query_count = 0
    documents = db[subdomain].find({})
    subscription_due_date = get_next_billing_date(subdomain.account)
    for document in documents:
        #count the query for the subscription due data , get ue date from get_next_billing_date
        
        #count query if the session is created within the one month of subscription due date
        if document["created_at"].date() >= (subscription_due_date - datetime.timedelta(days=30)).date():
            query_count += len(document["session_info"])
    return {"query_count":query_count}

#count session of all chatbots
def count_session(subdomain):
    count = 0
    try:
        db = client["Bots"]
        #count if the session info have more than 1 element not only 1 element

        count = db[subdomain].count_documents({
                    "$expr": {
            "$gte": [{"$size": "$session_info"}, 2]
            }
        })

        #count = db[subdomain].count_documents({})
    except:
        pass    
    return count


#function to delete session
def delete_session(subdomain,session_id):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"] 

    try:
        db[subdomain].delete_one({"_id": ObjectId(session_id)})
    except:
        return False

    return True    

#count session of all chatbots
def progression_status(bots):
    client = MongoClient(settings.MONGO_URL)
    last_month = 0
    last_week = 0
    last_day = 0
    count = 0
    for bot in bots:    
        subdomain = bot.bot_id
            
            
        try:
            db = client["Bots"]
            count += db[subdomain].count_documents({})
            #count session of last month not including current month
            last_month += db[subdomain].count_documents({"created_at": {"$lte": datetime.datetime.utcnow() - datetime.timedelta(days=30)}})
            
            #count session of last week not including current week
            last_week += db[subdomain].count_documents({"created_at": {"$lte": datetime.datetime.utcnow() - datetime.timedelta(days=7)}})
            #count session of last day not including current day
            last_day += db[subdomain].count_documents({"created_at": {"$lte": datetime.datetime.utcnow() - datetime.timedelta(days=1)}})


        except:
                pass
    print(last_day)             
            
    if last_month > 0:
        last_month = (count - last_month) / last_month * 100
    else:
        last_month = 0
    if last_week > 0:
        last_week = (count - last_week) / last_week * 100
    else:
        last_week = 0
    if last_day > 0:
        last_day = (count - last_day) / last_day * 100
    else:
        last_day = 0


    return {"total_session":count,"last_month":last_month,"last_week":last_week,"last_day":last_day}
    #     except:
    #         pass    
    # return  {"total_session":0,"last_month":0,"last_week":0,"last_day":0}


#progression status of a active session
def progression_status_active(bots):
    client = MongoClient(settings.MONGO_URL)
    last_month = 0
    last_week = 0
    last_day = 0
    count = 0
    for bot in bots:    
        subdomain = bot.bot_id
            
            
        try:
            db = client["Bots"]
            count += db[subdomain].count_documents({"conversion": "true"})
            last_month += db[subdomain].count_documents({"conversion": "true","created_at": {"$lte": datetime.datetime.utcnow() - datetime.timedelta(days=30)}})
            last_week += db[subdomain].count_documents({"conversion": "true","created_at": {"$lte": datetime.datetime.utcnow() - datetime.timedelta(days=7)}})
            last_day += db[subdomain].count_documents({"conversion": "true","created_at": {"$lte": datetime.datetime.utcnow() - datetime.timedelta(days=1)}})

        except:
                pass
            
    if last_month > 0:
        last_month = (count - last_month) / last_month * 100
    else:
        last_month = 0
    if last_week > 0:
        last_week = (count - last_week) / last_week * 100
    else:
        last_week = 0
    if last_day > 0:
        last_day = (count - last_day) / last_day * 100
    else:
        last_day = 0


    return {"total_session":count,"last_month":last_month,"last_week":last_week,"last_day":last_day}
    #     except:
    #         pass    
    # return  {"total_session":0,"last_month":0,"last_week":0,"last_day":0}

#total session of all chatbots which are active conversion
def count_active_conversion(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]
    count = db[subdomain].count_documents({"conversion": "true"})
    return count    
#count total chabots of a subdomain

def count_chatbot(chatbot):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]
    count = 0
    active_count = 0
    active_chatbot = 0
    total_duration = datetime.timedelta()
    #declare duration variable as empty time delta
    duration = datetime.timedelta()
    for subdomain in chatbot:
        try:
            # subdomain = subdomain.bot_id
            count = count + count_session(subdomain.bot_id)
            active_count = active_count + count_active_conversion(subdomain.bot_id)
            documents = db[subdomain.bot_id].find({})
            #calculate duration if conversion is true
            for document in documents:
                session_info_list = document.get("session_info", [])
                first_timestamp = session_info_list[0]["timestamp"]
                last_timestamp = session_info_list[-1]["timestamp"]
                duration_ = last_timestamp - first_timestamp
                #if duration is greater than 5 min set it to 5 min
                if duration_ > datetime.timedelta(minutes=5):
                    duration_ = datetime.timedelta(minutes=5)
                total_duration += duration_
                
                #check if documents conversion is true:
                if document.get("conversion",None) == "true":
                    duration += last_timestamp - first_timestamp


            #check if the chatbots latest session is active or not
            if subdomain.status == True:
                active_chatbot = active_chatbot + 1        

        except:
             pass   
    try:
        time_to_conversion = duration/active_count         
    except:
        time_to_conversion = 0
    
    query_count = get_query_count(chatbot)
    return {"total_chatbot":len(chatbot),"total_session":count, "total_conversion":active_count,'active_chatbot':active_chatbot,"time_to_conversion":time_to_conversion,"query_count":query_count["query_count"],"query_count_month":query_count['query_count_month'],"total_conversion_duration":total_duration}

#function to get session by id and update conversion to true
def update_conversion(subdomain,id):
    client = MongoClient(settings.MONGO_URL)
    try:
        db = client["Bots"]
        db[subdomain].update_one({"session_id":id}, {"$set": {"conversion": "true","conversion_time":datetime.datetime.utcnow()}})
        #add conversation time to analytic above doc
    except:
        pass


def update_analyzation(subdomain,id,analyzation):
    try:
        db = client["Bots"]
        db[subdomain].update_one({"_id": ObjectId(id)}, {"$set": {"information":analyzation }})
    except:
        pass  

#function to update analytic
def update_analytic(subdomain,id,analytic):
    client = MongoClient(settings.MONGO_URL)
    try:
        db = client["Bots"]
        db[subdomain].update_one({"_id": ObjectId(id)}, {"$set": {"analytic":analytic }})
    except:
        pass  

#function that will return all {information} of a chatbot
def get_all_lead(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]
    documents = db[subdomain].find({})
    information = []
    for document in documents:
        data = document.get("information", [])
        #convert data from string to json
        try:
            #remove \n and \t if any
            data = json.loads(data)
            information.append(data)
        except:
            try:
                data = demjson3.decode(data)
                information.append(data)
            except:
                pass


    #remove is list have any empty dict or empty string or empty list
    information = [x for x in information if x != {}]
    information = [x for x in information if x != ""]
    information = [x for x in information if x != []]        
    return information 

    
def get_chatbot_session_by_id(subdomain, id):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"] 
    chatbot = db[subdomain].find_one({"_id": ObjectId(id)})
    return chatbot    

def get_chatbot_session_by_session_id(subdomain, session_id):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"] 
    chatbot = db[subdomain].find_one({"_id": session_id})
    return chatbot

#function to delete session
def delete_session(subdomain,session_id):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"] 
    db[subdomain].delete_one({"_id": session_id})   

  

#function to get totalsession , active session , total conversion , avg time to conversion , total duration ,avg duration
def get_session_info(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]
    documents = db[subdomain].find({})
    total_session = 0
    active_session = 0
    total_conversion = 0
    query_count = 0
    total_visit = 0
    total_duration = datetime.timedelta()
    avg_duration = datetime.timedelta()
    avg_time_to_conversion = datetime.timedelta()
    for document in documents:
        total_visit += 1
        if document.get("conversion",None) == "true":
            total_conversion += 1
        session_info_list = document.get("session_info", [])
        if len(session_info_list) > 1:
            total_session += 1
        query_count += len(session_info_list)
        first_timestamp = session_info_list[0]["timestamp"]
        last_timestamp = session_info_list[-1]["timestamp"]
        duration = last_timestamp - first_timestamp
        #check if duration is greater than 5 min
        if duration > datetime.timedelta(minutes=5):
            duration = datetime.timedelta(minutes=5)
        total_duration += duration
        if document.get("conversion",None) == "true":
            avg_time_to_conversion += last_timestamp - first_timestamp

        # add 5 minutes to last timestamp to check if it is active or not
        last_timestamp_active = last_timestamp + datetime.timedelta(minutes=5)    
        if last_timestamp_active > datetime.datetime.utcnow():
            active_session += 1
    if total_conversion > 0:
        avg_time_to_conversion = avg_time_to_conversion / total_conversion
    if total_session > 0:
        avg_duration = total_duration / total_session
        
    return {"total_session":total_session,"active_session":active_session,"total_conversion":total_conversion,"avg_time_to_conversion":avg_time_to_conversion,"total_duration":total_duration,"avg_duration":avg_duration,'query_count':query_count,'total_visit':total_visit}


#function to calculate progression data of these totalsession , active session , total conversion , avg time to conversion , total duration ,avg duration  upto last day , last week , last month
def get_progression_data(subdomain):
    try:
        client = MongoClient(settings.MONGO_URL)
        db = client["Bots"]
        documents = db[subdomain].find({})
        last_month = 0
        last_week = 0
        last_day = 0
        total_session = 0
        active_session = 0
        total_conversion = 0
        query_count = 0
        total_duration = datetime.timedelta()
        avg_duration = datetime.timedelta()
        avg_time_to_conversion = datetime.timedelta()
    
        #calculate totalsession , active session , total conversion , avg time to conversion , total duration ,avg duration for that is created in each month , week , day
        categories = {
            'months': {},
            'weeks': {},
            'weekdays': {}
            }
        for document in documents:
            # Get ISO calendar information for the input date
            input_date = document.get("created_at",None)
            iso_info = input_date.isocalendar()

            # Categorize by month
            month_key = f"{iso_info[0]}-{iso_info[1]}"
            #add last 12 month data not including current month
            if iso_info[1] > iso_info[1] - 12:
                #check if documents is not created in this month
                if input_date.month != datetime.datetime.utcnow().month:
                    if month_key not in categories['months']:
                        categories['months'][month_key] = []
                    categories['months'][month_key].append(document)
 
            week_key = f"Week {iso_info[1]}"
            #add last 4 week data
            if iso_info[1] > iso_info[1] - 4:
                #check if documents is not created in this week
                if input_date.isocalendar()[1] != datetime.datetime.utcnow().isocalendar()[1]:
                    if week_key not in categories['weeks']:
                        categories['weeks'][week_key] = []
                    categories['weeks'][week_key].append(document)

            weekday_key = input_date.strftime("%A")
            #add last 7 day data
            if iso_info[2] > iso_info[2] - 7:
                #check if documents is not created in this day
                if input_date.day != datetime.datetime.utcnow().day:
                    if weekday_key not in categories['weekdays']:
                        categories['weekdays'][weekday_key] = []
                    categories['weekdays'][weekday_key].append(document)       

        get_current_data = get_session_info(subdomain)
        #calculate totalsession , active session , total conversion , avg time to conversion , total duration ,avg duration of each category
        for category in categories:
            total_session = 0
            total_visit = 0
            for key in categories[category]:
                for document in categories[category][key]:
                    total_visit += 1
                    if document.get("conversion",None) == "true":
                        total_conversion += 1
                    session_info_list = document.get("session_info", [])
                    if len(session_info_list) > 1:
                        total_session += 1 
                    query_count += len(session_info_list)
                    first_timestamp = session_info_list[0]["timestamp"]
                    last_timestamp = session_info_list[-1]["timestamp"]
                    duration = last_timestamp - first_timestamp
                    if duration > datetime.timedelta(minutes=5):
                        duration = datetime.timedelta(minutes=5)
                    total_duration += duration
                    
                    if document.get("conversion",None) == "true":
                        avg_time_to_conversion += last_timestamp - first_timestamp
                    if last_timestamp > datetime.datetime.utcnow():
                        active_session += 1
       
                if total_conversion > 0:
                    avg_time_to_conversion = avg_time_to_conversion / total_conversion
                if total_session > 0:
                    avg_duration = total_duration / total_session
                if category == "months":
                    last_month = {"total_session":total_session,"active_session":active_session,"total_conversion":total_conversion,"avg_time_to_conversion":avg_time_to_conversion,"total_duration":total_duration,"avg_duration":avg_duration,'query_count':query_count, 'total_visit':total_visit}
                if category == "weeks":
                    last_week = {"total_session":total_session,"active_session":active_session,"total_conversion":total_conversion,"avg_time_to_conversion":avg_time_to_conversion,"total_duration":total_duration,"avg_duration":avg_duration,'query_count':query_count, 'total_visit':total_visit}
                if category == "weekdays":
                    last_day = {"total_session":total_session,"active_session":active_session,"total_conversion":total_conversion,"avg_time_to_conversion":avg_time_to_conversion,"total_duration":total_duration,"avg_duration":avg_duration,'query_count':query_count, 'total_visit':total_visit}
    
    
        #calculate % of change in each data
        total_session = get_current_data["total_session"]
        active_session = get_current_data["active_session"]
        total_conversion = get_current_data["total_conversion"]
        avg_time_to_conversion = get_current_data["avg_time_to_conversion"]
        total_duration = get_current_data["total_duration"]
        avg_duration = get_current_data["avg_duration"]
        query_count = get_current_data["query_count"]
        total_visit = get_current_data["total_visit"]

        if last_month != 0:
            try:
                total_session_prgression = (total_session - last_month["total_session"]) / last_month["total_session"] * 100
            except:
                total_session_prgression = 0
            try:
                active_session_prgression = (active_session - last_month["active_session"]) / last_month["active_session"] * 100
            except:
                active_session_prgression = 0
            try:
                total_conversion_prgression = (total_conversion - last_month["total_conversion"]) / last_month["total_conversion"] * 100
            except:
                total_conversion_prgression = 0
            try:
                avg_time_to_conversion_prgression = (avg_time_to_conversion - last_month["avg_time_to_conversion"]) / last_month["avg_time_to_conversion"] * 100
            except:
                avg_time_to_conversion_prgression = 0
            try:
                total_duration_prgression = (total_duration - last_month["total_duration"]) / last_month["total_duration"] * 100
            except:
                total_duration_prgression = 0
            try:
                avg_duration_prgression = (avg_duration - last_month["avg_duration"]) / last_month["avg_duration"] * 100
            except:
                avg_duration_prgression = 0
            try:
                query_count_prgression = (query_count - last_month["query_count"]) / last_month["query_count"] * 100
            except:
                query_count_prgression = 0 
            try:
                total_visit_prgression = (total_visit - last_month["total_visit"]) / last_month["total_visit"] * 100
            except:
                total_visit_prgression = 0   
        else:
            total_session_prgression = 0
            active_session_prgression = 0
            total_conversion_prgression = 0
            avg_time_to_conversion_prgression = 0
            total_duration_prgression = 0
            avg_duration_prgression = 0
            query_count_prgression = 0
            total_visit_prgression = 0
        if last_week != 0:
            try:
                total_session_prgression_week = (total_session - last_week["total_session"]) / last_week["total_session"] * 100
            except:
                total_session_prgression_week = 0
            try:
                active_session_prgression_week = (active_session - last_week["active_session"]) / last_week["active_session"] * 100
            except:
                active_session_prgression_week = 0
            try:
                total_conversion_prgression_week = (total_conversion - last_week["total_conversion"]) / last_week["total_conversion"] * 100
            except:
                total_conversion_prgression_week = 0
            try:
                avg_time_to_conversion_prgression_week = (avg_time_to_conversion - last_week["avg_time_to_conversion"]) / last_week["avg_time_to_conversion"] * 100
            except:
                avg_time_to_conversion_prgression_week = 0
            try:
                total_duration_prgression_week = (total_duration - last_week["total_duration"]) / last_week["total_duration"] * 100
            except:
                total_duration_prgression_week = 0
            try:
                avg_duration_prgression_week = (avg_duration - last_week["avg_duration"]) / last_week["avg_duration"] * 100
            except:
                avg_duration_prgression_week = 0
            try:
                query_count_prgression_week = (query_count - last_week["query_count"]) / last_week["query_count"] * 100
            except:
                query_count_prgression_week = 0
            try:
                total_visit_prgression_week = (total_visit - last_week["total_visit"]) / last_week["total_visit"] * 100
            except:
                total_visit_prgression_week = 0
        else:
            total_session_prgression_week = 0
            active_session_prgression_week = 0
            total_conversion_prgression_week = 0
            avg_time_to_conversion_prgression_week = 0
            total_duration_prgression_week = 0
            avg_duration_prgression_week = 0
            query_count_prgression_week = 0
            total_visit_prgression_week = 0
        
        if last_day != 0:
            try:
                total_session_prgression_day = (total_session - last_day["total_session"]) / last_day["total_session"] * 100
            except:
                total_session_prgression_day = 0
            try:
                active_session_prgression_day = (active_session - last_day["active_session"]) / last_day["active_session"] * 100
            except:
                active_session_prgression_day = 0
            try:
                total_conversion_prgression_day = (total_conversion - last_day["total_conversion"]) / last_day["total_conversion"] * 100
            except:
                total_conversion_prgression_day = 0
            try:
                avg_time_to_conversion_prgression_day = (avg_time_to_conversion - last_day["avg_time_to_conversion"]) / last_day["avg_time_to_conversion"] * 100
            except:
                avg_time_to_conversion_prgression_day = 0
            try:
                total_duration_prgression_day = (total_duration - last_day["total_duration"]) / last_day["total_duration"] * 100
            except:
                total_duration_prgression_day = 0
            try:
                avg_duration_prgression_day = (avg_duration - last_day["avg_duration"]) / last_day["avg_duration"] * 100
            except:
                avg_duration_prgression_day = 0
            try:
                query_count_prgression_day = (query_count - last_day["query_count"]) / last_day["query_count"] * 100
            except:
                query_count_prgression_day = 0
            try:
                total_visit_prgression_day = (total_visit - last_day["total_visit"]) / last_day["total_visit"] * 100
            except:
                total_visit_prgression_day = 0
        else:
            total_session_prgression_day = 0
            active_session_prgression_day = 0
            total_conversion_prgression_day = 0
            avg_time_to_conversion_prgression_day = 0
            total_duration_prgression_day = 0
            avg_duration_prgression_day = 0
            query_count_prgression_day = 0
            total_visit_prgression_day = 0

        # if total_duration > :
        #     total_duration = 6000
        #     avg_duration = 6000 / total_session
        return {"total_session":total_session,"active_session":active_session,"total_conversion":total_conversion,"avg_time_to_conversion":avg_time_to_conversion,"total_duration":total_duration,"avg_duration":avg_duration,"total_session_prgression":total_session_prgression,"active_session_prgression":active_session_prgression,"total_conversion_prgression":total_conversion_prgression,"avg_time_to_conversion_prgression":avg_time_to_conversion_prgression,"total_duration_prgression":total_duration_prgression,"avg_duration_prgression":avg_duration_prgression,"total_session_prgression_week":total_session_prgression_week,"active_session_prgression_week":active_session_prgression_week,"total_conversion_prgression_week":total_conversion_prgression_week,"avg_time_to_conversion_prgression_week":avg_time_to_conversion_prgression_week,"total_duration_prgression_week":total_duration_prgression_week,"avg_duration_prgression_week":avg_duration_prgression_week,"total_session_prgression_day":total_session_prgression_day,"active_session_prgression_day":active_session_prgression_day,"total_conversion_prgression_day":total_conversion_prgression_day,"avg_time_to_conversion_prgression_day":avg_time_to_conversion_prgression_day,"total_duration_prgression_day":total_duration_prgression_day,"avg_duration_prgression_day":avg_duration_prgression_day,"query_count":query_count,"query_count_prgression":query_count_prgression,"query_count_prgression_week":query_count_prgression_week,"query_count_prgression_day":query_count_prgression_day,"total_visit":total_visit,"total_visit_prgression":total_visit_prgression}
    except:
        return {"totoal_session":0,"active_session":0,"total_conversion":0,"avg_time_to_conversion":0,"total_duration":0,"avg_duration":0,"total_session_prgression":0,"active_session_prgression":0,"total_conversion_prgression":0,"avg_time_to_conversion_prgression":0,"total_duration_prgression":0,"avg_duration_prgression":0,"total_session_prgression_week":0,"active_session_prgression_week":0,"total_conversion_prgression_week":0,"avg_time_to_conversion_prgression_week":0,"total_duration_prgression_week":0,"avg_duration_prgression_week":0,"total_session_prgression_day":0,"active_session_prgression_day":0,"total_conversion_prgression_day":0,"avg_time_to_conversion_prgression_day":0,"total_duration_prgression_day":0,"avg_duration_prgression_day":0,"query_count":0,"query_count_prgression":0,"query_count_prgression_week":0,"query_count_prgression_day":0,"total_visit":0,"total_visit_prgression":0}

    
    #return {"last_month":last_month,"last_week":last_week,"last_day":last_day}


#function to get peak hours of a chatbot by analyzing the session_info created_at
def get_peak_hours(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"]
    documents = db[subdomain].find({})
    peak_hours = {}
    for document in documents:
            created_at = document["created_at"]
            hour = created_at.hour
            if hour not in peak_hours:
                peak_hours[hour] = 0
            peak_hours[hour] += 1

    #calculate range of peak hour  from peak_hours
    peak_hours_range = []
    for key in peak_hours:
        peak_hours_range.append(peak_hours[key])
    peak_hours_range.sort()
    peak_hours_range = peak_hours_range[-1] - peak_hours_range[0]

    return peak_hours 

#get all chatbot of a account
def get_all_chatbot_session(chatbot):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"] 
    # Retrieve all documents in the specified subdomain
    session_info_with_ids = []
    for bot in chatbot:
        subdomain = bot.bot_id
        if subdomain:
            documents = db[subdomain].find({})
            for document in documents:
                #check if session_info have more than 1 element
                session_info_list = document.get("session_info", [])
                if len(session_info_list) > 1:
                    document_id = str(document.get("_id", None))
                    document_id = str(document.get("_id", None))  # Get the _id and convert it to a string
                    session_info_with_ids.append({"_id": document_id, "chatbot_id": bot.id})

    return session_info_with_ids



#function to get all chatbot session by subdomain
def get_all_session_by_subdomain(subdomain):
    client = MongoClient(settings.MONGO_URL)
    db = client["Bots"] 
    # Retrieve all documents in the specified subdomain
    documents = db[subdomain].find({})

    session_info_with_ids = []

    for document in documents:
        session_info_list = document.get("session_info", [])
        document_id = str(document.get("_id", None))  # Get the _id and convert it to a string
        #check if session_info have more than 2 element
        if len(session_info_list) > 1:
            #session_info_with_ids.append({"_id": document_id, "session_info": session_info_list})
            for session_info in session_info_list:
                # Calculate the duration
                first_timestamp = session_info_list[0]["timestamp"]
                last_timestamp = session_info_list[-1]["timestamp"]
                duration = last_timestamp - first_timestamp
            
                # Check if the last timestamp is older than now
                status = "active" if last_timestamp < datetime.datetime.utcnow() else "inactive"
                #check if session have information and analytic
                information = document.get("information", None)
                analytic = document.get("analytic", None)
                if not information and not analytic:
                    session_info_with_ids.append({"_id": document_id, "session_info": session_info})

    return session_info_with_ids
   

