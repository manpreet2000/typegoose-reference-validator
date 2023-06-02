# Typegoose Reference Validator

Typegoose/mongoose reference validator 

## Basic Usage

### Simple

(mongoose)

```ts
const schema1 = new mongoose.Schema({
  randomField: Number
});

const model1 = mongoose.model('model1', schema1);

const doc = await model1.create({ randomField: 100 });
await doc.save();

const schema2 = new mongoose.Schema({
   randomField: Number,
   model1Id:{
   type: mongoose.Schema.Types.ObjectId,
    ref: 'model1',
    }
});

schema2.plugin(ReferenceValidator);

const model2 = mongoose.model('model2', schema2);
const doc2 = await model2.create({ randomField: 90 ,model1Id:"5411911ff327a149921c4541" });
// random model1Id passed, plugin will throw error as this is not model1's Id

```
#### Positive Scenario

```ts
const doc2 = await model2.create({ randomField: 120 ,model1Id:doc1.id });
// plugin will not throw error as this is model1's Id

```
#### Array Reference

```ts

const schema2 = new mongoose.Schema({
   randomField: Number,
   model1Id:{
   type: [mongoose.Schema.Types.ObjectId],
    ref: 'model1',
    }
});

schema2.plugin(ReferenceValidator);
const model2 = mongoose.model('model2', schema2);

const doc= await model2.create({randomField:12,model1Id:["5411911ff327a149921c4541","bed4709185680e1ac7cf31bf"]});
// random array of model1Id passed, plugin will throw error as this is not in model1's Id
```

#### Positive Scenario

```ts
const doc2 = await model2.create({ randomField: 69 ,model1Id:[doc1.id,doc2.id] });
// plugin will not throw error as this is model1's Ids
```

(typegoose)

```ts
@plugin(ReferenceValidator)
class RandomClass {
  @prop({ref: () => RefSchema}) // does not need to be empty
  public id: Ref<RefSchema>;
}
const RandomModel = getModelForClass(RandomClass);

const doc = await RandomModel.create({ id: "random id" });

await doc.save(); 

// plugin will throw error
```
#### Positive Scenario

```ts
const doc2 = await RandomModel.create({ id:doc.id });
// plugin will not throw error as this is model1's Id
```

#### Array Reference

```ts

@plugin(ReferenceValidator)
class RandomClass {
  @prop({ref: () => RefSchema}) // does not need to be empty
  public id: Ref<RefSchema>[];
}
const RandomModel = getModelForClass(RandomClass);

const doc = await RandomModel.create({ id: ["random1 id","random2 id","random3 id"] });

await doc.save();
// random array of model1Id passed, plugin will throw error as this is not in model1's Id
```

#### Positive Scenario

```ts
const doc2 = await RandomModel.create({ randomField: 69 ,model1Id:[doc1.id,doc2.id] });
// plugin will not throw error as this is model1's Ids
```


## Install

`npm i -s typegoose-reference-validator`

You also need to install `mongoose`, because this plugin is made for `mongoose`.

## Testing

`Collaborate for test cases`

## Collaborate

`Raise an issue for collaboration. Let me know in issue if we need to have telegram channel for chat.`
