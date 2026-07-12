export const formatEventDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(d);
    }
  } catch (e) {
    // Fallback
  }
  return dateStr;
};
