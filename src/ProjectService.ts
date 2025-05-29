import { Project } from "./types";

/**
 * ProjectService
 * Simulates a CRUD API for Projects using localStorage.
 *
 * All methods are async for API parity.
 */
export class ProjectService {
  private static STORAGE_KEY = "projects";

  /**
   * Get all projects.
   * @returns {Promise<Project[]>}
   */
  static async getAll(): Promise<Project[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get a project by ID.
   * @param {string} id - Project ID.
   * @returns {Promise<Project | null>}
   */
  static async getById(id: string): Promise<Project | null> {
    const projects = await this.getAll();
    return projects.find((p: Project) => p.id === id) || null;
  }

  /**
   * Create a new project.
   * @param {Omit<Project, 'id' | 'createdAt' | 'updatedAt'>} data - Project data.
   * @returns {Promise<Project>}
   */
  static async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const projects = await this.getAll();
    const now = Date.now();
    const project: Project = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    projects.push(project);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    return project;
  }

  /**
   * Update an existing project.
   * @param {string} id - Project ID.
   * @param {Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>} updates - Fields to update.
   * @returns {Promise<Project | null>} The updated project or null if not found.
   */
  static async update(
    id: string,
    updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Project | null> {
    const projects = await this.getAll();
    const idx = projects.findIndex((p: Project) => p.id === id);
    if (idx === -1) return null;
    const updated: Project = {
      ...projects[idx],
      ...updates,
      updatedAt: Date.now(),
    };
    projects[idx] = updated;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    return updated;
  }

  /**
   * Delete a project by ID.
   * @param {string} id - Project ID.
   * @returns {Promise<boolean>} True if deleted, false if not found.
   */
  static async delete(id: string): Promise<boolean> {
    const projects = await this.getAll();
    const filtered = projects.filter((p: Project) => p.id !== id);
    if (filtered.length === projects.length) return false;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Clear all projects (for testing/demo purposes).
   */
  static async clear(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}