from flask import Flask, request, jsonify, send_from_directory
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Mail configuration
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.getenv('EMAIL_USER'),
    MAIL_PASSWORD=os.getenv('EMAIL_PASSWORD'),
    MAIL_DEFAULT_SENDER=os.getenv('EMAIL_USER')
)

# Log mail configuration (without sensitive data)
logger.info(f"Mail Configuration: SERVER={app.config['MAIL_SERVER']}, PORT={app.config['MAIL_PORT']}, TLS={app.config['MAIL_USE_TLS']}")
logger.info(f"Using email account: {app.config['MAIL_USERNAME']}")

mail = Mail(app)

# Enable CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def send_file(path):
    return send_from_directory('.', path)

@app.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        logger.info(f"Received email request with data: {data}")

        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not all([name, email, subject, message]):
            logger.error("Missing required fields in email request")
            return jsonify({'error': 'All fields are required'}), 400

        # Create email message
        msg = Message(
            subject=f'Neue Kontaktanfrage: {subject}',
            recipients=['info@scheiermann-it.de'],
            body=f'''
            Neue Kontaktanfrage von der Website:
            
            Name: {name}
            Email: {email}
            Betreff: {subject}
            
            Nachricht:
            {message}
            ''',
            reply_to=email
        )

        logger.info("Attempting to send email...")
        # Send email
        mail.send(msg)
        logger.info("Email sent successfully!")
        return jsonify({'message': 'Email sent successfully'}), 200

    except Exception as e:
        logger.error(f"Error sending email: {str(e)}", exc_info=True)
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
