FROM python:3.9

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --worker-class uvicorn.workers.UvicornWorker  --threads 8 app.main:app
