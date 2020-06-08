import "./App.css";

import { Field, Form, Formik } from "formik";
import { EmailField, TextField } from "formik-material-ui-elements";
import React from "react";

import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <Formik>
          {() => (
            <div className="form">
              <Field component={TextField} id="text" name="text" label="Text" />
              <Field component={EmailField} id="email" name="email" label="Email" />
            </div>
          )}
        </Formik>
    </div>
  );
}

export default App;
