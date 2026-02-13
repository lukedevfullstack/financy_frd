import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useUser } from "@/hooks/useUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { profileSchema, type ProfileFormData } from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Mail, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";

export function Profile() {
  const { data: user } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateUser({
      name: data.name,
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-center">
      <Card className="w-[448px]">
        <CardHeader className="items-center">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-gray-300 text-gray-800 text-2xl leading-10">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xl font-semibold leading-7 text-gray-800">
            {user?.name}
          </span>
          <span className="text-gray-500 text-base leading-6">
            {user?.email}
          </span>
        </CardHeader>

        <CardContent>
          <hr className="mb-8" />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field hasError={!!errors.name}>
              <FieldLabel htmlFor="name">Nome completo</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
                <InputGroupInput
                  id="name"
                  placeholder="Digite seu nome completo"
                  {...register("name")}
                />
              </InputGroup>
              {errors.name && (
                <FieldDescription className="text-feedback-danger">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field hasError={!!errors.email}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled
                  {...register("email")}
                />
              </InputGroup>
              <FieldDescription>
                O e-mail não pode ser alterado
              </FieldDescription>
            </Field>

            <div className="flex w-full flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar alterações"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="text-feedback-danger" />
                Sair da conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
