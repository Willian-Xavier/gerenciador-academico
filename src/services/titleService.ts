
import { toast } from "sonner";

export interface Title {
  id: number;
  descricao: string;
}

// Simulated data store
let titles: Title[] = [
  { id: 1, descricao: "Graduado" },
  { id: 2, descricao: "Especialista" },
  { id: 3, descricao: "Mestre" },
  { id: 4, descricao: "Doutor" },
  { id: 5, descricao: "Pós-Doutor" }
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all titles
export const getTitles = async (): Promise<Title[]> => {
  await delay(800); // Simulate network delay
  return [...titles];
};

// Get title by ID
export const getTitleById = async (id: number): Promise<Title | undefined> => {
  await delay(600);
  return titles.find(title => title.id === id);
};

// Create a new title
export const createTitle = async (descricao: string): Promise<Title> => {
  await delay(800);
  
  // Validate
  if (!descricao.trim()) {
    throw new Error("A descrição do título não pode estar vazia.");
  }
  
  // Check for duplicates
  if (titles.some(t => t.descricao.toLowerCase() === descricao.toLowerCase())) {
    throw new Error("Já existe um título com esta descrição.");
  }
  
  // Create new title with next available ID
  const newId = Math.max(0, ...titles.map(t => t.id)) + 1;
  const newTitle = { id: newId, descricao };
  
  titles = [...titles, newTitle];
  toast.success("Título adicionado com sucesso!");
  return newTitle;
};

// Update an existing title
export const updateTitle = async (id: number, descricao: string): Promise<Title> => {
  await delay(800);
  
  // Validate
  if (!descricao.trim()) {
    throw new Error("A descrição do título não pode estar vazia.");
  }
  
  // Check for duplicates (excluding current title)
  if (titles.some(t => t.descricao.toLowerCase() === descricao.toLowerCase() && t.id !== id)) {
    throw new Error("Já existe um título com esta descrição.");
  }
  
  const titleIndex = titles.findIndex(t => t.id === id);
  if (titleIndex === -1) {
    throw new Error("Título não encontrado.");
  }
  
  const updatedTitle = { ...titles[titleIndex], descricao };
  titles = titles.map(t => t.id === id ? updatedTitle : t);
  
  toast.success("Título atualizado com sucesso!");
  return updatedTitle;
};

// Delete a title
export const deleteTitle = async (id: number): Promise<void> => {
  await delay(800);
  
  const titleIndex = titles.findIndex(t => t.id === id);
  if (titleIndex === -1) {
    throw new Error("Título não encontrado.");
  }
  
  titles = titles.filter(t => t.id !== id);
  toast.success("Título excluído com sucesso!");
};
