import { ProjectService } from "./ProjectService";
import { Project } from "./types";

// Mock localStorage for testing
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}
Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

describe("ProjectService", () => {
  beforeEach(async () => {
    await ProjectService.clear();
  });

  it("creates a project", async () => {
    const project = await ProjectService.create({
      name: "Test Project",
      description: "A test project",
    });
    expect(project.id).toBeDefined();
    expect(project.name).toBe("Test Project");
    expect(project.description).toBe("A test project");
    expect(project.createdAt).toBeGreaterThan(0);
    expect(project.updatedAt).toBeGreaterThan(0);
  });

  it("gets all projects", async () => {
    await ProjectService.create({ name: "One", description: "D1" });
    await ProjectService.create({ name: "Two", description: "D2" });
    const projects = await ProjectService.getAll();
    expect(projects.length).toBe(2);
    expect(projects[0].name).toBe("One");
    expect(projects[1].name).toBe("Two");
  });

  it("gets a project by ID", async () => {
    const p = await ProjectService.create({ name: "X", description: "Dx" });
    const found = await ProjectService.getById(p.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(p.id);
  });

  it("returns null for getById with missing ID", async () => {
    const found = await ProjectService.getById("nonexistent");
    expect(found).toBeNull();
  });

  it("updates a project", async () => {
    const p = await ProjectService.create({ name: "Old", description: "Old D" });
    const updated = await ProjectService.update(p.id, { name: "New" });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe("New");
    expect(updated!.description).toBe("Old D");
    expect(updated!.updatedAt).toBeGreaterThanOrEqual(p.updatedAt);
  });

  it("returns null when updating nonexistent project", async () => {
    const updated = await ProjectService.update("bad-id", { name: "none" });
    expect(updated).toBeNull();
  });

  it("deletes a project", async () => {
    const p = await ProjectService.create({ name: "X", description: "Dx" });
    const result = await ProjectService.delete(p.id);
    expect(result).toBe(true);
    const after = await ProjectService.getById(p.id);
    expect(after).toBeNull();
  });

  it("returns false when deleting nonexistent project", async () => {
    const result = await ProjectService.delete("nope");
    expect(result).toBe(false);
  });

  it("clear removes all projects", async () => {
    await ProjectService.create({ name: "A", description: "D" });
    await ProjectService.clear();
    const projects = await ProjectService.getAll();
    expect(projects).toEqual([]);
  });
});