var event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
        'dateTime': '2022-06-28T09:00:00-07:00',
        // 'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': '2015-05-28T17:00:00-07:00',
        // 'timeZone': 'America/Los_Angeles'
    },
    'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
        { 'email': 'lpage@example.com' },
        { 'email': 'sbrin@example.com' }
    ],
    'reminders': {
        'useDefault': false,
        'overrides': [
            { 'method': 'email', 'minutes': 24 * 60 },
            { 'method': 'popup', 'minutes': 10 }
        ]
    }
};

var request = gapi.client.calendar.events.insert({
    'calendarId': 'ro6naq38vpeaek82hemruejb6c@group.calendar.google.com',
    'resource': event
});

request.execute(function (event) {
    appendPre('Event created: ' + event.htmlLink);
});