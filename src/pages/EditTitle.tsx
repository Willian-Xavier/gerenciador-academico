import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTitleById, updateTitle } from "@/services/titleService";
import TitleForm from "@/components/TitleForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const EditTitle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const titleId = parseInt(id || "0");

  // Fetch title data
  const { data: title, isLoading, error } = useQuery({
    queryKey: ["title", titleId],
    queryFn: () => getTitleById(titleId),
    meta: {
      onError: () => {
        toast.error("Não foi possível carregar os dados do título.");
      },
    },
  });

  // Update mutation
  const { mutateAsync } = useMutation({
    mutationFn: (descricao: string) => updateTitle(titleId, descricao),
  });

  const handleSubmit = async (descricao: string) => {
    await mutateAsync(descricao);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg shadow-sm border border-border animate-fade-in">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando dados do título...</p>
        </div>
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="page-container">
        <div className="text-center p-8 bg-card rounded-lg shadow-sm border border-border animate-fade-in">
          <h1 className="text-2xl font-bold text-destructive mb-4">Título não encontrado</h1>
          <p className="text-muted-foreground mb-4">
            Não foi possível encontrar o título solicitado.
          </p>
          <Button onClick={() => navigate("/")} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Voltar para lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Editar Título
      </motion.h1>
      <TitleForm 
        initialValue={title.descricao} 
        onSubmit={handleSubmit} 
        isEditing={true} 
      />
    </div>
  );
};

export default EditTitle;
