
import { useMutation } from "@tanstack/react-query";
import { createTitle } from "@/services/titleService";
import TitleForm from "@/components/TitleForm";
import { motion } from "framer-motion";

const AddTitle = () => {
  const { mutateAsync } = useMutation({
    mutationFn: (descricao: string) => createTitle(descricao),
  });

  const handleSubmit = async (descricao: string) => {
    await mutateAsync(descricao);
  };

  return (
    <div className="page-container">
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Adicionar Novo Título
      </motion.h1>
      <TitleForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddTitle;
