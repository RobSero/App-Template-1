from django.db import models


class Comment(models.Model):
  content = models.CharField(max_length=300)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  property_detail = models.ForeignKey(
    'properties.Property',
    related_name='comments',
    on_delete=models.CASCADE
  )
  owner = models.ForeignKey(
    'jwt_auth.User',
    related_name='owner',
    on_delete=models.CASCADE
  )
  
  def __str__(self):
    return f'Comment - {self.owner} - {self.property_detail}'