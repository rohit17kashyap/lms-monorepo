from django.shortcuts import render, redirect
from django.contrib import messages
from .forms_registration import RegistrationForm

def register_view(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        
        if form.is_valid():
            form.save()
            messages.success(
                request,
                "Account created successfully."
            )
            return redirect("registration_success")
    else:
        form = RegistrationForm()

    return render(
        request,
        "accounts/registration/register.html",
        {"form": form},
    )

def registration_success_view(request):
    return render(
        request,
        "accounts/registration/success.html",
    )
