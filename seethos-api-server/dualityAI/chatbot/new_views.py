
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import create_chat_bot

@api_view(['POST'])
def create_a_bot(request):
    # Extract data from the request
    data = request.data
    # Call the create_chat_bot function
    result = create_chat_bot(
        chatbot=data.get('chatbot'),
        avatar_url=data.get('avatar_url'),
        file_paths=data.get('file_paths')
    )
    return Response(result)
