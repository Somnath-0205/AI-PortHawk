from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

def generate_report(data, filename="AI-PortHawk_Report.pdf"):

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>AI-PortHawk Security Report</b>", styles["Title"]))

    story.append(Paragraph(f"<b>Target:</b> {data.get('target','-')}", styles["BodyText"]))

    story.append(Paragraph(f"<b>Hostname:</b> {data.get('hostname','-')}", styles["BodyText"]))

    story.append(Paragraph(f"<b>Host Status:</b> {data.get('host_status','-')}", styles["BodyText"]))

    story.append(Paragraph(f"<b>Threat Score:</b> {data.get('threat_score',0)}%", styles["BodyText"]))

    story.append(Paragraph(f"<b>Total Open Ports:</b> {data.get('total_open_ports',0)}", styles["BodyText"]))

    story.append(Paragraph(f"<b>Scan Time:</b> {data.get('scan_time',0)} sec", styles["BodyText"]))

    story.append(Paragraph("<br/><b>Detected Vulnerabilities</b>", styles["Heading2"]))

    vulnerabilities = data.get("vulnerabilities", [])

    if len(vulnerabilities) == 0:

        story.append(
            Paragraph(
                "No vulnerabilities detected.",
                styles["BodyText"]
            )
        )

    else:

        for vuln in vulnerabilities:

            story.append(

                Paragraph(

                    f"• {vuln['title']} ({vuln['risk']})",

                    styles["BodyText"]

                )

            )

    story.append(Paragraph("<br/><b>Recommendations</b>", styles["Heading2"]))

    story.append(Paragraph("• Close unnecessary open ports.", styles["BodyText"]))

    story.append(Paragraph("• Update all exposed services.", styles["BodyText"]))

    story.append(Paragraph("• Enable Firewall.", styles["BodyText"]))

    story.append(Paragraph("• Perform regular vulnerability scans.", styles["BodyText"]))

    doc.build(story)

    return filename