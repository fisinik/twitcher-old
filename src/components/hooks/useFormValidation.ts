import { useState } from "react";

// Validating form inputs
interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

export function useFormValidation(
  initialState: FormValues,
  fields: { [field: string]: (value: string) => string | undefined },
  handleSubmitInput: (event: React.FormEvent<HTMLFormElement>) => void
) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(values: FormValues): FormErrors {
    const errors = {} as FormErrors;
    Object.keys(fields).forEach((field) => {
      const validateField = fields[field];
      if (!validateField) return;
      const error = validateField(values[field] as string);
      if (error) {
        errors[field] = error;
      }
    });
    return errors;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      handleSubmitInput(event);
      setValues(initialState);
    }
  }

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  };
}
