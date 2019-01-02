import { GraphQLObjectType, GraphQLSchema, TypeNode, isObjectType } from "graphql";

function travel(object: GraphQLObjectType){
  const ret: any = {};
  ret.name = object.name;
  const fields = Object.entries(object.getFields()).map(([name, field]) => {
    return {
      name,
      type: field.type,
    };
  });

  ret.fields = fields;
  return ret;
}


module.exports = {
  plugin: (schema: GraphQLSchema, documents, config) => {
    const queryType = schema.getTypeMap();
    const types = Object.entries(queryType)
      .filter(([key, value]) => {
        return isObjectType(value) && !key.startsWith('__');
      })
      .map(([key, value]) => {
        return travel(value as GraphQLObjectType);
      });

    return `export const GraphQLAllTypes = ${JSON.stringify(types, null, 2)};`;
  }
};
