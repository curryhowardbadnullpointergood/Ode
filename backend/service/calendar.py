from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.auth import exceptions
from googleapiclient.discovery import build
import os
from google_auth_oauthlib.flow import InstalledAppFlow
import datetime

ADMIN_SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid']
USER_SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid']


def get_service(creds):
    """
    Get Google service with credentials
    """
    try:
        oauth2_service = build('oauth2', 'v2', credentials=creds)
        return oauth2_service
    except Exception as e:
        print(f"Error creating service: {e}")
        return None


def get_calendar_service(creds_dict):
    """
    Get Google Calendar service with credentials
    """
    try:
        print("Received credentials:", creds_dict)

        if isinstance(creds_dict, str):
            import json
            creds_dict = json.loads(creds_dict)
            print("Parsed JSON credentials")

        if isinstance(creds_dict, dict):
            print("Creating Credentials object from dictionary")
            creds = Credentials(
                token=creds_dict['token'],
                refresh_token=creds_dict['refresh_token'],
                token_uri=creds_dict['token_uri'],
                client_id=creds_dict['client_id'],
                client_secret=creds_dict['client_secret'],
                scopes=creds_dict['scopes']
            )
            print("Successfully created Credentials object")
        else:
            creds = creds_dict

        print("Building calendar service")
        calendar_service = build('calendar', 'v3', credentials=creds)
        print("Successfully built calendar service")
        return calendar_service

    except Exception as e:
        print(f"Error in get_calendar_service: {e}")
        return None


def get_authorisation_from_user():
    return authenticate_google_account(USER_SCOPES)


def get_authorisation_from_admin():
    return authenticate_google_account(ADMIN_SCOPES)


def authenticate_google_account(SCOPES):
    """
    Authenticate a Google account with Google OAuth.
    :param SCOPES: scopes to authenticate with
    :return: Credentials
    """
    creds = None
    try:
        flow = InstalledAppFlow.from_client_secrets_file(
            os.environ.get("GOOGLE_OAUTH_CREDENTIALS"), SCOPES
        )
        import warnings
        with warnings.catch_warnings():
            warnings.filterwarnings('ignore', category=Warning)
            creds = flow.run_local_server(port=0)

        if creds:
            return creds, True
        else:
            print("Failed to get credentials")
            return None, True
    except Exception as e:
        print(f"Error getting credentials: {e}")
        return None, False


def get_authorized_email(creds):
    """
    Get authorized email.
    :param creds: Credentials
    :return: email in creds
    """
    try:
        service = get_service(creds)
        user_info = service.userinfo().get().execute()
        return user_info['email']
    except Exception as e:
        print(f"Error retrieving user info: {e}")
        return None


def verify_user_email(provided_email, creds):
    """
    Check if user's email is the same with Google account.
    :param provided_email: user's email
    :param creds: Credentials
    :return:
    """
    user_email = get_authorized_email(creds)
    if user_email == provided_email:
        print("Email matches the authorized Google account.")
        return True
    else:
        print(f"Email does not match the authorized Google account, provided: {provided_email}, authorized: {user_email}")
        return False


def get_calendar(creds, calendar_id):
    """
    Get User Calender.
    :param creds: Credentials
    :param calendar_id: user's email address
    :return: Calenders
    """
    service = get_calendar_service(creds)
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    events_result = service.events().list(
        calendarId=calendar_id, timeMin=now, maxResults=10, singleEvents=True, orderBy='startTime'
    ).execute()

    events = events_result.get('items', [])

    if not events:
        print(f'No upcoming events found for calendar {calendar_id}.')
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        print(f"{start} - {event['summary']}")

    return events


def create_event_in_calendar(creds, calendar_id, name, location, description, start_time, end_time):
    service = get_calendar_service(creds)
    event = {
        'summary': name,  # New Event from Python
        'location': location,  # 123 Event Location, London
        'description': description,  # A new event created via the Google Calendar API.
        'start': {
            'dateTime': start_time,  # 2025-02-20T09:00:00+00:00
            'timeZone': 'Europe/London',
        },
        'end': {
            'dateTime': end_time,  # 2025-02-20T10:00:00+00:00
            'timeZone': 'Europe/London',
        },
        'attendees': [
            # {'email': 'attendee@example.com'}
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    event = service.events().insert(
        calendarId=calendar_id,
        body=event
    ).execute()

    event_id = event['id']
    print(f'Event created: {event.get("htmlLink")}')

    return event_id


def add_attendee_to_event(creds, calendar_id, event_id, new_attendee_email):
    service = get_calendar_service(creds)
    event = service.events().get(calendarId=calendar_id, eventId=event_id).execute()

    attendees = event.get('attendees', [])

    attendees.append({'email': new_attendee_email})

    event['attendees'] = attendees

    updated_event = service.events().update(
        calendarId=calendar_id,
        eventId=event_id,
        body=event
    ).execute()

    print(f"Attendee added. Event updated: {updated_event.get('htmlLink')}")
