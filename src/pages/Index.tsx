
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { fetchTitles, deleteTitleFromDb, Title } from "@/lib/supabase";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Index = () => {
  const [titleToDelete, setTitleToDelete] = useState<Title | null>(null);
  const queryClient = useQueryClient();

  // Fetch titles
  const { data: titles, isLoading, error } = useQuery({
    queryKey: ["titles"],
    queryFn: fetchTitles,
  });

  // Delete mutation
  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteTitleFromDb(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titles"] });
      setTitleToDelete(null);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Erro ao excluir título";
      toast.error(message);
    }
  });

  // Handle delete confirmation
  const handleDelete = () => {
    if (titleToDelete) {
      deleteMutation(titleToDelete.id);
    }
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center p-8 bg-card rounded-lg shadow-sm border border-border animate-fade-in">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar dados</h1>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar a lista de títulos.
          </p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["titles"] })}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Lista de Títulos</h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg shadow-sm border border-border animate-fade-in">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando títulos...</p>
        </div>
      ) : (
        <>
          <div className="table-container mb-8">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header w-1/6 text-center">ID</th>
                  <th className="table-header w-4/6">Descrição</th>
                  <th className="table-header w-1/6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {titles && titles.map((title) => (
                    <motion.tr 
                      key={title.id}
                      className="table-row"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <td className="table-cell text-center">{title.id}</td>
                      <td className="table-cell">{title.descricao}</td>
                      <td className="table-cell">
                        <div className="flex justify-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon"
                                  variant="outline" 
                                  className="bg-info text-info-foreground hover:bg-info/90 rounded-full h-9 w-9"
                                  asChild
                                >
                                  <Link to={`/edit/${title.id}`}>
                                    <Edit size={16} />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon"
                                  variant="outline" 
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full h-9 w-9"
                                  onClick={() => setTitleToDelete(title)}
                                >
                                  <Trash size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Deletar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center">
            <Button asChild className="bg-success hover:bg-success/90">
              <Link to="/add" className="flex items-center gap-2">
                <Plus size={16} />
                Adicionar Novo Título
              </Link>
            </Button>
          </div>
        </>
      )}

      <DeleteConfirmation 
        isOpen={!!titleToDelete}
        onClose={() => setTitleToDelete(null)}
        onConfirm={handleDelete}
        title={titleToDelete?.descricao || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Index;
