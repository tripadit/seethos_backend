from pydantic import BaseModel


class SitemapLink(BaseModel):
    url: str
