def detect_cloud(headers):

    if not headers:
        return "Unknown"

    text = headers.lower()

    if any(x in text for x in [
        "cloudflare",
        "cf-ray",
        "cf-cache-status",
        "cloudflare-nginx"
    ]):
        return "Cloudflare"

    if any(x in text for x in [
        "amazon",
        "aws",
        "amazonaws",
        "amz"
    ]):
        return "AWS"

    if any(x in text for x in [
        "azure",
        "microsoft-azure",
        "x-ms-",
        "azureedge"
    ]):
        return "Microsoft Azure"

    if any(x in text for x in [
        "google",
        "gcp",
        "gws",
        "googleusercontent",
        "goog"
    ]):
        return "Google Cloud"

    if any(x in text for x in [
        "digitalocean",
        "do-spaces"
    ]):
        return "DigitalOcean"

    if "akamai" in text:
        return "Akamai"

    if "fastly" in text:
        return "Fastly"

    if "vercel" in text:
        return "Vercel"

    if "netlify" in text:
        return "Netlify"

    if "heroku" in text:
        return "Heroku"

    return "Unknown"