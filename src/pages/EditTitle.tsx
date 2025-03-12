
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import TitleForm from "@/components/TitleForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchTitleById, updateTitleInDb } from "@/lib/supabase";
import { toast } from "sonner";

const EditTitle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const titleId = Number(id);

  // Fetch title data
  const { data: title, isLoading, error } = useQuery({
    queryKey: ["title", titleId],
    queryFn: () => fetchTitleById(titleId),
    enabled: !isNaN(titleId),
  });

  // Update mutation
  const { mutateAsync: updateTitle, isPending: isUpdating } = useMutation({
    mutationFn: (descricao: string) => updateTitleInDb(titleId, descricao),
  });

  // Handle submission
  const handleSubmit = async (descricao: string) => {
    await updateTitle(descricao);
  };

  // Handle invalid ID
  useEffect(() => {
    if (isNaN(titleId)) {
      toast.error("ID de título inválido");
      navigate("/");
    }
  }, [titleId, navigate]);

  if (isLoading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Editar Título</h1>
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg shadow-sm border border-border animate-fade-in">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando título...</p>
        </div>
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="page-container">
        <h1 className="page-title">Editar Título</h1>
        <div className="text-center p-8 bg-card rounded-lg shadow-sm border border-border animate-fade-in">
          <h2 className="text-xl font-bold text-destructive mb-4">Título não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível encontrar o título com o ID {id}.
          </p>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            onClick={() => navigate("/")}
          >
            Voltar para a lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Editar Título</h1>
      <TitleForm 
        initialValue={title.descricao} 
        onSubmit={handleSubmit} 
        isEditing 
        isSubmitting={isUpdating}
      />
    </div>
  );
};

export default EditTitle;
