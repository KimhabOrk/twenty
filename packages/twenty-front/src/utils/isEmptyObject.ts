export const isEmptyObject = (obj: any): obj is object => {
  return (
    typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0
  );
};
