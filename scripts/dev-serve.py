#!/usr/bin/env python3
"""Static dev server that disables caching, so a normal browser refresh always
gets the freshly built files. Usage: python3 scripts/dev-serve.py <port> <dir>"""
import sys
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
directory = sys.argv[2] if len(sys.argv) > 2 else "."


class NoCacheHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


TCPServer.allow_reuse_address = True
with TCPServer(("", port), NoCacheHandler) as httpd:
    print(f"serving {directory} at http://localhost:{port}/ (no-cache)")
    httpd.serve_forever()
