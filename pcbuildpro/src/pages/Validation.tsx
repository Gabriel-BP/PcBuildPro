import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import InteractiveBackground from "@/components/InteractiveBackground";
import ValidationProgress from "@/components/validation/ValidationProgress";
import ValidationResults from "@/components/validation/ValidationResults";
import { toast } from "sonner";

export default function Validation() {
  const navigate = useNavigate();
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const componentesSeleccionados = JSON.parse(localStorage.getItem('componentesSeleccionados') || '[]');
    if (componentesSeleccionados.length === 0) {
      toast.error("No hay componentes seleccionados. Vuelve al Builder.");
      navigate("/builder");
      return;
    }

    const validarConNeo4j = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ componentes: componentesSeleccionados })
        });
        const data = await response.json();

        if (data.result && data.result.includes('[ERROR]')) {
          const errorText = data.result.match(/\[ERROR\][\s\S]*/)?.[0] || "Error desconocido";
          setValidationError(errorText);
          toast.error("Se detectaron errores de compatibilidad. Revisa tu configuración.");
        } else {
          iniciarAnimacion();
        }
      } catch (error) {
        console.error("Error al validar con Neo4j:", error);
        setValidationError("Error al conectar con el servidor de validación.");
        toast.error("Error de conexión con el servidor de validación.");
      }
    };

    const iniciarAnimacion = () => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            setValidationComplete(true);
            return 100;
          }
          return prevProgress + 5;
        });
      }, 150);
    };

    validarConNeo4j();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <InteractiveBackground />
      
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4 text-white hover:bg-white/10"
            onClick={() => navigate("/builder")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Validación de Compatibilidad</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-16 flex flex-col items-center">
        <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center">
          {validationError ? (
            <div className="text-red-500 text-left whitespace-pre-wrap">
              <h2 className="text-2xl font-bold mb-4">Errores detectados:</h2>
              <pre>{validationError}</pre>
              <Button
                className="mt-8"
                onClick={() => navigate("/builder")}
              >
                Volver al Builder
              </Button>
            </div>
          ) : (
            <>
              {!validationComplete ? (
                <ValidationProgress progress={progress} />
              ) : (
                <ValidationResults />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
