export interface User {
  name: string;
}

export interface Doctor extends User {
  type: DoctorType;
}

export interface Patient extends User {
  age: number;
}

export enum DoctorType {
  SPECIALIST = 'SPECIALIST',
  GENERAL = 'GENERAL',
}

export const ANONYMOUS_DOCTOR: Doctor = {
  name: '',
  type: DoctorType.GENERAL,
};
