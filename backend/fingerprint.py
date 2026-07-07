import re

def fingerprint_service(port, service, banner, web_server):

    info = {
        "service_name": service,
        "version": "",
        "framework": "",
        "language": "",
        "risk": "Low"
    }

    text = f"{banner} {web_server}".lower()

    # Flask
    if "werkzeug" in text:
        info["service_name"] = "Flask Development Server"

        m = re.search(r'Werkzeug\/([\d\.]+)', web_server)
        if m:
            info["version"] = m.group(1)

        m = re.search(r'Python\/([\d\.]+)', web_server)
        if m:
            info["language"] = "Python " + m.group(1)

        info["framework"] = "Flask"
        info["risk"] = "Medium"

    # Apache
    elif "apache" in text:

        info["service_name"] = "Apache HTTP Server"

        m = re.search(r'Apache\/([\d\.]+)', web_server)
        if m:
            info["version"] = m.group(1)

        info["risk"] = "Medium"

    # Nginx
    elif "nginx" in text:

        info["service_name"] = "Nginx"

        m = re.search(r'nginx\/([\d\.]+)', web_server)
        if m:
            info["version"] = m.group(1)

    # IIS
    elif "iis" in text:

        info["service_name"] = "Microsoft IIS"

    # Tomcat
    elif "tomcat" in text:

        info["service_name"] = "Apache Tomcat"

    # MySQL
    elif "mysql" in text:

        info["service_name"] = "MySQL"

    # MongoDB
    elif "mongodb" in text:

        info["service_name"] = "MongoDB"

    # Redis
    elif "redis" in text:

        info["service_name"] = "Redis"

    # PostgreSQL
    elif "postgres" in text:

        info["service_name"] = "PostgreSQL"

    # SSH
    elif "openssh" in text:

        info["service_name"] = "OpenSSH"

        m = re.search(r'OpenSSH[_\/]([\d\.p]+)', banner)
        if m:
            info["version"] = m.group(1)

    return info