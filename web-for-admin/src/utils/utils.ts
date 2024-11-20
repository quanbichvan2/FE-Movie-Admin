export function toISOString(date: string, time:  string) {
    if (!date || !time) {
      throw new Error("Both date and time strings are required.");
    }
  
    const dateTime = `${date}T${time}:00`;
    const isoString = new Date(dateTime).toISOString();
  
    return isoString;
  }