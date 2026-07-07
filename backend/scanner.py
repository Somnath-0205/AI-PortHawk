import socket
import ipaddress
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
import ssl
import time
from technology import fingerprint_http
from fingerprint import fingerprint_service
from banner_parser import parse_banner
from version_detector import detect_version
from cve_engine import lookup_cves
from cloud_detector import detect_cloud
from smb import smb_info


def connection(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)     

        result = sock.connect_ex((host, port))

        sock.close()

        if result == 0:
            print(f"[OPEN] Port {port}")
            return port
        else:
            return None

    except Exception:
        print(f"Error on {port}: {e}")
        return None

def banner_grab(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        sock.connect((host, port))
        banner = sock.recv(1024)
        sock.close()

        if banner:
            banner_text = banner.decode(errors="ignore")
            if banner_text.strip():
                return banner_text.strip()
            else:
                return "Binary Banner"
        return "No Banner"

    except socket.timeout:
        return "No Banner"
    except Exception:
        return "No Banner"

def http_banner(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        sock.connect((host, port))
        request = (
            f"GET / HTTP/1.1\r\n"
            f"Host: {host}\r\n"
            f"Connection: close\r\n\r\n"
        )
        sock.send(request.encode())
        response = sock.recv(4096)
        sock.close()

        response_text = response.decode(errors="ignore")
        lines = response_text.split("\n")
        for line in lines:
            if "Server:" in line:
                return line.replace("Server:", "").strip()

    except Exception:
        return ""

def ssl_inspection(host, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)

        context = ssl.create_default_context()

        secure_sock = context.wrap_socket(
            sock,
            server_hostname=host
        )

        secure_sock.connect((host, port))

        tls_version = secure_sock.version()
        cipher = secure_sock.cipher()
        certificate = secure_sock.getpeercert()

        issuer = ""
        common_name = ""
        for item in certificate["issuer"]:
            if item[0][0] == "organizationName":
                issuer = item[0][1]

        for item in certificate["subject"]:
            if item[0][0] == "commonName":
                common_name = item[0][1]
        
        secure_sock.close()
        return {"tls_version": tls_version, "cipher": cipher[0], "expiry_date": certificate['notAfter'],"issuer": issuer, "common_name": common_name, "is_self_signed": issuer == common_name, "is_expired": False, "key_algorithm": certificate.get("subjectPublicKeyInfo", "Unknown")}
    except Exception as e:
        return None

def docker_detection(host, port):

    try:
        sock=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        sock.settimeout(2)
        sock.connect((host,port))
        sock.send(b"GET /version HTTP/1.1\r\nHost: docker\r\n\r\n")
        response=sock.recv(65535).decode(errors="ignore")
        sock.close()
        info={
            "detected":False,
            "api_version":"",
            "docker_version":"",
            "os":""
        }
        if "ApiVersion" in response:
            info["detected"]=True
            import re
            api=re.search(r'"ApiVersion":"([^"]+)',response)
            ver=re.search(r'"Version":"([^"]+)',response)
            os=re.search(r'"Os":"([^"]+)',response)
            if api:
                info["api_version"]=api.group(1)
            if ver:
                info["docker_version"]=ver.group(1)
            if os:
                info["os"]=os.group(1)
        return info
    except:
        return None

def kubernetes_detection(host,port):

    try:
        sock=socket.socket()
        sock.settimeout(2)
        sock.connect((host,port))
        sock.send(b"GET /version HTTP/1.1\r\nHost:kube\r\n\r\n")
        response=sock.recv(65535).decode(errors="ignore")
        sock.close()
        info={
            "detected":False,
            "version":""
        }
        if "gitversion" in response.lower():
            info["detected"]=True
            m=re.search(r'"gitVersion":"([^"]+)',response)
            if m:
                info["version"]=m.group(1)
        return info
    except:
        return None

# def cve_mapping(service, banner, web_server):
#     try:
#         for software in CVE_DATABASE:
#             if software.lower() in banner.lower():
#                 return CVE_DATABASE[software]
#             elif software.lower() in web_server.lower():
#                 return CVE_DATABASE[software]
#         return None
#     except Exception:
#         return None

def reverse_dns(host):
    try:
        return socket.gethostbyaddr(host)[0]
    except:
        return "Unknown"

def host_discovery(host):
    DISCOVERY_PORTS = [80, 443, 22, 135, 139, 445, 3306]
    for port in DISCOVERY_PORTS: 
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        try:
            sock.connect((host, port))
            sock.close()
            return True

        except (socket.timeout, ConnectionRefusedError, OSError):
            sock.close()
            continue
    return False

def validate_target(target):

    try:
        ipaddress.ip_address(target)
        return target
    except ValueError:
        pass

    try:
        ip = socket.gethostbyname(target)
        return ip
    except socket.gaierror:
        return None

def scan_target(target_host, progress_callback=None):

    original_target = target_host

    resolved_ip = validate_target(target_host)

    if resolved_ip is None:

        return {

            "target": original_target,

            "ip": "-",

            "host_status": "Invalid Target",

            "hostname": "-",

            "target_type": "-",

            "total_open_ports": 0,

            "scan_time": 0,

            "scan_result": [],

            "error": "Invalid IP address or Domain Name."

        }

    target_host = resolved_ip

    try:

        ip = ipaddress.ip_address(target_host)

        if ip.is_private:
            target_type = "Private Network"
        else:
            target_type = "Public Internet"

    except:

        target_type = "Unknown"

    print(f"\nScanning {original_target}")
    print(f"Resolved IP : {target_host}")
    print(f"Target Type : {target_type}\n")
    host_alive = host_discovery(target_host)

    hostname = reverse_dns(target_host)

    if hostname == "Unknown":
        hostname = original_target
    print(f"Host_Name: {hostname}")
    start_time = time.time()
    
    
    future_list = []
    open_ports = []
    scan_result = []
    completed = 0
    TOTAL_PORTS = 65535
    HTTP_PORTS = [80,8080,8000,8888, 5000]
    HTTPS_PORTS = [443, 8443, 9443]
    KUBERNETES_PORTS = [6443, 10250, 10255, 10257, 10259, 2379, 2380]
    with ThreadPoolExecutor(max_workers=500) as executor:

        for port in range(1, 65536):
            future = executor.submit(connection, target_host, port)
            future_list.append(future)

        for future in as_completed(future_list):

            result = future.result()

            if result:

                open_ports.append(result)

                try:
                    service = socket.getservbyport(result)

                except Exception:
                    service = "Unknown Service"

                banner = banner_grab(target_host, result)

                web_server = ""

                technology_info = None

                cloud = "UNKNOWN"

                tls_info = None

                docker_info = None

                kubernetes_info = None

                cve_info = None

                smb = None

                if result in HTTP_PORTS:

                    web_server = http_banner(target_host, result)

                    cloud = detect_cloud(web_server)

                    technology_info = fingerprint_http(
                        target_host,
                        result
                    )

                if result in HTTPS_PORTS:

                    tls_info = ssl_inspection(target_host, result)

                if result in [2375, 2376]:

                    docker_info = docker_detection(
                        target_host,
                        result
                    )

                if result in KUBERNETES_PORTS:

                    kubernetes_info = kubernetes_detection(
                        target_host,
                        result
                    )

                if result == 445:

                    smb = smb_info(target_host)

                fingerprint = fingerprint_service(
                    result,
                    service,
                    banner,
                    web_server
                )

                banner_info = parse_banner(
                    banner,
                    web_server
                )

                version = detect_version(
                    service,
                    banner,
                    web_server
                )

                cve_info = lookup_cves(
                    fingerprint["service_name"],
                    version
                )

                scan_result.append({

                    "port": result,
                    "service": service,
                    "version": version,
                    "hostname": hostname,
                    "banner": banner,
                    "banner_info": banner_info,
                    "web_server": web_server,
                    "technology": technology_info,
                    "cloud": cloud,
                    "fingerprint": fingerprint,
                    "tls": tls_info,
                    "docker": docker_info,
                    "kubernetes": kubernetes_info,
                    "smb": smb,
                    "cves": cve_info

                })

            else:

                service = ""

            completed += 1

            if progress_callback:

                progress_callback({

                    "target": target_host,
                    "port": result,
                    "service": service,
                    "progress": int((completed / TOTAL_PORTS) * 100)

                })

        end_time = time.time()

        scan_time = round(end_time - start_time, 2)

        print()
        print("=" * 60)
        print("         AI-PortHawk Scan Completed")
        print("=" * 60)
        print(f"Host Status : {'Alive' if host_alive else 'Unknown'}")
        print(f"Hostname    : {hostname}")
        print(f"Open Ports  : {len(scan_result)}")
        print(f"Scan Time   : {scan_time} sec")
        print("=" * 60)

        return {
            "target": original_target,
            "ip": target_host,
            "target_type": target_type,
            "host_status": "Alive" if host_alive else "Unknown",
            "hostname": hostname,
            "total_open_ports": len(scan_result),
            "scan_time": scan_time,
            "scan_result": scan_result
        }

if __name__ == "__main__":
    scan_target("127.0.0.1")