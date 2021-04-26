import HomeService from '../service/home-service';
import {DeployUtil, PublicKey} from "../lib";
import {encodeBase16} from "..";

class HomeController {
    private service: HomeService = new HomeService();

    // @ts-ignore
    hello = async ctx => {
        ctx.body = await this.service.hello();
    };

    // @ts-ignore
    makeTransfer = async ctx => {
        const params = ctx.query;
        const value = params.value;
        const from = params.from;
        const to = params.to;
        const fee = params.fee;
        const chainName = params.chainName;
        const ttl = params.ttl;
        const timestamp = params.timestamp;
        const gasPrice = params.gasPrice;
        console.log('value', value);
        console.log('from', from);
        console.log('to', to);
        console.log('fee', fee);
        console.log('chainName', chainName);
        console.log('timestamp', timestamp);
        console.log('ttl', ttl);
        const senderKey = PublicKey.fromHex(from);
        const recipientKey = PublicKey.fromHex(to);
        console.log('address', encodeBase16(recipientKey.toAccountHash()));
        // const id = 34;
        let deployParams = new DeployUtil.DeployParams(
            senderKey,
            chainName,
            gasPrice,
            ttl,
            [],
            Date.now()
        );
        let session = DeployUtil.ExecutableDeployItem.newTransfer(
            value,
            recipientKey,
            undefined
        );
        let payment = DeployUtil.standardPayment(fee);
        let deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        let hex = DeployUtil.makeDeployHex(deployParams, session, payment);
        let json = DeployUtil.deployToJson(deploy);
        let result = JSON.parse(JSON.stringify(json));
        result.hex = hex;
        console.log(hex);
        console.log(JSON.stringify(result));
        ctx.body = JSON.stringify(result);
    };

    // @ts-ignore
    getAccountHashFromHex = async ctx => {
        const params = ctx.query;
        const address = params.address;
        const accountHash = PublicKey.fromHex(address);
        console.log('address', encodeBase16(accountHash.toAccountHash()));
        ctx.body = JSON.stringify(accountHash);
    };
}

export default new HomeController();
