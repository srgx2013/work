import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputForm from "./components/CustomInput";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

const schema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z
      .string()
      .email("correo invalido")
      .min(1, "El correo es obligatorio"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Las contraseñas son diferentes",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const CustomForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputForm
        name="name"
        control={control}
        label="name"
        type="text"
        error={errors.name}
      />
      <InputForm
        name="email"
        control={control}
        label="Email"
        type="email"
        error={errors.email}
      />
      <InputForm
        name="password"
        control={control}
        label="password"
        type="password"
        error={errors.password}
      />
      <InputForm
        name="confirmPassword"
        control={control}
        label="confirmPassword"
        type="password"
        error={errors.confirmPassword}
      />
      <button type="submit">submit</button>
    </form>
  );
};

export default CustomForm;
