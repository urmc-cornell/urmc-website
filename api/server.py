from flask import Flask, request
import json

def create_server():
    app = Flask(__name__)
    
    # Add a basic health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}, 200

    # Optional: Add a custom endpoint for other Slack interactions
    @app.route('/slack/interactive', methods=['POST'])
    def handle_interactive():
        data = request.form.get('payload')
        if data:
            payload = json.loads(data)
            # Handle your interactive components here
            return {'status': 'ok'}, 200
        return {'status': 'error', 'message': 'No payload received'}, 400

    return app 