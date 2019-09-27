export type ErrorMessagesType = { [key: string]: ErrorMessagesType } | string | undefined;
export type SiblingsDataType = { [key: string]: any };
export type ValidatorType = (data: any, siblingsData?: SiblingsDataType) => ErrorMessagesType;
export type SchemaType = { [key: string]: ValidatorType };

export const createVadidator = (schema: SchemaType) => (data: any) => {
  const errorMessages: ErrorMessagesType = Object.keys(schema).reduce(
    (errorMessages, key) => {
      const dataToValidate = data[key];
      const validator = schema[key];
      const errorMessage = validator(dataToValidate, data);

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
