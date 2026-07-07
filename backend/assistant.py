from knowledge import CYBER_KNOWLEDGE

def ask_ai(question, scan_result=None):

    question = question.lower()

    # ------------------------
    # Scan Related
    # ------------------------

    if "threat" in question:

        return {
            "answer":
            "Threat Score depends on exposed services and vulnerabilities."
        }

    if "open port" in question:

        return {
            "answer":
            f"There are {len(scan_result)} open ports."
        }

    # ------------------------
    # Cyber Knowledge
    # ------------------------

    for key in CYBER_KNOWLEDGE:

        if key in question:

            return {

                "answer": CYBER_KNOWLEDGE[key]

            }

    # ------------------------
    # Unknown
    # ------------------------

    return {

        "answer":
        "I don't have enough local knowledge to answer this. Connect me to OpenAI or Search the Web."

    }