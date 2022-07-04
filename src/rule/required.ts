const required = (value: any) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return false;
  } else {
    return true;
  }
};

export default required
