# Use Python 3.11 (explicit)
FROM python:3.11-slim

# Cache buster to force rebuild (update: 2026-10-07-utf8fix)
ARG CACHEBUST=20261007utf8

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8001

# Start command
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
