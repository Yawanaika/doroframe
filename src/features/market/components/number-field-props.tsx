import {Field, FieldDescription, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";

interface NumberFieldProps {
    id: string;
    label: string;
    value: string;
    error?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

export function NumberField({
                                id,
                                label,
                                value,
                                error,
                                placeholder,
                                onChange,
                            }: NumberFieldProps) {
    return (
        <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
                <Input
                    id={id}
                    inputMode="numeric"
                    placeholder={placeholder}
                    aria-invalid={error ? true : undefined}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    />
            {error ? <FieldDescription>{error}</FieldDescription> : null}
        </Field>
    );
}