CVE_DATABASE = {

    "Apache": [

        {
            "version": "2.4.49",
            "cve": "CVE-2021-41773",
            "cvss": 9.8,
            "risk": "Critical",
            "description": "Path Traversal Remote Code Execution"
        },

        {
            "version": "2.4.49",
            "cve": "CVE-2021-42013",
            "cvss": 9.8,
            "risk": "Critical",
            "description": "Remote Code Execution"
        }

    ],

    "OpenSSH":[

        {
            "version":"7.2",
            "cve":"CVE-2016-0777",
            "cvss":7.5,
            "risk":"High",
            "description":"Information Disclosure"
        }

    ],

    "MySQL":[

        {
            "version":"5.7",
            "cve":"CVE-2016-6662",
            "cvss":8.8,
            "risk":"High",
            "description":"Privilege Escalation"
        }

    ],

    "nginx":[

        {
            "version":"1.16",
            "cve":"CVE-2019-20372",
            "cvss":6.5,
            "risk":"Medium",
            "description":"HTTP Request Smuggling"
        }

    ]

}


def lookup_cves(service_name, version):

    findings=[]

    if service_name not in CVE_DATABASE:

        return findings

    for item in CVE_DATABASE[service_name]:

        if version.startswith(item["version"]):

            findings.append(item)

    return findings