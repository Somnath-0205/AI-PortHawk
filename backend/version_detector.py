import re

def detect_version(service, banner, web_server):

    text = f"{banner} {web_server}"

    version = ""

    patterns = [

        r'Apache\/([\d\.]+)',

        r'nginx\/([\d\.]+)',

        r'Werkzeug\/([\d\.]+)',

        r'Python\/([\d\.]+)',

        r'OpenSSH[_\/]([\d\.p]+)',

        r'MySQL[\s\/]?([\d\.]+)',

        r'Redis[\s\/]?([\d\.]+)',

        r'PostgreSQL[\s\/]?([\d\.]+)',

        r'Microsoft-IIS\/([\d\.]+)',

        r'Tomcat\/([\d\.]+)'
    ]

    for pattern in patterns:

        match = re.search(pattern, text, re.IGNORECASE)

        if match:

            version = match.group(1)

            break

    return version