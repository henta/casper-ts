import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {PORT} from './config';
import AppRoutes from './routes';

export * from './services';
export * from './lib';
export {
    base64to16,
    encodeBase16,
    decodeBase16,
    encodeBase64,
    decodeBase64
} from './lib/Conversions';

const app = new Koa();
const router = new Router();

//路由
// @ts-ignore
AppRoutes.forEach(route => router[route.method](route.path, route.action));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);

console.log(`应用启动成功 端口:${PORT}`);
