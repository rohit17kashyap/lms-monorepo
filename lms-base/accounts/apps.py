from django.apps import AppConfig

class AccountsConfig(AppConfig):
    name = "accounts"

    def ready(self) -> None:
        import accounts.signals
        import accounts.signals_session

        return super().ready()
