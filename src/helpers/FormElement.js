import React from "react";
import { useField } from "formik";
import {
    makeStyles, Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: theme.spacing(2),
  },
  formControl:{
      padding: theme.spacing(2),
      fontWeight:"400",
      lineHeight:"1.43",
      fontSize: 14,
      fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      boxSizing:"content-box",
  }
}));


export const MyTextInput = ({ label, ...props }) => {
  const classes = useStyles();
  const [field, meta] = useField(props);
  return (
    <div className={classes.formGroup}>
      <Typography htmlFor={props.id || props.name} className={classes.label}>
        {label}
      </Typography>
      <input className={classes.formControl} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div
          className="error"
          style={{
            marginTop: ".25rem",
            fontSize: "80%",
            color: "#dc3545",
            width: "100%",
          }}
        >
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const classes = useStyles();
  return (
    <div className={classes.formGroup}>
      <Typography htmlFor={props.id || props.name} className={classes.label}>
        {label}
      </Typography>
      <textarea className={classes.formControl} {...field} {...props} rows={4}/>
      {meta.touched && meta.error ? (
        <div
          className="error"
          style={{
            marginTop: ".25rem",
            fontSize: "80%",
            color: "#dc3545",
            width: "100%",
          }}
        >
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export const MyTextHidden = ({ ...props }) => {
  const [field, meta] = useField(props);
  const classes = useStyles();
  return (
    <React.Fragment>
      <input className={classes.formControl} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div
          className="error"
          style={{
            marginTop: ".25rem",
            fontSize: "80%",
            color: "#dc3545",
            width: "100%",
          }}
        >
          {meta.error}
        </div>
      ) : null}
    </React.Fragment>
  );
};

export const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  const classes = useStyles();
  return (
    <div className="form-check">
      <label className="form-check-label">
        <input
          type="checkbox"
          {...field}
          {...props}
          className="form-check-input"
        />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error invalid-feedback">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MyRadio = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "radio" });
  const classes = useStyles();
  return (
    <div className="form-check">
      <label className="form-check-label">
        <input
          type="radio"
          {...field}
          {...props}
          className="form-check-input"
        />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error invalid-feedback">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const classes = useStyles();
  return (
    <div className={classes.formGroup}>
      <Typography htmlFor={props.id || props.name} className={classes.label}>
        {label}
      </Typography>
      <select {...field} {...props} className={classes.formControl} />
      {meta.touched && meta.error ? (
        <div className="error invalid-feedback">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MyCustomSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const classes = useStyles();
  return (
    <div className={classes.formGroup}>
      <select {...field} {...props} className={classes.formControl} />
      {meta.touched && meta.error ? (
        <div className="error invalid-feedback">{meta.error}</div>
      ) : null}
    </div>
  );
};


export const MyCustomTextInput = ({ label, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes.formGroup}>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className={classes.formControl} {...props} />
    </div>
  );
};
