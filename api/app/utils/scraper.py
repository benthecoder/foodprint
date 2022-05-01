from readability import Document
from bs4 import BeautifulSoup
import requests
import re


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


def get_recipe_from_text(text):

    # similarity search (grab all food text)

    # https://github.com/nytimes/ingredient-phrase-tagger

    # convert to KG
    # ex: [(beef, 0.1), (chicken, 0.1)]
    text = text.replace("\xa0", " ")
    start = text.find("Ingredients")

    end = text.find("Directions")

    recipe_txt = text[start:end]

    return recipe_txt.split("\n")[2:-3]


def extract_recipe(url):

    html = getHTMLdocument(url)

    doc = Document(html)
    title = doc.short_title()

    text = text_from_html(html)
    recipe = get_recipe_from_text(text)

    return (title, recipe)
