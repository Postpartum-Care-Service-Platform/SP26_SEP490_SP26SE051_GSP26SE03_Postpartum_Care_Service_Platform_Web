'use client';

import Link from 'next/link';
import { useState } from 'react';

import styles from '../add-appointment.module.css';

type FormValues = {
  fullName: string;
  appointmentId: string;
  age: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  date: string;
  doctor: string;
  department: string;
  treatment: string;
  avatar: File | null;
};

export function AddAppointmentForm() {
  const [values, setValues] = useState<FormValues>({
    fullName: '',
    appointmentId: '',
    age: '0',
    gender: 'Male',
    phoneNumber: '',
    email: '',
    address: '',
    date: '',
    doctor: 'Dr. Rajesh Kumar',
    department: 'Cardiology',
    treatment: '',
    avatar: null,
  });

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setValues((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Add appointment submit:', values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.sectionCard}>
        <p className={styles.sectionTitle}>Add Appointment</p>
        <div className={styles.gridTwo}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              className={styles.input}
              placeholder="Enter Full Name"
              value={values.fullName}
              onChange={handleChange('fullName')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="appointmentId">
              Appointment ID
            </label>
            <input
              id="appointmentId"
              className={styles.input}
              value={values.appointmentId}
              onChange={handleChange('appointmentId')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="age">
              Age
            </label>
            <input id="age" className={styles.input} type="number" value={values.age} onChange={handleChange('age')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="gender">
              Gender
            </label>
            <select id="gender" className={styles.select} value={values.gender} onChange={handleChange('gender')}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              className={styles.input}
              placeholder="Enter Phone Number"
              value={values.phoneNumber}
              onChange={handleChange('phoneNumber')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              className={styles.input}
              placeholder="Enter Email Address"
              value={values.email}
              onChange={handleChange('email')}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label} htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              className={styles.textarea}
              placeholder="Enter Your Address"
              value={values.address}
              onChange={handleChange('address')}
            />
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <p className={styles.sectionTitle}>Appointment Details</p>
        <div className={styles.gridTwo}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="date">
              Date Of Appointment
            </label>
            <input
              id="date"
              className={styles.input}
              type="date"
              placeholder="Select date"
              value={values.date}
              onChange={handleChange('date')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="doctor">
              Consulting Doctor
            </label>
            <select id="doctor" className={styles.select} value={values.doctor} onChange={handleChange('doctor')}>
              <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="department">
              Department
            </label>
            <select id="department" className={styles.select} value={values.department} onChange={handleChange('department')}>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.label} htmlFor="treatment">
              Treatment
            </label>
            <textarea
              id="treatment"
              className={styles.textarea}
              placeholder="Describe your symptoms or reason for appointment"
              value={values.treatment}
              onChange={handleChange('treatment')}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="avatar">
              Avatar
            </label>
            <div className={styles.fileInputWrapper}>
              <input
                id="avatar"
                type="file"
                className={styles.fileInput}
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="avatar" className={styles.fileInputLabel}>
                Choose Files
              </label>
              <span className={styles.fileInputText}>{values.avatar ? values.avatar.name : 'No file chosen'}</span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Link href="/admin/appointment" className={styles.secondaryButton}>
            Cancel
          </Link>
          <button type="submit" className={styles.primaryButton}>
            Save Appointment
          </button>
        </div>
      </div>
    </form>
  );
}

