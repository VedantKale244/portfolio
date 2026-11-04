import http.server
import socketserver
import os
import mimetypes

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/javascript', '.mjs')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('audio/mpeg', '.mp3')
mimetypes.add_type('image/x-icon', '.ico')
mimetypes.add_type('application/wasm', '.wasm')
mimetypes.add_type('application/zip', '.zip')

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def do_GET(self):
        # Root / and /office both serve SPA index.html
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
            return super().do_GET()

        clean_path = self.path.split('?')[0]
        full_path = os.path.join(DIRECTORY, clean_path.lstrip('/'))

        # If it's a file that exists, serve it
        if os.path.isfile(full_path):
            return super().do_GET()

        # Only fallback to index.html for SPA routes (e.g. /office), never for missing static files
        ext = os.path.splitext(clean_path)[1].lower()
        if not ext or clean_path.startswith('/office'):
            self.path = '/index.html'
            return super().do_GET()

        self.send_error(404, f"File not found: {self.path}")

if __name__ == '__main__':
    # Allow port reuse immediately and serve concurrently with multi-threading
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(('127.0.0.1', PORT), SPAHandler) as httpd:
        httpd.daemon_threads = True
        print(f"Windows XP Office Portfolio running at http://127.0.0.1:{PORT}/office")
        httpd.serve_forever()
