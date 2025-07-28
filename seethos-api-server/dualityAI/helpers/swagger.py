from collections import OrderedDict

from rest_framework import serializers
from rest_framework.utils import model_meta
from rest_framework.utils.field_mapping import get_field_kwargs

from .serializers import BaseSerializer


def swagger_serializer_factory(Model, required=[], optional=[], request_name=None):
    required_fields = {}
    optional_fields = {}

    def build_field(field_name, required=True):
        field_instance = Model._meta.get_field(field_name)
        field_class_name = field_instance.__class__.__name__
        serializer_field = getattr(serializers, field_class_name)
        model_info = model_meta.get_field_info(Model)
        field_kwargs = get_field_kwargs(field_name, model_info.fields_and_pk[field_name])
        field_kwargs.update({
            'required': required,
            'source': 'standin',  # DRF Assertion error occurs if no source provided
        })
        del field_kwargs['model_field']
        return serializer_field(**field_kwargs)

    for field in required:
        required_fields[field] = build_field(field)

    for field in optional:
        required_fields[field] = build_field(field, required=False)

    combined_fields = list(set(list(required_fields.keys()) + list(optional_fields.keys())))

    class NewSerializer(BaseSerializer):

        class Meta:
            model = Model
            fields = combined_fields

        def get_fields(self, *args, **kwargs):
            new_fields = []
            for key_name in combined_fields:
                if key_name in list(required_fields.keys()):
                    value = required_fields[key_name]
                else:
                    value = optional_fields[key_name]
                new_fields.append((key_name, value))
            return OrderedDict(new_fields)

    if not request_name:
        from django.utils.crypto import get_random_string
        request_name = get_random_string(length=32)
    NewSerializer.Meta.ref_name = request_name
    return NewSerializer


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
