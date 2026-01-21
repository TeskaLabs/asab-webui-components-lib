# DateTime

- display date in absolute form

## DateTime

```
<DateTime value={'2025-01-02T03:04:05.123456Z'} />;
<DateTime value={'2025-01-02T03:04:05.123456Z'} dateTimeFormat='long' />;
<DateTime value={'2025-01-02T03:04:05.123456Z'} dateTimeFormat='yyyy-MM-dd HH:mm:ss.SSS' />;
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso'|'\<any date-fns supported format\>') - format of the datetime, default is `undefined`

## timeToString

```
timeToString('2025-01-02T03:04:05.123456Z');
timeToString('2025-01-02T03:04:05.123456Z', 'long');
timeToString('2025-01-02T03:04:05.123456Z', 'yyyy-MM-dd HH:mm:ss.SSS');
```

```
import { cs } from 'date-fns/locale/cs';

timeToString('2025-01-02T03:04:05.123456Z', 'long', cs);
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso'|'\<any date-fns supported format\>') - format of the datetime, default is `undefined`
  - locale (undefined|'date-fns/locale') - locale to translation, default is `undefined`

# DateTimeRelative

- display date in relative form

## DateTimeRelative

```
<DateTimeRelative value={'2025-01-02T03:04:05.123456Z'} />;
<DateTimeRelative value={'2025-01-02T03:04:05.123456Z'} dateTimeFormat='long' />;
<DateTimeRelative value={'2025-01-02T03:04:05.123456Z'} dateTimeFormat='yyyy-MM-dd HH:mm:ss.SSS' addSuffix={true} />;
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso'|'\<any date-fns supported format\>') - format of the datetime, default is `undefined`
  - addSuffix (undefined|true|false) - display the suffix, default is `false`

## timeToStringRelative

```
timeToStringRelative('2025-01-02T03:04:05.123456Z');
timeToStringRelative('2025-01-02T03:04:05.123456Z', 'long');
timeToStringRelative('2025-01-02T03:04:05.123456Z', 'yyyy-MM-dd HH:mm:ss.SSS', true);
```

```
import { cs } from 'date-fns/locale/cs';

timeToString('2025-01-02T03:04:05.123456Z', 'long', false, cs);
```

`props`
  - value ('string'|'integer'|'float'|'BigInt') - input datetime value, mandatory parameter
  - dateTimeFormat (undefined|'medium'|'long'|'iso'|'\<any date-fns supported format\>') - format of the datetime, default is `undefined`
  - addSuffix (undefined|true|false) - display the suffix, default is `false`
  - locale (undefined|'date-fns/locale') - locale to translation, default is `undefined`
