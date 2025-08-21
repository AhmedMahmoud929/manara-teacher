export const isNotFoundError = (err: unknown | undefined): boolean => {
  if (!err) return false;
  return (err as { status: number }).status === 404;
};
