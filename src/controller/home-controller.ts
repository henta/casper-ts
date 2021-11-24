import HomeService from '../service/home-service';
import {CLPublicKey, CLValueBuilder, RuntimeArgs} from "../lib";
import {DeployUtil} from '../../src/lib';
import {decodeBase16, encodeBase16} from "..";
import {ExecutableDeployItem} from "../lib/DeployUtil";
import * as fs from "fs";

class HomeController {
    private service: HomeService = new HomeService();

    // @ts-ignore
    hello = async ctx => {
        ctx.body = await this.service.hello();
    };

    // @ts-ignore
    makeTransfer = async ctx => {
        const params = ctx.request.body;
        const value = params.value;
        const from = params.from;
        const to = params.to;
        let recipientKey;
        if (to.length == 66 || to.length == 68) {
            recipientKey = CLPublicKey.fromHex(to);
        } else if (to.length == 64) {
            recipientKey = decodeBase16(params.to)
        }
        const fee = params.fee;
        const chainName = params.chainName;
        const ttl = params.ttl;
        let timestamp = Number(params.timestamp);
        const gasPrice = params.gasPrice;
        const senderKey = CLPublicKey.fromHex(from);
        const id = 0;
        let deployParams = new DeployUtil.DeployParams(
            senderKey,
            chainName,
            gasPrice,
            ttl,
            [],
            new Date(timestamp).valueOf()
        );
        let session = DeployUtil.ExecutableDeployItem.newTransfer(
            value,
            recipientKey,
            undefined, id
        );

        let payment = DeployUtil.standardPayment(fee);
        let deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        let hex = DeployUtil.makeDeployHex(deployParams, session, payment);
        let json = DeployUtil.deployToJson(deploy);
        let result = JSON.parse(JSON.stringify(json));
        result.hex = hex;
        ctx.body = JSON.stringify(result);
    };

    // @ts-ignore
    getAccountHashFromHex = async ctx => {
        const params = ctx.query;
        const address = params.address;
        const accountHash = CLPublicKey.fromHex(address);
        console.log('address', encodeBase16(accountHash.toAccountHash()));
        ctx.body = JSON.stringify(accountHash);
    };

// @ts-ignore
    makeDelegatorWithoutSign = async ctx => {
        const params = ctx.request.body;
        const chainName = params.chainName;
        const fee = params.fee;
        const ttl = params.ttl;
        const timestamp = params.timestamp;
        const gasPrice = params.gasPrice;
        const sessionWasm = fs.readFileSync('/root/casper-node/target/wasm32-unknown-unknown/release/delegate.wasm');
        //const sessionWasm = decodeBase16('');
        let validatorPublickey = params.to;
        if (validatorPublickey.length == 66) {
            validatorPublickey = CLPublicKey.fromHex(validatorPublickey);
        } else if (validatorPublickey.length == 64) {
            validatorPublickey = decodeBase16(params.validatorPublickey)
        }
        let delegatorPublickey = params.from;
        if (delegatorPublickey.length == 66) {
            delegatorPublickey = CLPublicKey.fromHex(delegatorPublickey);
        } else if (delegatorPublickey.length == 64) {
            delegatorPublickey = decodeBase16(params.delegatorPublickey)
        }

        const delegateAmount = params.value;

        // console.log('chainName' + chainName);
        // console.log('paymentAmount' + paymentAmount);
        // console.log('ttl' + ttl);
        // console.log('timestamp' + timestamp);
        // console.log('gasPrice' + gasPrice);
        // console.log('sessionWasm' + sessionWasm);
        // console.log('validatorPublickey' + validatorPublickey);
        // console.log('delegatorPublickey' + delegatorPublickey);
        // console.log('delegateAmount' + delegateAmount);

        const runtimeArgs = RuntimeArgs.fromMap({});
        runtimeArgs.insert('amount', CLValueBuilder.u512(delegateAmount));
        runtimeArgs.insert('validator', validatorPublickey);
        runtimeArgs.insert('delegator', delegatorPublickey);

        const session = ExecutableDeployItem.newModuleBytes(sessionWasm, runtimeArgs);

        let deployParams = new DeployUtil.DeployParams(
            delegatorPublickey,
            chainName,
            gasPrice,
            ttl,
            [],
            Date.parse(timestamp).valueOf()
        );

        let payment = DeployUtil.standardPayment(fee);
        let deploy = DeployUtil.makeDeploy(deployParams, session, payment);

        // const signerPrivKey = Keys.Ed25519.loadKeyPairFromPrivateFile("/Users/likunmiao/secret_private_c318.pem");
        // const signerdeploy = signDeploy(deploy, signerPrivKey); //java代码签名
        // //let hex = DeployUtil.makeDeployHex(deployParams, session, payment);
        //
        //
        // let json = DeployUtil.deployToJson(signerdeploy);
        //let json = DeployUtil.deployToJson(deploy);
        // let senddeploy = new CasperClient('http://47.242.213.60:7777/rpc', '');
        // let deployhash = senddeploy.putDeploy(signerdeploy);
        // console.log('deployhash:' + (await deployhash).toString());
        // let result = JSON.parse(JSON.stringify(json));
        // result.hex = json;
        // ctx.body = JSON.stringify(result);

        let hex = DeployUtil.makeDeployHex(deployParams, session, payment);
        let json = DeployUtil.deployToJson(deploy);
        let result = JSON.parse(JSON.stringify(json));
        result.hex = hex;
        ctx.body = JSON.stringify(result);
    };

