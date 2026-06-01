# Installation Steps

### Step 1: Check Python Version

- Check Python version:

  ```
  python --version
  ```

- If using Python 3.14 and facing compatibility issues, install and use Python 3.11 or 3.12.

### Step 2: Open Project Folder

- Open terminal in the project directory:

  ```
  cd path/to/django-lms
  ```

### Step 3: Remove Old Virtual Environment

- Delete the existing `venv` folder if it was created with the wrong Python version.
  ```
  rm -rf venv
  ```

### Step 4: Create New Virtual Environment

- macOS/Linux:

  ```
  python3.11 -m venv venv
  ```

- Windows:

  ```
  py -3.11 -m venv venv
  ```

### Step 5: Activate Virtual Environment

- macOS/Linux:

  ```
  source venv/bin/activate
  ```

- Windows:

  ```
  venv\Scripts\activate
  ```

### Step 6: Upgrade pip

- Upgrade pip:

  ```
  python -m pip install --upgrade pip
  ```

### Step 7: Install Project Requirements

- Install dependencies:

  ```
  pip install -r requirements.txt
  ```

### Step 8: Fix Pillow Issue

- If `Pillow==9.3.0` fails:
  - Use Python 3.11/3.12 instead of Python 3.14.
  - Recreate the virtual environment.
  - Reinstall requirements.

### Step 9: Run Migrations

- Generate migrations:

  ```
  python manage.py makemigrations
  ```

- Apply migrations:

  ```
  python manage.py migrate
  ```

### Step 10: Resolve the `pkg_resources` problem

- Install `setuptools` if not installed:

  ```
  pip install setuptools
  ```

- Or reinstall `setuptools` if already installed:

  ```
  pip install --force-reinstall setuptools==80.9.0
  ```

### Step 11: Create Superuser

- Create an admin account:

  ```
  python manage.py createsuperuser
  ```

- Enter username, email, and password when prompted.

### Step 12: Run Django Server

- Start the development server:

  ```
  python manage.py runserver
  ```

### Step 13: Access the Project

- Open:

  ```
  http://127.0.0.1:8000/
  ```

### Step 14: Access Django Admin Panel

- Open:

  ```
  http://127.0.0.1:8000/admin
  ```

- Log in using the superuser credentials.

## Expected Result

- Django LMS login page loads successfully
- Django admin panel is accessible
- Project runs successfully
