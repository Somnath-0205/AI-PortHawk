import re

def parse_banner(banner, web_server):

    info = {
        "product": "",
        "version": "",
        "language": "",
        "framework": ""
    }

    text = f"{banner} {web_server}"

    # -------------------------
    # Werkzeug / Flask
    # -------------------------

    if "Werkzeug" in text:

        info["product"] = "Werkzeug"

        m = re.search(r"Werkzeug\/([\d\.]+)", text)

        if m:
            info["version"] = m.group(1)

        m = re.search(r"Python\/([\d\.]+)", text)

        if m:
            info["language"] = "Python " + m.group(1)

        info["framework"] = "Flask"

    # -------------------------
    # Apache
    # -------------------------

    elif "Apache" in text:

        info["product"] = "Apache"

        m = re.search(r"Apache\/([\d\.]+)", text)

        if m:
            info["version"] = m.group(1)

    # -------------------------
    # nginx
    # -------------------------

    elif "nginx" in text.lower():

        info["product"] = "Nginx"

        m = re.search(r"nginx\/([\d\.]+)", text)

        if m:
            info["version"] = m.group(1)

    # -------------------------
    # IIS
    # -------------------------

    elif "Microsoft-IIS" in text:

        info["product"] = "Microsoft IIS"

        m = re.search(r"Microsoft-IIS\/([\d\.]+)", text)

        if m:
            info["version"] = m.group(1)

    return info