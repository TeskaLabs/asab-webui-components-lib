# DateTime

- display date in absolute form

## DateTime

```
<DateTime value={'2025-01-02T03:04:05.123456Z'} />;
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso') - format of the datetime, default is `undefined`

## timeToString

```
timeToString('2025-01-02T03:04:05.123456Z')?.date;
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso') - format of the datetime, default is `undefined`
  - locale (undefined|'date-fns/locale') - locale to translation, default is `undefined`

# DateTimeRelative

- display date in relative form

## DateTimeRelative

```
<DateTimeRelative value={'2025-01-02T03:04:05.123456Z'} />;
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso') - format of the datetime, default is `undefined`
  - addSuffix (undefined|true|false) - display the suffix, default is `false`

## timeToStringRelative

```
timeToStringRelative('2025-01-02T03:04:05.123456Z')?.date;
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso') - format of the datetime, default is `undefined`
  - addSuffix (undefined|true|false) - display the suffix, default is `false`
  - locale (undefined|'date-fns/locale') - locale to translation, default is `undefined`
