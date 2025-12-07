const parseDate = (value: unknown): Date => {
  const d = new Date(value as any);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
};

export default parseDate;