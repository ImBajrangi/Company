#!/usr/bin/env python3
"""
https-gateway.py

Start a local HTTP server serving the workspace (auto-detect `kitchen.html`) and
open an HTTPS-accessible tunnel using `pyngrok` (preferred) or the `ngrok` binary.

Usage (csh):
  python3 https-gateway.py

Requirements for automatic HTTPS tunnel:
- Preferred: install Python package `pyngrok` (`pip install pyngrok`) and have ngrok binary available or let pyngrok manage it.
- Fallback: install `ngrok` binary and ensure it's on PATH.

The script will print the public HTTPS URL and write `gateway.html` into the
served directory so you can open it on mobile.
"""
import os
import socket
import http.server
import socketserver
import threading
import time
import json
import urllib.request
import subprocess
import webbrowser


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        return s.getsockname()[0]
    except Exception:
        return '127.0.0.1'
    finally:
        s.close()


def find_file_in_tree(filename, root='.'):
    for dirpath, dirnames, filenames in os.walk(root):
        if filename in filenames:
            return os.path.abspath(dirpath)
    return None


def write_gateway_html(public_base, out_path='gateway.html'):
    content = f"""
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Open on Mobile (HTTPS)</title>
  <style>body{{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc}}.card{{background:#fff;padding:20px;border-radius:12px;box-shadow:0 6px 18px rgba(2,6,23,.06);max-width:520px;width:100%;text-align:center}}a.button{{display:inline-block;margin-top:12px;background:#0ea5e9;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none}}</style>
</head>
<body>
  <div class="card">
    <h1>Open on Mobile (HTTPS)</h1>
    <p style="color:#475569">Use the secure link below to open the kitchen page.</p>
    <a class="button" href="{public_base}/kitchen.html">{public_base}/kitchen.html</a>
    <p style="color:#94a3b8;margin-top:12px;font-size:13px">If the link doesn't work, ensure the tunnel process is running on your machine.</p>
  </div>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(content)


def start_local_server(serve_dir, port=8000):
    os.chdir(serve_dir)
    handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.ThreadingTCPServer(('0.0.0.0', port), handler)

    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd


def start_pyngrok_tunnel(port):
    try:
        from pyngrok import ngrok
    except Exception:
        return None
    # create http tunnel, pyngrok will prefer https endpoint
    tunnel = ngrok.connect(port, "http")
    return tunnel.public_url if tunnel else None


def start_ngrok_binary(port):
    # Start ngrok as subprocess. ngrok exposes local API on http://127.0.0.1:4040
    try:
        proc = subprocess.Popen(['ngrok', 'http', str(port), '--log', 'stdout'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        return None

    # Wait for local API to become available
    api_url = 'http://127.0.0.1:4040/api/tunnels'
    for _ in range(30):
        try:
            with urllib.request.urlopen(api_url, timeout=2) as resp:
                data = json.load(resp)
                for t in data.get('tunnels', []):
                    if t.get('proto') in ('https', 'http'):
                        return t.get('public_url')
        except Exception:
            time.sleep(0.5)
    return None


def find_free_port(preferred=8000):
    port = preferred
    for i in range(20):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
                return port
        except OSError:
            port += 1
    raise RuntimeError('No free ports found')


def main():
    cwd = os.getcwd()
    kitchen_dir = find_file_in_tree('kitchen(modified).html', root=cwd)
    if kitchen_dir:
        serve_dir = kitchen_dir
    else:
        serve_dir = cwd

    port = find_free_port(8000)
    print('Serving directory:', serve_dir)
    httpd = start_local_server(serve_dir, port=port)

    print('Local HTTP server running on port', port)

    public_url = None
    # Try pyngrok first
    print('Trying to create HTTPS tunnel via pyngrok...')
    public_url = start_pyngrok_tunnel(port)

    if not public_url:
        print('pyngrok unavailable or failed, trying local ngrok binary...')
        public_url = start_ngrok_binary(port)

    if not public_url:
        print('\nCould not create HTTPS tunnel automatically.')
        print('Options:')
        print('- Install pyngrok: `pip install pyngrok` and run again')
        print('- Install ngrok binary and add to PATH: https://ngrok.com/download')
        print('- Or run `https-gateway.py` on a machine with ngrok access')
        print('\nGateway is running locally; you can still open it on this machine at:')
        print(f'  http://127.0.0.1:{port}/gateway.html')
        try:
            webbrowser.open(f'http://127.0.0.1:{port}/gateway.html')
        except Exception:
            pass
        return

    # Ensure public_url uses https
    if public_url.startswith('http://'):
        public_base = public_url.replace('http://', 'https://', 1)
    else:
        public_base = public_url

    # Write gateway.html into served dir pointing at public URL
    gateway_path = os.path.join(serve_dir, 'gateway.html')
    write_gateway_html(public_base, out_path=gateway_path)

    print('\nPublic HTTPS URL:')
    print(f'  {public_base}/kitchen.html')
    print('\nGateway page written to:', gateway_path)
    try:
        webbrowser.open(public_base + '/gateway.html')
    except Exception:
        pass

    print('\nPress Ctrl+C to stop (this will shut down the local server and the tunnel if managed).')
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print('\nStopping...')
        try:
            httpd.shutdown()
        except Exception:
            pass


if __name__ == '__main__':
    main()