    // @ts-ignore
    makeUnDelegatorWithoutSign = async ctx => {
        const params = ctx.request.body;
        const chainName = params.chainName;
        const fee = params.fee;
        const ttl = params.ttl;
        const timestamp = params.timestamp;
        const gasPrice = params.gasPrice;
        const sessionWasm = fs.readFileSync('/root/casper-node/target/wasm32-unknown-unknown/release/undelegate.wasm');
        //const sessionWasm = decodeBase16('');
        let validatorPublickey = params.to;
        if (validatorPublickey.length == 66) {
            validatorPublickey = CLPublicKey.fromHex(validatorPublickey);
        } else if (validatorPublickey.length == 64) {
            validatorPublickey = decodeBase16(params.validatorPublickey)
        }
        let delegatorPublickey = params.from;
        if (delegatorPublickey.length == 66) {
            delegatorPublickey = CLPublicKey.fromHex(delegatorPublickey);
        } else if (delegatorPublickey.length == 64) {
            delegatorPublickey = decodeBase16(params.delegatorPublickey)
        }

        const delegateAmount = params.value;

        // console.log('chainName' + chainName);
        // console.log('paymentAmount' + paymentAmount);
        // console.log('ttl' + ttl);
        // console.log('timestamp' + timestamp);
        // console.log('gasPrice' + gasPrice);
        // console.log('sessionWasm' + sessionWasm);
        // console.log('validatorPublickey' + validatorPublickey);
        // console.log('delegatorPublickey' + delegatorPublickey);
        // console.log('delegateAmount' + delegateAmount);

        const runtimeArgs = RuntimeArgs.fromMap({});
        runtimeArgs.insert('amount', CLValueBuilder.u512(delegateAmount));
        runtimeArgs.insert('validator', validatorPublickey);
        runtimeArgs.insert('delegator', delegatorPublickey);

        const session = ExecutableDeployItem.newModuleBytes(sessionWasm, runtimeArgs);

        let deployParams = new DeployUtil.DeployParams(
            delegatorPublickey,
            chainName,
            gasPrice,
            ttl,
            [],
            Date.parse(timestamp).valueOf()
        );

        let payment = DeployUtil.standardPayment(fee);
        let deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        //const signerPrivKey = Keys.Ed25519.loadKeyPairFromPrivateFile("/Users/likunmiao/secret_private_c318.pem");
        // const signerdeploy = signDeploy(deploy, signerPrivKey); //java代码签名
        //let hex = DeployUtil.makeDeployHex(deployParams, session, payment);
        //let json = DeployUtil.deployToJson(signerdeploy);
        // let json = DeployUtil.deployToJson(deploy);
        //let senddeploy = new CasperClient('http://47.242.213.60:7777/rpc', '');
        //let deployhash = senddeploy.putDeploy(signerdeploy);
        //console.log('deployhash:' + (await deployhash).toString());
        // let result = JSON.parse(JSON.stringify(json));
        // result.hex = json;
        // ctx.body = JSON.stringify(result);
        let hex = DeployUtil.makeDeployHex(deployParams, session, payment);
        let json = DeployUtil.deployToJson(deploy);
        let result = JSON.parse(JSON.stringify(json));
        result.hex = hex;
        ctx.body = JSON.stringify(result);
    };

}

export default new HomeController();
