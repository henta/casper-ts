import homeController from './controller/home-controller';

export default [
    {
        path: '/',
        method: 'get',
        action: homeController.hello
    },
    {
        path: '/makeTransfer',
        method: 'get',
        action: homeController.makeTransfer
    },
    {
        path: '/getAccountHashFromHex',
        method: 'get',
        action: homeController.getAccountHashFromHex
    }
];
