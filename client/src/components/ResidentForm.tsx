import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const residentSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  nif: z.string().optional(),
  nss: z.string().optional(),
  nsip: z.string().optional(),
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "Los apellidos son obligatorios"),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  birthPlace: z.string().optional(),
  admissionDate: z.string().min(1, "La fecha de admisión es obligatoria"),
  lastAdmissionDate: z.string().optional(),
  roomId: z.number().optional(),
  bedNumber: z.number().optional(),
  status: z.enum(["active", "discharged", "deceased"]),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  medicalNotes: z.string().optional(),
  allergies: z.string().optional(),
  specialNeeds: z.string().optional(),
});

type ResidentFormData = z.infer<typeof residentSchema>;

interface ResidentFormProps {
  residentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ResidentForm({ residentId, onSuccess, onCancel }: ResidentFormProps) {
  const isEditing = !!residentId;
  const utils = trpc.useUtils();

  const { data: resident, isLoading: loadingResident } = trpc.residents.getById.useQuery(
    { id: residentId! },
    { enabled: isEditing }
  );

  const { data: rooms } = trpc.rooms.list.useQuery();

  const createMutation = trpc.residents.create.useMutation({
    onSuccess: () => {
      toast.success("Residente creado correctamente");
      utils.residents.list.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Error al crear residente: " + error.message);
    },
  });

  const updateMutation = trpc.residents.update.useMutation({
    onSuccess: () => {
      toast.success("Residente actualizado correctamente");
      utils.residents.list.invalidate();
      utils.residents.getById.invalidate({ id: residentId! });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Error al actualizar residente: " + error.message);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResidentFormData>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      status: "active",
    },
  });

  useEffect(() => {
    if (resident) {
      reset({
        code: resident.code,
        nif: resident.nif || "",
        nss: resident.nss || "",
        nsip: resident.nsip || "",
        firstName: resident.firstName,
        lastName: resident.lastName,
        birthDate: resident.birthDate ? new Date(resident.birthDate).toISOString().split("T")[0] : "",
        gender: resident.gender || undefined,
        birthPlace: resident.birthPlace || "",
        admissionDate: resident.admissionDate ? new Date(resident.admissionDate).toISOString().split("T")[0] : "",
        lastAdmissionDate: resident.lastAdmissionDate
          ? new Date(resident.lastAdmissionDate).toISOString().split("T")[0]
          : "",
        roomId: resident.roomId || undefined,
        bedNumber: resident.bedNumber || undefined,
        status: resident.status,
        contactPhone: resident.contactPhone || "",
        contactEmail: resident.contactEmail || "",
        emergencyContactName: resident.emergencyContactName || "",
        emergencyContactPhone: resident.emergencyContactPhone || "",
        emergencyContactRelation: resident.emergencyContactRelation || "",
        medicalNotes: resident.medicalNotes || "",
        allergies: resident.allergies || "",
        specialNeeds: resident.specialNeeds || "",
      });
    }
  }, [resident, reset]);

  const onSubmit = async (data: ResidentFormData) => {
    const payload = {
      ...data,
      birthDate: data.birthDate || undefined,
      lastAdmissionDate: data.lastAdmissionDate || undefined,
      contactEmail: data.contactEmail || undefined,
      roomId: data.roomId || undefined,
      bedNumber: data.bedNumber || undefined,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id: residentId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  if (loadingResident) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos Personales</CardTitle>
          <CardDescription>Información personal del residente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input id="code" {...register("code")} placeholder="R001" />
              {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nif">NIF/DNI</Label>
              <Input id="nif" {...register("nif")} placeholder="12345678A" />
              {errors.nif && <p className="text-sm text-red-500">{errors.nif.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nss">NSS (Número Seguridad Social)</Label>
              <Input id="nss" {...register("nss")} placeholder="281234567890" />
              {errors.nss && <p className="text-sm text-red-500">{errors.nss.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nsip">NSIP</Label>
              <Input id="nsip" {...register("nsip")} placeholder="NSIP" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input id="firstName" {...register("firstName")} placeholder="María" />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Apellidos <span className="text-red-500">*</span>
              </Label>
              <Input id="lastName" {...register("lastName")} placeholder="García López" />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <Input id="birthDate" type="date" {...register("birthDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace">Lugar de Nacimiento</Label>
              <Input id="birthPlace" {...register("birthPlace")} placeholder="Madrid, España" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de Admisión</CardTitle>
          <CardDescription>Información sobre el ingreso en el centro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admissionDate">
                Fecha de Admisión <span className="text-red-500">*</span>
              </Label>
              <Input id="admissionDate" type="date" {...register("admissionDate")} />
              {errors.admissionDate && <p className="text-sm text-red-500">{errors.admissionDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastAdmissionDate">Última Fecha de Admisión</Label>
              <Input id="lastAdmissionDate" type="date" {...register("lastAdmissionDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Habitación</Label>
              <Controller
                name="roomId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar habitación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sin asignar</SelectItem>
                      {rooms?.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.code} - {room.name} ({room.availableBeds} camas disponibles)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedNumber">Número de Cama</Label>
              <Input
                id="bedNumber"
                type="number"
                {...register("bedNumber", { valueAsNumber: true })}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Estado <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="discharged">Alta</SelectItem>
                      <SelectItem value="deceased">Fallecido</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de Contacto</CardTitle>
          <CardDescription>Información de contacto del residente y emergencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono</Label>
              <Input id="contactPhone" {...register("contactPhone")} placeholder="612345678" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="email@ejemplo.com" />
              {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Contacto de Emergencia</Label>
              <Input id="emergencyContactName" {...register("emergencyContactName")} placeholder="Ana García" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Teléfono de Emergencia</Label>
              <Input
                id="emergencyContactPhone"
                {...register("emergencyContactPhone")}
                placeholder="623456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelation">Relación</Label>
              <Input
                id="emergencyContactRelation"
                {...register("emergencyContactRelation")}
                placeholder="Hija"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Médica</CardTitle>
          <CardDescription>Notas médicas, alergias y necesidades especiales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicalNotes">Notas Médicas</Label>
            <Textarea
              id="medicalNotes"
              {...register("medicalNotes")}
              placeholder="Historial médico relevante..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Alergias</Label>
            <Textarea
              id="allergies"
              {...register("allergies")}
              placeholder="Alergias conocidas..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialNeeds">Necesidades Especiales</Label>
            <Textarea
              id="specialNeeds"
              {...register("specialNeeds")}
              placeholder="Necesidades especiales de cuidado..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Guardar Cambios" : "Crear Residente"}
        </Button>
      </div>
    </form>
  );
}
