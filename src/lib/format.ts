const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(value: Date): string {
  return dateFormatter.format(value);
}
