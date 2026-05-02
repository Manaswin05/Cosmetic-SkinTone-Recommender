"""Gunicorn configuration for Render deployment"""

import multiprocessing
import os

# Render injects $PORT — default to 5000 for local dev
port = os.environ.get("PORT", "5000")
bind = f"0.0.0.0:{port}"

# Workers
workers = 2
worker_class = "sync"
timeout = 120
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
