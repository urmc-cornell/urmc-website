from dotenv import load_dotenv
load_dotenv()

from slack_sdk.web import WebClient
from slackeventsapi import SlackEventAdapter
from server import create_server
import os
import psycopg2
from flask import request
import logging

# Set up logging at the top of your file
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = create_server()

# Initialize the event adapter and web client
slack_signing_secret = os.environ["SLACK_SIGNING_SECRET"]
slack_events_adapter = SlackEventAdapter(slack_signing_secret, "/slack/events", app)
slack_client = WebClient(token=os.environ["SLACK_BOT_TOKEN"])

# Handle message events
@slack_events_adapter.on("message")
def handle_message(event_data):
    logger.info(f"Received message event: {event_data}")  # Log the entire event
    
    if "challenge" in event_data:
        return {"challenge": event_data["challenge"]}
        
    event = event_data["event"]
    # Skip messages from bots to prevent potential loops
    if "bot_id" in event:
        logger.info("Skipping bot message")
        return
    
    user = event["user"]
    channel = event["channel"]
    text = event.get("text", "")
    
    logger.info(f"Message from user {user} in channel {channel}: {text}")
    update_user_activity(user, "message", channel)

# Handle reaction added events
@slack_events_adapter.on("reaction_added")
def handle_reaction(event_data):
    logger.info(f"Received reaction event: {event_data}")  # Log the entire event
    
    event = event_data["event"]
    user = event["user"]
    reaction = event["reaction"]
    
    logger.info(f"Reaction {reaction} added by user {user}")
    update_user_activity(user, "reaction", reaction)

# Function to update user activity in your database
def update_user_activity(user, activity_type, details):
    try:
        # Get user info from Slack
        user_info = slack_client.users_info(user=user)
        student = user_info['user']['name']  # Get username from Slack API
        
        conn = psycopg2.connect(
            dbname=os.environ.get('DB_NAME'),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASSWORD'),
            host=os.environ.get('DB_HOST')
        )
        cur = conn.cursor()

        print(student)
        # insert points into person named column1
        upsert_query = """
            INSERT INTO points_table (column2, column3)
            VALUES (%s, 0)
            ON CONFLICT (column2) 
            DO NOTHING
        """
        cur.execute(upsert_query, (student,))

        # Modified update query to use student_name
        points = 2 if activity_type == "message" else 1
        update_query = """
            UPDATE points_table 
            SET column3 = column3 + %s 
            WHERE column2 = %s
        """
        cur.execute(update_query, (points, student))
        
        conn.commit()
        logger.info(f"Successfully updated points for {student}")
        
    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

    print(f"User {user} performed {activity_type}: {details}")

# Helper function to get user points
def get_user_points(user_id):
    try:
        # Get username from Slack API
        user_info = slack_client.users_info(user=user_id)
        student = user_info['user']['name']
        
        conn = psycopg2.connect(
            dbname=os.environ.get('DB_NAME'),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASSWORD'),
            host=os.environ.get('DB_HOST')
        )
        cur = conn.cursor()
        
        query = """
            SELECT column1, column3 
            FROM points_table 
            WHERE column1 = %s
        """
        cur.execute(query, (student,))
        result = cur.fetchone()
        
        return result if result else (student, 0)
        
    except Exception as e:
        logger.error(f"Error: {e}")
        return None, 0
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

@app.route("/slack/events", methods=["POST"])
def slack_challenge():
    # Get the request data as JSON
    data = request.get_json()
    
    # Check if this is a challenge request
    if "challenge" in data:
        # Return the challenge value with proper Flask response
        return data["challenge"]
    
    # For other events, let the slack_events_adapter handle it
    return "", 200

# Start the server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host='0.0.0.0', port=port)

print("Database settings:")
print(f"DB_NAME: {os.environ.get('DB_NAME')}")
print(f"DB_HOST: {os.environ.get('DB_HOST')}")
print(f"DB_USER: {os.environ.get('DB_USER')}")