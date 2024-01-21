import {Formik, FormikHelpers} from 'formik';
import React, {ReactNode} from 'react';

interface Props<T> {
  initialValues: any;
  validationSchema: any;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
  children: ReactNode;
}

const Form = <T extends object>(props: Props<T>) => {
  const {initialValues, validationSchema, onSubmit} = props;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {props.children}
    </Formik>
  );
};

export default Form;
