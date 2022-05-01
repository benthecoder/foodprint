import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

import json

from twilio.rest import Client
from dotenv import load_dotenv

from readability import Document
from bs4 import BeautifulSoup
import requests
import re

os.environ["PYTHONUNBUFFERED"] = "1"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def ping():
    return "pong"


@app.get("/scrape")
def scrape_food(url: str = Query(..., description="URL of the food to scrape")):
    """
    Scrape recipes from a recipe link
    """

    recipe = extract_info(url)

    return recipe


@app.post("/subscribe")
def subscribe(phone: str = Query(..., description="Phone number to subscribe")):

    to_phone = phone
    message = """
    Here's your green recipe of the day: vegan alfredo

    https://www.foodnetwork.com/kitchen/classes/vegan-alfredo_f2ac082b-d87b-4741-a5b3-32be7d267f29
    """

    client = init_twilio()

    try:
        send_message(to_phone, message)
    except Exception as e:
        print(f"Exception caught: {e}")

    return "successfully subscribed!"


def getHTMLdocument(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
    }

    # request for HTML document of given url
    response = requests.get(url, headers=headers)

    # response will be provided in JSON format
    return response.text


def text_from_html(body):
    soup = BeautifulSoup(body, "html.parser")
    text = soup.getText()
    text = re.sub(r"\n+", "\n", text.strip())

    return text


def get_ingredients_name(recipe):

    ingredients = set()

    with open("app/data/mappings.json", "r") as f:
        mappings = json.load(f)
        for _, recipe in enumerate(recipe):
            for key, value in mappings.items():
                for i, v in enumerate(value):
                    if re.search(v, recipe, re.IGNORECASE):
                        ingredients.add(key)

    return ingredients


def get_ingredients(text):

    # similarity search (grab all food text)

    # https://github.com/nytimes/ingredient-phrase-tagger

    # convert to KG
    # ex: [(beef, 0.1), (chicken, 0.1)]
    text = text.replace("\xa0", " ")
    text = text.replace("MARINADE:", "")
    text = text.replace("GARNISHES:", "")
    start = text.find("Ingredients")

    end = text.find("Directions")

    text = text[start:end]
    text = text.replace("  ", "")
    text = text.split("\n")[2:-3]
    text = list(filter(None, text))

    return get_ingredients_name(text)


def get_food_foodprint(ingredients):

    with open("app/data/food-footprints.json") as f:
        d = json.load(f)

        filtered_d = {k: v for (k, v) in d.items() if k in ingredients}

    return filtered_d


def extract_info(url):

    html = getHTMLdocument(url)

    doc = Document(html)
    title = doc.short_title()

    text = text_from_html(html)
    ingredients = get_ingredients(text)
    foodprint = get_food_foodprint(ingredients)

    return (title, foodprint)


def init_twilio():
    """
    Initialize twilio client
    Find your Account SID and Auth Token at twilio.com/console
    """
    load_dotenv()
    ACCOUNT_SID = os.getenv("ACCOUNT_SID")
    AUTH_TOKEN = os.getenv("AUTH_TOKEN")
    client = Client(ACCOUNT_SID, AUTH_TOKEN)

    return client


def send_message(to_phone: str, message: str) -> str:

    client = init_twilio()

    # twilio acc phone number
    from_phone = "+15154979533"

    try:
        message = client.messages.create(body=message, from_=from_phone, to=to_phone)
    except Exception as err:
        print(f"Exception caught: {err}")

    return "message successfully sent!"
