import pickle
from io import BytesIO
from PyPDF2 import PdfReader
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS

def process_pdf_and_create_pkl(file_data):
    # Check if the file_data is a PDF by trying to read it as one
    try:
        pdf_reader = PdfReader(BytesIO(file_data))
        raw_text = ''
        for page in pdf_reader.pages:
            raw_text += page.extract_text()
    except Exception:
        # If it's not a PDF, assume it's raw text (e.g., from a .txt file or extracted from other formats)
        raw_text = file_data.decode('utf-8')

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=0, separators=[" ", ",", "\n"]
    )
    texts = text_splitter.split_text(raw_text)

    embeddings = OpenAIEmbeddings(disallowed_special=())
    docsearch = FAISS.from_texts(texts, embeddings)

    pkl_data = pickle.dumps(docsearch)
    return pkl_data
