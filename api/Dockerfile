FROM python:3.9

ENV PORT 8080
ENV APP_HOME /app
ENV PYTHONPATH /app
WORKDIR $APP_HOME
COPY . ./

RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --worker-class uvicorn.workers.UvicornWorker  --threads 8 app.main:app