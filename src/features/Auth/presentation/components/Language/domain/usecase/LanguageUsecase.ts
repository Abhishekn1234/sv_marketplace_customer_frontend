import type { LanguageCode } from "@/features/context/types/language";
import type { LanguageRepo } from "../repositories/LanguageRepo";

export class LanguageUseCase {
    private repo:LanguageRepo;
    constructor(repos:LanguageRepo){
        this.repo=repos;
    }
 
  async setLanguage(code: LanguageCode): Promise<LanguageCode> {
    return this.repo.createLanguage(code);
  }

  async getLanguage(): Promise<LanguageCode> {
    return this.repo.getLanguage();
  }
}