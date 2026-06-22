from django import forms
from django.db import transaction
from .models import User, Student
from .utils import (
    generate_student_credentials, 
    generate_lecturer_credentials,
    send_new_account_email
)

ROLE_CHOICES = (
    ("student", "Student"),
    ("lecturer", "Lecturer"),
)

class RegistrationForm(forms.ModelForm):
    role = forms.ChoiceField(
        choices=ROLE_CHOICES,
        widget=forms.RadioSelect,
        initial="student",
        label="Register As",
    )

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

    class Meta:
        model = User
        fields = (
            "role",
            "first_name",
            "last_name",
            "email",
        )

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(
                "An account with this email already exists."
            )
        return email

    @transaction.atomic()
    def save(self, commit=True):
        user = super().save(commit=False)

        role = self.cleaned_data["role"]

        if role == "student":
            username, password = generate_student_credentials()
            user.is_student = True

        elif role == "lecturer":
            username, password = generate_lecturer_credentials()
            user.is_lecturer = True

        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.email = self.cleaned_data["email"]

        user.username = username
        user.set_password(password)

        if commit:
            user.save()
            if role == "student":
                Student.objects.create(student=user)
            try:
                send_new_account_email(user, password)
            except Exception as e:
                print(f"Failed to send email: {e}")

        return user
