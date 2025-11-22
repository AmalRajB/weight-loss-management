from django.db import models
from django.contrib.auth.models import User

class WeightEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="weights")
    weight = models.FloatField()
    date = models.DateField(auto_now_add=True)  # Automatically saves current date

    class Meta:
        unique_together = ('user', 'date')  # Enforces only 1 entry per user per day

    def __str__(self):
        return f"{self.user.username} - {self.weight} kg on {self.date}"
