/**
 * Project type definition.
 * @typedef {Object} Project
 * @property {string} id - Unique project identifier (UUID).
 * @property {string} name - Project name.
 * @property {string} description - Project description.
 * @property {number} createdAt - Creation timestamp (ms since epoch).
 * @property {number} updatedAt - Last update timestamp (ms since epoch).
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}