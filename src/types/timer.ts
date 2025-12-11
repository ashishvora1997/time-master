export interface Timer {
  id: string;
  title: string;
  duration: number;
  created_at: string;
  completed_at?: string;
  is_active: boolean;
  end_time?: string;
  color: string;
}

export interface TimerFormData {
  title: string;
  hours: number;
  minutes: number;
  seconds: number;
  color: string;
}

export interface ActiveTimer extends Timer {
  remainingTime: number;
}
