export type ErrorMessagesType = { [key: string]: ErrorMessagesType } | string | undefined;
export type SiblingsDataType = { [key: string]: any };
export type ValidatorType = (data: any, siblingsData?: SiblingsDataType) => ErrorMessagesType;
export type SchemaType = { [key: string]: ValidatorType | ValidatorType[] };

export const createValidator = (schema: SchemaType) => (data: any) => {
  const errorMessages: ErrorMessagesType = Object.keys(schema).reduce(
    (errorMessages, key) => {
      const dataToValidate = data[key];
      const validator = schema[key];

      let errorMessage: ErrorMessagesType;

      if (!Array.isArray(validator)) {
        errorMessage = validator(dataToValidate, data);
      } else {
        errorMessage = validator.reduce(
          (errorMessageSum, validator) => {
            if (typeof errorMessageSum !== 'undefined') return errorMessageSum;

            return validator(dataToValidate, data);
          },
          undefined as ErrorMessagesType,
        );
      }

      if (typeof errorMessage === 'string' || (typeof errorMessage === 'object' && Object.keys(errorMessage).length)) {
        if (typeof errorMessages === 'object') {
          errorMessages[key] = errorMessage;
        }
      }

      return errorMessages;
    },
    {} as ErrorMessagesType,
  );

  return typeof errorMessages === 'object' && Object.keys(errorMessages).length ? errorMessages : undefined;
};
