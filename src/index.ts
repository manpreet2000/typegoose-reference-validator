import mongoose from 'mongoose';

export function ReferenceValidator(
  schema: mongoose.Schema<any>,
  options: any,
): void {
  for (const field of Object.values(schema.paths)) {
    
    if (!['Array', 'ObjectID'].includes(field.instance)) continue;
    if (
      (field.instance == 'Array' &&
        !(field as Record<string, any>)['$embeddedSchemaType'].options[
          'ref'
        ]) ||
      (field.instance == 'ObjectID' && !field.options['ref'])
    ) {
      continue;
    }
    schema.pre('save', async function ReferenceValidatorPre(next) {
      try {
        let refName = '';
        if (field.instance === 'Array')
        refName = (field as Record<string, any>)['$embeddedSchemaType'].options[
          'ref'
        ];
      else if (field.instance === 'ObjectID') refName = field.options['ref'];
        if (refName === '') throw new Error(`Can not extract ref name from field ${field.path}`);
      
        const model = this.collection.conn.model(refName);
        const ids = this.get(field.path);
        const count = await model.countDocuments({ _id:{ $in: ids } });
        const isValidated = Array.isArray(ids) ? count == ids.length : count == 1;
        if (!isValidated) next(new Error(`Invalid reference from ${field.path} to ${refName}`));
      } catch (err) {
        next(err)
        throw err;
      }
    });
  }
}
//test