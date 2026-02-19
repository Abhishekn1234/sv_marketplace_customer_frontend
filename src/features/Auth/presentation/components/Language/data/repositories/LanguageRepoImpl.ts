import type { LanguageCode } from "@/features/context/types/language";
import type { LanguageRepo } from "../../domain/repositories/LanguageRepo";
import apiClient from "@/features/api/interceptor";
import type { SelectLanguageDto } from "../../domain/entities/language";


export class LanguageRepoImpl implements LanguageRepo {
  private language: LanguageCode = "en"; 

  
  createLanguage = async (code: LanguageCode): Promise<LanguageCode> => {
    const dto: SelectLanguageDto = { language: code };

    try {
      
      await apiClient.post("/language", dto);

   
      this.language = code;
      return this.language;
    } catch (error) {
      console.error("Failed to set language:", error);
      throw error;
    }
  };

  getLanguage = async (): Promise<LanguageCode> => {
    try {
      const response = await apiClient.get("/language");
      const data: SelectLanguageDto = response.data;

      this.language = data.language;
      return this.language;
    } catch (error) {
      console.warn("Failed to fetch language, returning local default:", error);
      return this.language;
    }
  };
}
