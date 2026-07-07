import socket

def smb_info(host):

    try:

        sock=socket.socket()

        sock.settimeout(2)

        sock.connect((host,445))

        sock.send(b"\x00")

        sock.close()

        return{

            "service":"SMB",

            "reachable":True,

            "note":"SMB Port Accessible"

        }

    except:

        return None