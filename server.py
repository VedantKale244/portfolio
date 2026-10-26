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

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Redirect root to /office exactly like https://pauljaguin.com/office
        if self.path == '/' or self.path == '':
            self.send_response(302)
            self.send_header('Location', '/office')
            self.end_headers()
            return

        clean_path = self.path.split('?')[0]
        full_path = os.path.join(DIRECTORY, clean_path.lstrip('/'))

        # If it's a file that exists, serve it
        if os.path.isfile(full_path):
            return super().do_GET()

        # If it's /office or an SPA route, serve index.html
        self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    # Allow port reuse immediately
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', PORT), SPAHandler) as httpd:
        print(f"Windows XP Office Portfolio running at http://127.0.0.1:{PORT}/office")
        httpd.serve_forever()
