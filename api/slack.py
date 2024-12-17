from slackeventsapi import SlackEventAdapter
from slack_sdk.web import WebClient
import os

# Initialize the event adapter and web client
slack_signing_secret = os.environ["SLACK_SIGNING_SECRET"]
slack_events_adapter = SlackEventAdapter(slack_signing_secret, "/slack/events")
slack_client = WebClient(token=os.environ["SLACK_BOT_TOKEN"])

# Handle message events
@slack_events_adapter.on("message")
def handle_message(event_data):
    event = event_data["event"]
    user = event["user"]
    channel = event["channel"]
    # Update user activity in your database
    update_user_activity(user, "message", channel)

# Handle reaction added events
@slack_events_adapter.on("reaction_added")
def handle_reaction(event_data):
    event = event_data["event"]
    user = event["user"]
    reaction = event["reaction"]
    # Update user activity in your database
    update_user_activity(user, "reaction", reaction)

# Function to update user activity in your database
def update_user_activity(user, activity_type, details):
    # Implement your database update logic here
    print(f"User {user} performed {activity_type}: {details}")

# Start the server
if __name__ == "__main__":
    slack_events_adapter.start(port=3000)