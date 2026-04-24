from app.application.use_cases.model.get_model_overview_use_case import GetModelOverviewUseCase
from app.domain.repositories.model_repository import ModelRepository


class ModelController:
    def __init__(self, model_repo: ModelRepository, overview_uc: GetModelOverviewUseCase) -> None:
        self.model_repo = model_repo
        self.overview_uc = overview_uc

    def current(self) -> dict | None:
        m = self.model_repo.get_current()
        return None if m is None else m.__dict__

    def by_version(self, version: str) -> dict | None:
        for item in self.model_repo.list_versions():
            if item.version == version:
                return item.__dict__
        return None

    def overview(self, payload: dict | None = None) -> dict:
        return self.overview_uc.execute(payload)
