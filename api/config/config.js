let env = process.env.NODE_ENV || 'development';
console.log('Environment:', env);

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI =  'mongodb://localhost:27017/TodoApp';
  console.log('Using port:', process.env.PORT);
  console.log('Using database:', process.env.MONGODB_URI);
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI =  'mongodb://localhost:27017/TodoAppTest';
  console.log('Using port:', process.env.PORT);
  console.log('Using database:', process.env.MONGODB_URI);
}
