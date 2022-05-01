import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware


from utils import scraper

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

    recipe = extract_recipe(url)

    return recipe
