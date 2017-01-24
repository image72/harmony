app.use(async (req, res, next) => {
  const start = new Date;
  await next();
  const ms = new Date - start;
  console.log(`${req.method} ${req.url} - ${ms}ms`);
});
// x-response-time

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});
