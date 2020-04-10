from django.db import models

class Comment(models.Model):
    user = models.CharField(max_length=30)
    comment = models.TextField(max_length=200)
    post_id = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created']
