import socket
import re


def fingerprint_http(host, port):

    result = {
        "server": "",
        "framework": "",
        "language": "",
        "technologies": []
    }

    try:

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        sock.settimeout(2)

        sock.connect((host, port))

        request = (
            f"GET / HTTP/1.1\r\n"
            f"Host: {host}\r\n"
            f"User-Agent: AI-PortHawk\r\n"
            f"Connection: close\r\n\r\n"
        )

        sock.send(request.encode())

        response = sock.recv(65535).decode(errors="ignore")

        sock.close()

    except Exception:

        return None

    headers = response.split("\r\n")

    html = response.lower()

    for header in headers:

        if header.lower().startswith("server:"):

            result["server"] = header.replace("Server:", "").strip()

        elif header.lower().startswith("x-powered-by:"):

            result["language"] = header.replace("X-Powered-By:", "").strip()

    technologies = {

        "wordpress": "WordPress",

        "laravel": "Laravel",

        "django": "Django",

        "flask": "Flask",

        "react": "React",

        "angular": "Angular",

        "vue": "Vue.js",

        "bootstrap": "Bootstrap",

        "jquery": "jQuery",

        "node.js": "NodeJS",

        "express": "Express",

        "php": "PHP"

    }

    for key, value in technologies.items():

        if key in html:

            result["technologies"].append(value)

    return result