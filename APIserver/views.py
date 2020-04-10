from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Comment
from .serializer import CommentSerializer
from rest_framework.parsers import JSONParser

@csrf_exempt
def comment_list(request):
    if request.method == 'GET':
        query_set = Comment.objects.all()
        serializer = CommentSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def comment(request, pk):

    obj = Comment.objects.get(pk=pk)

    if request.method == 'GET':
        serializer = CommentSerializer(obj)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = CommentSerializer(obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        obj.delete()
        return HttpResponse(status=204)

@csrf_exempt
def filtercomment(request, pk):
    if request.method == 'GET':
        query_set = Comment.objects.filter(post_id=pk)

        serializer = CommentSerializer(query_set, many=True)
        return JsonResponse(serializer.data, safe=False)