import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeClosed, Lock, Mail, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.svg";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { loginSchema, type LoginFormData } from "@/schemas/login.schema";

export function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex items-center justify-center flex-col gap-8">
      <img src={logo} className="w-32 h-8" alt="Logo" />
      <Card className="w-[448px]">
        <CardHeader>
          <CardTitle className="text-center">Fazer login</CardTitle>
          <CardDescription className="text-center">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Field hasError={!!errors.email}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <InputGroup>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <InputGroupInput
                      type="email"
                      id="email"
                      placeholder="mail@exemplo.com"
                      {...field}
                    />
                  )}
                />
                <InputGroupAddon align="inline-start">
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field hasError={!!errors.password}>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <InputGroup>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputGroupInput
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  )}
                />
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    title="password-toggle"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <Eye /> : <EyeClosed />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            <Button type="submit" className="w-full my-6" disabled={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <hr className="h-1 w-full" />
              <span className="text-sm text-gray-500 leading-5">ou</span>
              <hr className="h-1 w-full" />
            </div>
            <span className="text-center leading-5 text-gray-600 font-normal mb-4">
              Ainda não tem uma conta?
            </span>
            <Button variant="outline" asChild>
              <Link to="/signup">
                <UserRoundPlus /> Criar conta
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
