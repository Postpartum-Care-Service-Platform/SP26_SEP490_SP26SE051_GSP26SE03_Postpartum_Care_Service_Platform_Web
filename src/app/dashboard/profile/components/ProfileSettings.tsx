'use client';

import React from 'react';
import styles from './profile-settings.module.css';

type InputFieldProps = {
  label: string;
  id: string;
  type?: React.HTMLInputTypeAttribute;
  defaultValue?: string;
  gridSpan?: number;
};

type SelectFieldProps = {
  label: string;
  id: string;
  children: React.ReactNode;
  gridSpan?: number;
};

const InputField = ({ label, id, type = 'text', defaultValue, gridSpan = 1 }: InputFieldProps) => (
  <div className={styles.field} style={{ gridColumn: `span ${gridSpan}` }}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <input type={type} id={id} className={styles.input} defaultValue={defaultValue} />
  </div>
);

const SelectField = ({ label, id, children, gridSpan = 1 }: SelectFieldProps) => (
  <div className={styles.field} style={{ gridColumn: `span ${gridSpan}` }}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    <select id={id} className={styles.select}>
      {children}
    </select>
  </div>
);

export function ProfileSettings() {
  return (
    <form className={styles.form}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>User Information</h2>
        <div className={styles.grid}>
          <InputField label="First Name" id="firstName" defaultValue="John" />
          <InputField label="Last Name" id="lastName" defaultValue="Doe" />
          <InputField label="Username" id="username" defaultValue="@johndoe" />
          <InputField label="Email Address" id="email" type="email" defaultValue="johndoe@email.com" />
          <InputField label="Phone Number" id="phone" defaultValue="+1 123 456 7890" gridSpan={2} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <div className={styles.grid}>
          <InputField label="Address" id="address" defaultValue="1234 Main Street" gridSpan={2} />
          <SelectField label="City" id="city">
            <option>New York City</option>
          </SelectField>
          <SelectField label="State" id="state">
            <option>New York</option>
          </SelectField>
          <InputField label="ZIP Code" id="zip" defaultValue="00000" />
          <SelectField label="Language" id="language">
            <option>English</option>
          </SelectField>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Change Password</h2>
        <div className={styles.grid}>
          <InputField label="Current Password" id="currentPassword" type="password" />
          <InputField label="New Password" id="newPassword" type="password" />
          <InputField label="Confirm New Password" id="confirmPassword" type="password" gridSpan={2} />
        </div>
      </section>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Update Password
        </button>
      </div>
    </form>
  );
}
