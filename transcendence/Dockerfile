# Use the official Python base image
FROM python:3.10-slim

# Set environment variables to prevent Python from writing .pyc files to disc
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt /app/

# Install system dependencies (PostgreSQL client if needed)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies from requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the Django app source code to the container
COPY . /app/

# Expose port 8000 to the outside world
EXPOSE 8000

# Run Django migration and start the app
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver localhost:8000"]
