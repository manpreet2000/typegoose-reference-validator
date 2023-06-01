import mongoose from 'mongoose';

export function ReferenceValidator<T>(
  schema: mongoose.Schema<T>,
  options: any,
): void {
  for (const field of Object.values(schema.paths)) {
    // console.log('field.options', field.options);
    // console.log(`####`);
    // console.log(schema);
    if (!field.options['ref']) continue;

    if (typeof field.options['ref'] !== 'string') {
      throw Error('Not yet supported');
    }

    schema.pre('save', async function hehe() {
      try {
        const model = this.collection.conn.model(field.options['ref']);
        console.log(model);
        const id = this.get(field.path);
        const count = await model.countDocuments({ _id: id });
        console.log({ count });
        if (count == 0) throw Error('invalid');
      } catch (err) {
        console.log({ err });
        throw err;
      }
    });
  }
}
