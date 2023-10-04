const __resolveType = (parent: any) => {
  return parent.__typename;
};

export default { __resolveType };
