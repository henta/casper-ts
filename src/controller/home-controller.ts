import HomeService from '../service/home-service';
import {DeployUtil, PublicKey} from "../lib";
import {decodeBase16, encodeBase16} from "..";

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
        if (to.length == 66) {
            recipientKey = PublicKey.fromHex(to);
        } else if (to.length == 64) {
            recipientKey = decodeBase16(params.to)
        }
        const fee = params.fee;
        const chainName = params.chainName;
        const ttl = params.ttl;
        const timestamp = params.timestamp;
        const gasPrice = params.gasPrice;
        const senderKey = PublicKey.fromHex(from);
        let deployParams = new DeployUtil.DeployParams(
            senderKey,
            chainName,
            gasPrice,
            ttl,
            [],
            Date.parse(timestamp).valueOf()
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

    // @ts-ignore
    sendTransfer = async ctx => {

    };
}

export default new HomeController();
