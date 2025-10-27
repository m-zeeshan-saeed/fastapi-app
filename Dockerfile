FROM python:3.11.14-slim


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


WORKDIR /code


RUN apt-get update && apt-get install -y build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*


COPY ./requirements.txt /code/requirements.txt


RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir  -r /code/requirements.txt

COPY ./app /code/app

EXPOSE 8000

CMD [ "uvicorn", "run", "app/main.py","--host","0.0.0.0","--port","8000","--reload" ]
