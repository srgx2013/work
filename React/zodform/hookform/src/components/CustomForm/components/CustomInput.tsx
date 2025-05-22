import { Controller } from "react-hook-form";
import "./CustomInput.css";
import type { Control } from "react-hook-form";
import type { FieldError } from "react-hook-form";

// Definición de los props que recibe el componente
interface Props {
  name: string; // Nombre del campo en el formulario
  control: Control<any>; // Objeto control de react-hook-form
  label: string; // Etiqueta visible para el input
  type?: string; // Tipo del input (por defecto será "text")
  error?: FieldError; // Objeto de error si hay validaciones fallidas
}

// Componente funcional
const InputForm = ({ name, control, label, type = "text", error }: Props) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            {...field}
            aria-invalid={!!error} // Mejora de accesibilidad
            className={`form-control ${error ? "is-invalid" : ""}`} // Clases dinámicas según si hay error
          />
        )}
      />

      {/* Muestra el mensaje de error si existe */}
      {error && <p className="error">{error.message}</p>}
    </div>
  );
};

export default InputForm;
