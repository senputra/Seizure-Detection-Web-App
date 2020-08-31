export interface RecordingDoc {
  id: string;
  mediaURL: string; // path to the media
  priority: PriorityLevel;
  patientName: string;
  patientAge: number;
  doctorName: string;

  recordingDate: Date;

  notes?: string;
}

export enum PriorityLevel {
  VERY_LOW = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  VERY_HIGH = 5,
}

export enum RecordingStatus {
  RECORDING = 'RECORDING',
  NOT_RECORDING = 'NOT_RECORDING',
}
