import uvicorn

if __name__ == "__main__":
    uvicorn.run("app:get_app", host="0.0.0.0", port=8010)
