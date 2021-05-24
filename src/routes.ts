import homeController from './controller/home-controller';

export default [
    {
        path: '/',
        method: 'get',
        action: homeController.hello
    },
    {
        path: '/makeTransfer',
        method: 'post',
        action: homeController.makeTransfer
    },
    {
        path: '/getAccountHashFromHex',
        method: 'get',
        action: homeController.getAccountHashFromHex
    },
    {
        path: '/makeDelegatorWithoutSign',
        method: 'post',
        action: homeController.makeDelegatorWithoutSign
    },
    {
        path: '/makeUnDelegatorWithoutSign',
        method: 'post',
        action: homeController.makeUnDelegatorWithoutSign
    }
];
