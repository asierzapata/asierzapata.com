---
title: Type Transformations Notes
tags:
  - TypeScript
  - Web Development
draft: false
---

These are my notes from the [Type Transformations](https://www.totaltypescript.com/workshops/type-transformations) course by [Matt Pocock](https://twitter.com/mattpocockuk) on [Total TypeScript](https://www.totaltypescript.com/).

## Basic Inference and Utility types

- `ReturnType` allows us to obtain the return type of a function
- `Parameters` allows us to obtain the input parameters of a function
- `Awaited` allows us to extract the return type of a promise
- Remember to always prefix a `value` with `typeof` if we want to extract the type
- We can access the keys of an object type with the `keyof` keyword. Example:

```typescript
const testingFrameworks = {
 vitest: {
  label: 'Vitest',
 },
 jest: {
  label: 'Jest',
 },
 mocha: {
  label: 'Mocha',
 },
} as const

type TestingFramework = keyof typeof testingFrameworks
//    ^ "vitest" | "jest" | "mocha"
```

- `Exclude` lets us remove a key from a type.
- `Extract` lets us get a key from a type.

## Unions and Indexing

- Discriminated union and unions
  - The difference between the two is that with the discriminated union, we have a "common" denominator (a key, for example) with which we can discriminate what exact type we have. For example:

```typescript
type A =
 | {
   type: 'a'
   a: string
   }
 | {
   type: 'b'
   b: string
   }
 | {
   type: 'c'
   c: string
   }

const getUnion = (result: A) => {
 // Here we can not access result.a
 if (result.type === 'a') {
  // Here we can access result.a
 }
}
```

- We can extract specific members of a union with the type helper `Extract` or remove some with `Exclude`

```typescript
export type Event =
 | {
   type: 'click'
   event: MouseEvent
   }
 | {
   type: 'focus'
   event: FocusEvent
   }
 | {
   type: 'keydown'
   event: KeyboardEvent
   }

type ClickEvent = Extract<Event, { type: 'click' }>
//   ^ {
//        type: "click";
//        event: MouseEvent;
//     }

type NonKeyDownEvents = Exclude<Event, { type: 'keydown' }>
//   ^ {
//        type: "click";
//        event: MouseEvent;
//     } | {
//        type: "focus";
//        event: FocusEvent;
//     }
```

- We can extract the type of a specific key with indexed access. This also works for discriminated unions where we access all possible keys.

```typescript
// Simple Type
const fakeDataDefaults = {
 String: 'Default string',
}

type StringType = (typeof fakeDataDefaults)['String']
//   ^ string

// Discriminated Union
type Event =
 | {
   type: 'click'
   event: MouseEvent
   }
 | {
   type: 'focus'
   event: FocusEvent
   }
 | {
   type: 'keydown'
   event: KeyboardEvent
   }
type EventType = Event['type']
//   ^ 'click' | 'focus' | 'keydown'
```

- If we want to infer the object values as literal type, for example on a enum object, we can use `as const` to convert it into its literal value. Another alternative is `Object.freeze`, that works on the runtime and type level, but does not work on more than the root level.
- We can pass a union as a indexed access of a type. For example:

```typescript
const programModeEnumMap = {
 GROUP: 'group',
 ANNOUNCEMENT: 'announcement',
 ONE_ON_ONE: '1on1',
 SELF_DIRECTED: 'selfDirected',
 PLANNED_ONE_ON_ONE: 'planned1on1',
 PLANNED_SELF_DIRECTED: 'plannedSelfDirected',
} as const

type IndividualProgram = (typeof programModeEnumMap)[
 | 'ONE_ON_ONE'
 | 'SELF_DIRECTED'
 | 'PLANNED_ONE_ON_ONE'
 | 'PLANNED_SELF_DIRECTED']

type AllPrograms = (typeof programModeEnumMap)[string]
```

## Template Literals

- We can use template strings to match with wildcard-like strings.
- We can use template strings into utility types like `Extract`

```typescript
type Routes = '/users' | '/users/:id' | '/posts' | '/posts/:id'

type DynamicRoutes = Extract<Routes, `${string}:${string}`>
//   ^ "/users/:id" | "/posts/:id"
```

- We can also use them to express all the possible permutations of union types like so:

```typescript
type BreadType = 'rye' | 'brown' | 'white'

type Filling = 'cheese' | 'ham' | 'salami'

type Sandwich = `${BreadType} sandwich with ${Filling}`
```

- String type helpers
  - `Lowercase<>`
  - `Uppercase<>`
  - `Capitalize<>`

## Custom Type Helpers

- We can pass to a type "generic" types to configure their outputs.
- We can add default values to generics as so

```typescript
type CreateDataShape<TData, TError = undefined> = {
 data: TData
 error: TError
}
```

- The empty object value has a specific use in TypeScript, and will represent anything that is not `null` or `undefined`.
  - This can be applied for example on the Maybe type where we want to exclude `null` and `undefined` -> `type Maybe<T extends {}> = T | null | undefined;`
- Nice Helper: `type NonEmptyArray<T> = [T, ...Array<T>];
- Conditional types take a form that looks a little like conditional expressions (`condition ? trueExpression : falseExpression`) in JavaScript: `SomeType extends OtherType ? TrueType : FalseType;`

```typescript
type GetDataValue<T> = T extends { data: infer TData } ? TData : never;`
```

> The `infer` in `T extends { data: infer TData }` says "Whatever is passed in to the `data` key, infer its type". Then, the `infer` declares `TData` for the true branch. If we try and access TData in the 'false' branch, we won't be able to. In other words, the `TData` variable is only defined for one branch.

- We can also infer the generics of a type like so:

```typescript
type GetPoint<T> = T extends MyComplexInterface<any, any, any, infer TPoint> ? TPoint : never
```

- Another example of infering with template literals

```typescript
type GetSurname<T> = T extends `${infer First} ${infer Last}` ? Last : never
```

- We can also infer on extending of union types like in this example where we can have multiple parser shapes

```typescript
type GetParserResult<T> = T extends
 | {
   parse: () => infer TResult
   }
 | {
   extract: () => infer TResult
   }
 | (() => infer TResult)
 ? TResult
 : never
```

## Mapped Types

- We can map a union to an object using the `in` when defining the key

```typescript
type RoutesObject = {
 [R in Route]: R
}
```

- We can transform the mapped key to another type

```typescript
interface Attributes {
 firstName: string
 lastName: string
 age: number
}

type AttributeGetters = {
 [K in keyof Attributes as `get${Capitalize<K>}`]: () => Attributes[K]
}
// ^ {
//       getFirstName: () => string;
//       getLastName: () => string;
//       getAge: () => number;
//   }
```

- Selective Remapping with Conditional Types and Template Literals

```typescript
type SearchForId = `${string}${'id' | 'Id'}${string}`

type OnlyIdKeys<T> = {
 [K in keyof T as K extends SearchForId ? K : never]: T[K]
}

// This will only return the values of a type that contain Id or id
```

- There is a useful pattern when transforming unions that is to express it as a intermediary form and then map over again. Example

```typescript
type ValuesAsUnionOfTuples = {
 [K in keyof Values]: [K, Values[K]]
}[keyof Values]
```
