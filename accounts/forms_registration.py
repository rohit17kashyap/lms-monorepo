from django import forms
from django.db import transaction
from course.models import Program
from .models import User, Student, LEVEL, GENDERS
from .utils import (
    generate_student_credentials, 
    generate_lecturer_credentials,
    send_new_account_email
)

class StudentRegistrationForm(forms.ModelForm):
    first_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )

    last_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={"class": "form-control"}),
    )

    gender = forms.CharField(
        widget=forms.Select(
            choices=GENDERS,
            attrs={"class": "browser-default custom-select form-control"},
        )
    )

    phone = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={"class": "form-control"}),
        required=False,
    )

    address = forms.CharField(
        max_length=60,
        widget=forms.TextInput(attrs={"class": "form-control"}),
        required=False,
    )

    level = forms.CharField(
        widget=forms.Select(
            choices=LEVEL,
            attrs={"class": "browser-default custom-select form-control"},
        )
    )

    program = forms.ModelChoiceField(
        queryset=Program.objects.all(),
        widget=forms.Select(
            attrs={"class": "browser-default custom-select form-control"}
        ),
    )

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "gender",
            "phone",
            "address",
            "level",
            "program",
        )

    @transaction.atomic()
    def save(self, commit=True):
        user = super().save(commit=False)

        username, password = generate_student_credentials()
        user.is_student = True

        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.email = self.cleaned_data["email"]
        user.gender = self.cleaned_data["gender"]
        user.phone = self.cleaned_data["phone"]
        user.address = self.cleaned_data["address"]

        user.username = username
        user.set_password(password)

        if commit:
            user.save()

            Student.objects.create(
                student=user,
                level=self.cleaned_data["level"],
                program=self.cleaned_data["program"],
            )
            try:
                send_new_account_email(user, password)
            except Exception as e:
                print(f"Failed to send email: {e}")

        return user

class LecturerRegistrationForm(forms.ModelForm):
    first_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )

    last_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={"class": "form-control"}),
    )

    phone = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={"class": "form-control"}),
        required=False,
    )

    address = forms.CharField(
        max_length=60,
        widget=forms.TextInput(attrs={"class": "form-control"}),
        required=False,
    )

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
        )

    @transaction.atomic()
    def save(self, commit=True):
        user = super().save(commit=False)
        
        username, password = generate_lecturer_credentials()
        user.is_lecturer = True

        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.email = self.cleaned_data["email"]
        user.phone = self.cleaned_data["phone"]
        user.address = self.cleaned_data["address"]

        user.username = username
        user.set_password(password)

        if commit:
            user.save()
            try:
                send_new_account_email(user, password)
            except Exception as e:
                print(f"Failed to send email: {e}")


        return user
