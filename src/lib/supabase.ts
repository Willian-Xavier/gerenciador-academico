
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
);

// Type definition for Titles table
export interface Title {
  id: number;
  descricao: string;
  created_at?: string;
}

// Get all titles from Supabase
export const fetchTitles = async (): Promise<Title[]> => {
  const { data, error } = await supabase
    .from('titles')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    toast.error(`Erro ao carregar títulos: ${error.message}`);
    throw error;
  }

  return data || [];
};

// Get title by ID
export const fetchTitleById = async (id: number): Promise<Title | null> => {
  const { data, error } = await supabase
    .from('titles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    toast.error(`Erro ao carregar título: ${error.message}`);
    throw error;
  }

  return data;
};

// Create new title
export const createTitleInDb = async (descricao: string): Promise<Title> => {
  if (!descricao.trim()) {
    throw new Error("A descrição do título não pode estar vazia.");
  }

  // Check for duplicates
  const { data: existingTitles, error: checkError } = await supabase
    .from('titles')
    .select('id')
    .ilike('descricao', descricao)
    .limit(1);

  if (checkError) {
    toast.error(`Erro ao verificar duplicação: ${checkError.message}`);
    throw checkError;
  }

  if (existingTitles && existingTitles.length > 0) {
    throw new Error("Já existe um título com esta descrição.");
  }

  // Insert new title
  const { data, error } = await supabase
    .from('titles')
    .insert([{ descricao }])
    .select()
    .single();

  if (error) {
    toast.error(`Erro ao criar título: ${error.message}`);
    throw error;
  }

  toast.success("Título adicionado com sucesso!");
  return data;
};

// Update title
export const updateTitleInDb = async (id: number, descricao: string): Promise<Title> => {
  if (!descricao.trim()) {
    throw new Error("A descrição do título não pode estar vazia.");
  }

  // Check for duplicates (excluding current title)
  const { data: existingTitles, error: checkError } = await supabase
    .from('titles')
    .select('id')
    .ilike('descricao', descricao)
    .neq('id', id)
    .limit(1);

  if (checkError) {
    toast.error(`Erro ao verificar duplicação: ${checkError.message}`);
    throw checkError;
  }

  if (existingTitles && existingTitles.length > 0) {
    throw new Error("Já existe um título com esta descrição.");
  }

  // Update title
  const { data, error } = await supabase
    .from('titles')
    .update({ descricao })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    toast.error(`Erro ao atualizar título: ${error.message}`);
    throw error;
  }

  toast.success("Título atualizado com sucesso!");
  return data;
};

// Delete title
export const deleteTitleFromDb = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('titles')
    .delete()
    .eq('id', id);

  if (error) {
    toast.error(`Erro ao excluir título: ${error.message}`);
    throw error;
  }

  toast.success("Título excluído com sucesso!");
};
