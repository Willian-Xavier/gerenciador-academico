
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface TitleFormProps {
  initialValue?: string;
  onSubmit: (descricao: string) => Promise<void>;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const TitleForm = ({ 
  initialValue = "", 
  onSubmit, 
  isEditing = false, 
  isSubmitting = false 
}: TitleFormProps) => {
  const [descricao, setDescricao] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao.trim()) {
      toast.error("Por favor, informe a descrição do título.");
      return;
    }
    
    try {
      await onSubmit(descricao);
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro ao processar sua solicitação.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container animate-fade-in">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição:</Label>
          <Input
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Informe a descrição do título"
            autoFocus
          />
        </div>
        
        <div className="flex justify-center pt-2">
          <Button 
            type="submit" 
            className="w-full bg-success hover:bg-success/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : isEditing ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>
    </form>
  );
};

export default TitleForm;
