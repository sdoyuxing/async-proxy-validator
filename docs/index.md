## API
---
### new Schema
```javascript
const descriptor = {
  name: {
    type: 'string',
    required: true,
    validator: (rule, value) => value === 'muji',
  },
  age: {
    type: 'number',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (value < 18) {
          reject('too young');  // reject with error message
        } else {
          resolve();
        }
      });
    },
  },
};
const validator = new Schema(descriptor);
```
### Validate
```javascript
function(source, [options], callback): Promise
```
