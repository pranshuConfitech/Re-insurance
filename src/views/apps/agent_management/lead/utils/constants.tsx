export const STATUS_COLORS:any = {
  'Hot': '#FF4D4D',    // Bright red for hot leads
  'Warm': '#FFA726',   // Orange for warm leads
  'Cold': '#78909C',   // Cool grey for cold leads
};

export const getStatusColor = (status: any) => {
  return STATUS_COLORS[status] || '#757575';
};

export const STATUS_OPTIONS = ['Hot', 'Warm', 'Cold'];

export const FORECAST_THRESHOLD = 70; // Threshold for good forecast percentage 
