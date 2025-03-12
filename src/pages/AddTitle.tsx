
import { useMutation } from "@tanstack/react-query";
import TitleForm from "@/components/TitleForm";
import { createTitleInDb } from "@/lib/supabase";

const AddTitle = () => {
  const { mutateAsync: createTitle, isPending } = useMutation({
    mutationFn: createTitleInDb,
  });

  const handleSubmit = async (descricao: string) => {
    await createTitle(descricao);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Adicionar Título</h1>
      <TitleForm 
        onSubmit={handleSubmit} 
        isSubmitting={isPending}
      />
    </div>
  );
};

export default AddTitle;
