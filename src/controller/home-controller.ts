import HomeService from '../service/home-service';
import {DeployUtil, Keys, PublicKey} from "../lib";
import {decodeBase16, encodeBase16} from "..";
import {sign_keyPair_fromSeed} from "tweetnacl-ts";

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
        const sendkey = sign_keyPair_fromSeed(decodeBase16("b6bab8ec5784bc0bfe7e28283bbf4cae3fce450f25f2d241ea4aa295a7555488"));
        const senderKey = new Keys.Ed25519(sendkey);

        const recKey = sign_keyPair_fromSeed(decodeBase16("bdc63c61deed2768046fe0aa2d1472b8283e034a388c5eeeb9d1989607927625"));
        const recipientKey = new Keys.Ed25519(recKey);
        const networkName = 'casper-test';
        const paymentAmount = 100000000;
        const transferAmount = 3500000000;

        let deployParams = new DeployUtil.DeployParams(
            senderKey.publicKey,
            networkName
        );
        let session = DeployUtil.ExecutableDeployItem.newTransfer(
            transferAmount,
            recipientKey.publicKey,
            undefined
        );
        let payment = DeployUtil.standardPayment(paymentAmount);
        let deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        deploy = DeployUtil.signDeploy(deploy, senderKey);
        let json = DeployUtil.deployToJson(deploy);

        console.log(JSON.stringify(json));

        json = JSON.parse("{\"deploy\":{\"hash\":\"d2e55c95b2fd3dec327ae8cc11947f62b5b16f9ea8e08c74497e115e5e38d23d\",\"header\":{\"account\":\"01a978766e428740495c4e320e93af0ca280108908107b3f9aa51640f66f4d7425\",\"timestamp\":\"2021-04-26T11:46:04.036Z\",\"ttl\":\"1800000ms\",\"gas_price\":1,\"body_hash\":\"59d0fd32b0c25ed49c4d15a6c34944fabddf69206afb76e46d129f6960c571fc\",\"dependencies\":[],\"chain_name\":\"casper-test\"},\"payment\":{\"ModuleBytes\":{\"module_bytes\":\"\",\"args\":[[\"amount\",{\"cl_type\":\"U512\",\"bytes\":\"03809698\",\"parsed\":\"null\"}]]}},\"session\":{\"Transfer\":{\"args\":[[\"amount\",{\"cl_type\":\"U512\",\"bytes\":\"0400daf89a\",\"parsed\":\"null\"}],[\"target\",{\"cl_type\":{\"ByteArray\":32},\"bytes\":\"ec94909f1ff34cccb97e58144146edec057b3331ebf15ca96e1cf50c1242d79b\",\"parsed\":\"null\"}],[\"id\",{\"cl_type\":{\"Option\":\"U64\"},\"bytes\":\"00\",\"parsed\":\"null\"}]]}},\"approvals\":[]}}");
        // @ts-ignore
        deploy = DeployUtil.deployFromJson(json);
        deploy = DeployUtil.signDeploy(deploy, senderKey);
        json = DeployUtil.deployToJson(deploy);
        console.log(JSON.stringify(json));
    };
}

export default new HomeController();
