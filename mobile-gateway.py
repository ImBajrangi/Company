#!/usr/bin/env python3
"""
mobile-gateway.py

Start a simple static HTTP server serving the current workspace and
generate `gateway.html` with a QR code and clickable link to `kitchen.html`.

Usage (csh):
  python3 mobile-gateway.py

Open on your phone (same Wi‑Fi): http://<LOCAL_IP>:8000/gateway.html
"""
import http.server
import socketserver
import socket
import sys
import os
import urllib.parse
import webbrowser


def get_local_ip():
    """Return the local IP address used to reach the internet."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't actually connect; used to pick the right interface
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


def write_gateway_html(base_url, out_path='gateway.html'):
    """Create a simple gateway HTML containing the link and QR image.

    Uses Google Chart API for QR so no extra Python deps are required.
    """
    # We'll generate the QR client-side using a small JS library and provide a fallback
    # copyable link in case the QR library is blocked.
    content = f"""
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Open on Mobile</title>
    <style>
        body{{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;display:flex;flex-direction:column;gap:18px;align-items:center;justify-content:center;height:100vh;margin:0;padding:24px;background:#f8fafc;color:#0f172a}}
        .card{{background:white;border-radius:12px;padding:20px;box-shadow:0 6px 18px rgba(2,6,23,.08);max-width:520px;width:100%;text-align:center}}
        a.button{{display:inline-block;margin-top:12px;background:#0ea5e9;color:white;padding:10px 14px;border-radius:8px;text-decoration:none}}
        img.qr{{width:260px;height:260px;object-fit:contain;border-radius:6px}}
        p.small{{color:#475569;font-size:14px;margin:0}}
        .fallback{{display:none;margin-top:12px}}
        .link-box{{background:#f1f5f9;padding:10px;border-radius:8px;word-break:anywhere}}
        button.copy-btn{{margin-left:8px;background:#0ea5e9;color:white;border:none;padding:8px 10px;border-radius:6px;cursor:pointer}}
    </style>
</head>
<body>
    <div class="card">
        <h1 style="margin:0 0 8px 0">Open on Mobile</h1>
        <p class="small">Scan the QR or tap the link to open the kitchen page on your phone (same Wi‑Fi).</p>
        <div id="qrcode" style="margin:14px 0">Generating QR…</div>
        <div id="fallback" class="fallback">
            <p class="small">QR not available. Use the link below or copy it manually:</p>
            <div class="link-box"><a id="direct-link" href="{base_url}">{base_url}</a>
            <button class="copy-btn" onclick="copyLink()">Copy</button></div>
        </div>
        <a class="button" id="open-link" href="{base_url}">{base_url}</a>
        <p class="small" style="margin-top:10px">If it doesn't load, ensure your phone is on the same network and firewall allows incoming connections to the chosen port.</p>
    </div>

    <!-- Try to load a small QR generator from CDN. If blocked, show fallback UI. -->
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
    <script>
        const url = '{base_url}';
        function showFallback(){{
            document.getElementById('qrcode').style.display = 'none';
            document.getElementById('fallback').style.display = 'block';
        }}
        function copyLink(){{
            if (navigator.clipboard && navigator.clipboard.writeText) {{
                navigator.clipboard.writeText(url).then(()=>{{ alert('Link copied to clipboard') }}).catch(()=>{{ showFallback() }});
            }} else {{
                // older fallback
                const el = document.createElement('textarea'); el.value = url; document.body.appendChild(el); el.select(); try {{ document.execCommand('copy'); alert('Link copied to clipboard'); }} catch(e){{ showFallback() }}; el.remove();
            }}
        }}
        function generateQR(){{
            if (window.QRCode && QRCode.toDataURL) {{
                QRCode.toDataURL(url, {{ width: 260, margin: 1 }}, function (err, dataUrl) {{
                    if (err) {{ showFallback(); return; }}
                    const img = document.createElement('img'); img.src = dataUrl; img.className = 'qr';
                    const container = document.getElementById('qrcode'); container.innerHTML = ''; container.appendChild(img);
                }});
            }} else {{
                showFallback();
            }}
        }}
        // Update direct link href/text just in case
        document.getElementById('direct-link').href = url;
        document.getElementById('open-link').href = url;
        window.addEventListener('load', generateQR);
    </script>
</body>
</html>
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(content)


def find_free_port(preferred=8000):
    port = preferred
    for i in range(10):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
                return port
        except OSError:
            port += 1
    raise RuntimeError('No free ports found in range')


def find_file_in_tree(filename, root='.'):
    """Search for the first occurrence of filename under root and return its directory.

    Returns absolute directory path or None if not found.
    """
    for dirpath, dirnames, filenames in os.walk(root):
        if filename in filenames:
            return os.path.abspath(dirpath)
    return None


def main():
    cwd = os.getcwd()
    ip = get_local_ip()
    port = find_free_port(8000)
    # Try to locate 'kitchen.html' in the workspace tree so we serve the correct directory
    kitchen_dir = find_file_in_tree('kitchen.html', root=cwd)
    if kitchen_dir:
        serve_dir = kitchen_dir
        rel_path = 'kitchen.html'
    else:
        # fallback: assume kitchen.html is in cwd
        serve_dir = cwd
        rel_path = 'kitchen.html'

    base_url = f'http://{ip}:{port}/{rel_path}'

    # Write gateway page into the directory we will serve so gateway.html is reachable
    gateway_path = os.path.join(serve_dir, 'gateway.html')
    write_gateway_html(base_url, out_path=gateway_path)

    print(f'\nGateway page written to: {gateway_path}')
    print('Serve directory:', serve_dir)
    print('Open on mobile (same Wi‑Fi):')
    print(f'  http://{ip}:{port}/gateway.html')
    print('\n(You can also scan the QR shown on that page.)\n')

    # Try to open the gateway page in the host browser
    try:
        webbrowser.open(f'http://127.0.0.1:{port}/gateway.html')
    except Exception:
        pass

    # Change working directory to the directory we want to serve
    try:
        os.chdir(serve_dir)
    except Exception as e:
        print('Failed to change directory to serve dir:', e)

    # Start static server bound to all interfaces so mobile can connect
    Handler = http.server.SimpleHTTPRequestHandler
    try:
        with socketserver.TCPServer(('0.0.0.0', port), Handler) as httpd:
            print(f'Serving HTTP on 0.0.0.0 port {port} (http://{ip}:{port}/) ...')
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print('\nServer stopped by user')
    except Exception as e:
        print('Failed to start server:', e)


if __name__ == '__main__':
    main()
