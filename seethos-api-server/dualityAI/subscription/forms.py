from django import forms
from .models import Subscription

class SubscriptionForm(forms.ModelForm):
    class Meta:
        model = Subscription
        fields = ['email', 'subscription_type']

class DataUploadForm(forms.Form):
    csv_file = forms.FileField(label='Select a CSV file')

    def clean_csv_file(self):
        file = self.cleaned_data.get('csv_file')
        if not file.name.endswith('.csv'):
            raise forms.ValidationError('File is not a CSV')
        return file        