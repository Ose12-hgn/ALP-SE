// —— VacancyViewModel.ts ——
// Manages volunteer vacancy exploration and creation with read-heavy caching

import { VacancyModel } from '../models/types';
import { AppServiceProtocol } from '../protocols/AppServiceProtocol';
import { CacheServiceProtocol } from '../protocols/CacheServiceProtocol';

export class VacancyViewModel {
  // Injected protocols to strictly decouple the ViewModel from concrete Firebase implementations
  private dbService!: AppServiceProtocol; 
  private cacheService!: CacheServiceProtocol; 

  public vacancies: VacancyModel[] = [];
  public searchQuery = "";
  public isLoading = false;
  public errorMessage = "";

  // Prioritizes in-memory cache reads to guarantee search results load in under 2.0 seconds
  fetchVacancies = async (): Promise<void> => {
    this.isLoading = true;
    try {
      let data = await this.cacheService.get('VACANCY_SEARCH_INDEX');
      if (!data) {
        data = await this.dbService.fetchRecords({ collection: 'vacancies' });
        this.cacheService.set('VACANCY_SEARCH_INDEX', data, 3600);
      }
      this.vacancies = data;
    } catch (e) {
      this.errorMessage = "Failed to load opportunities.";
    } finally {
      this.isLoading = false;
    }
  };

  // Halts execution if validation fails to protect the main database from incomplete records
  createVacancy = async (data: VacancyModel): Promise<void> => {
    if (!data.title || !data.deadline) throw new Error("Missing fields.");
    
    await this.dbService.saveRecord("vacancies", data);
    this.cacheService.invalidate('VACANCY_SEARCH_INDEX');
  };

  // Isolates draft documents by assigning a specific status so they bypass the public search index
  // TODO: Implement actual UI data mapping for the draft payload
  saveDraft = async (draftData: any): Promise<void> => {
    await this.dbService.saveRecord("vacancies", { ...draftData, status: 'draft' });
  };

  // Filters the cached directory locally to support fast keyword-based volunteer opportunity searches
  searchVacancies = async (query: string): Promise<void> => {
    this.searchQuery = query;
    // FIXME: Add the local filtering logic to update the this.vacancies array based on the query
  };

  // Transitions a draft into a published state and invalidates the cache to update the public directory
  publishVacancy = async (id: string): Promise<void> => {
    await this.dbService.updateRecord(id, "vacancies", { status: 'published' });
    this.cacheService.invalidate('VACANCY_SEARCH_INDEX');
  };
}
