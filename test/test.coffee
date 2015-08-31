should = require 'should'
os = require 'os'
MDoc = require '../'

Error.stackTraceLimit = Infinity

make = (fn)->->
  str = ''
  mdoc = new MDoc (data)-> str += data
  fn mdoc, (expect)->
    str.should[if expect.constructor is RegExp then 'match' else 'equal'] expect

it 'should add the date (default)', make (man, expect)->
  man.date()
  expect /^\.Dd\x20"\w+\x20\d{1,2},\x20\d{4}"\r?\n/

it 'should add the date (Date)', make (man, expect)->
  man.date new Date(0)
  expect '.Dd "January 4, 1970"\n'

it 'should add the date (Number)', make (man, expect)->
  man.date 1
  expect '.Dd "January 4, 1970"\n'

it 'should add the date (String)', make (man, expect)->
  man.date 'FOO'
  expect '.Dd FOO\n'

it 'should create a header', make (man, expect)->
  man.header 'foobar', 3
  expect '.Dt FOOBAR 3 3\n'

it 'should add the OS', make (man, expect)->
  man.os()
  expect ".Os #{man.formatArgument MDoc.systems[os.platform()]} " +
    "#{os.release().replace /\./g, '\\&.'}\n"

it 'should generate a NAME section', make (man, expect)->
  man.name 'foobar', 'into the bar'
  expect '.Sh NAME\n.Nm foobar\n.Nd into the bar\n'

it 'should generate a NAME section (multiple)', make (man, expect)->
  man.name ['foo', 'bar'], 'into the bar'
  expect '.Sh NAME\n.Nm foo\n.Nm bar\n.Nd into the bar\n'

it 'should generate a LIBRARY section', make (man, expect)->
  man.library 'glibc'
  expect '.Sh LIBRARY\n.Lb glibc\n'

it 'should generate an include tag', make (man, expect)->
  man.include 'stdio.h'
  expect '.In stdio\\&.h\n'

it 'should generate a function type tag', make (man, expect)->
  man.fnType 'size_t'
  expect '.Ft size_t\n'

it 'should generate a function', make (man, expect)->
  man.fn 'fwrite', 'FILE *file', 'const char *data', 'size_t size'
  expect '.Fn fwrite "FILE *file" "const char *data" "size_t size"\n'

it 'should generate a function argument', make (man, expect)->
  man.fnArg 'fd'
  expect '.Fa fd\n'

it 'should generate a cross-ref', make (man, expect)->
  man.seeAlso 'foobar'
  expect '.Xr foobar\n'

it 'should generate a standards tag', make (man, expect)->
  man.standard 'isoC'
  expect '.St -isoC\n'
