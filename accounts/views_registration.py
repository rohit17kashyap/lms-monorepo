from django.shortcuts import render, redirect
from django.contrib import messages
from .forms_registration import (
    StudentRegistrationForm,
    LecturerRegistrationForm,
)

def register_choice_view(request):
    return render(
        request,
        "accounts/register/choice.html",
    )

def student_register_view(request):
    if request.method == "POST":
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(
                request,
                "Student account created successfully."
            )
            return redirect("registration_success")
    else:
        form = StudentRegistrationForm()
    return render(
        request,
        "accounts/register/student.html",
        {"form": form},
    )

def lecturer_register_view(request):
    if request.method == "POST":
        form = LecturerRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(
                request,
                "Lecturer account created successfully."
            )
            return redirect("registration_success")
    else:
        form = LecturerRegistrationForm()
    return render(
        request,
        "accounts/register/lecturer.html",
        {"form": form},
    )

def registration_success_view(request):
    return render(
        request,
        "accounts/register/success.html",
    )
