import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_gemini(

    question,

    scan_result,

    threat_score,

    vulnerabilities

):

    prompt = f"""
You are AI-PortHawk.

You are an expert Cyber Security Analyst.

Analyze the user's scan before answering.

Current Scan

Threat Score:
{threat_score}

Open Ports:
{scan_result}

Detected Vulnerabilities:
{vulnerabilities}

Rules

- If the question is about the scan,
  answer ONLY using the scan.

- Explain why something is risky.

- Suggest mitigation.

- Be concise.

User Question

{question}
"""

    response = model.generate_content(prompt)

    return response.text