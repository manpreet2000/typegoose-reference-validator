import mongoose from 'mongoose';

const checkRef = function (model: mongoose.Model<any>) {
  return async function (ids: mongoose.ObjectId[]) {
    const count = await model.countDocuments({ _id: { $in: ids } });
    console.log({ count });
    return count == 1;
  };
};

export function ReferenceValidator<T>(
  schema: mongoose.Schema<T>,
  options: any,
): void {
  for (const field of Object.values(schema.paths)) {
    if (!field.options['ref']) continue;

    if (typeof field.options['ref'] !== 'string') {
      throw Error('Not yet supported');
    }
    try {
      const model = mongoose.model(field.options['ref']);
      field.validators.push({
        validator: checkRef(model),
        message: 'Invalid ref',
      });
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }
}
