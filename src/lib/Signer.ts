/**
 * Provide methods to communicate with [CasperLabs Signer Extension](https://github.com/CasperLabs/signer).
 * Works only on browser.
 *
 * @packageDocumentation
 */

/**
 * Check whether CasperLabs Signer extension is connected
 */
export const isConnected: () => Promise<boolean> = async () => {
    // @ts-ignore
    return await window.casperlabsHelper!.isConnected();
};

/**
 * Attempt connection to Signer
 */
export const sendConnectionRequest: () => void = () => {
    // @ts-ignore
    return window.casperlabsHelper!.requestConnection();
};

/**
 * Return base64 encoded public key of user current selected account.
 *
 * @throws Error if haven't connected to CasperLabs Signer browser extension.
 */
export const getSelectedPublicKeyBase64: () => Promise<string> = () => {
    // @ts-ignore
    return window.casperlabsHelper!.getSelectedPublicKeyBase64();
};

/**
 * send base16 encoded message to plugin to sign
 *
 * @param messageBase16 the base16 encoded message that plugin received to sign
 * @param publicKeyBase64 the base64 encoded public key used to sign the deploy, if set, we will check whether it is the same as the active key for signing the message, otherwise, we won't check.
 *
 * @throws Error if haven't connected to CasperLabs Signer browser extension.
 * @throws Error if publicKeyBase64 is not the same as the key that Signer used to sign the message
 */
export const sign: (
    messageBase16: string,
    publicKeyBase64?: string
) => Promise<string> = (messageBase16: string, publicKeyBase64?: string) => {
    // @ts-ignore
    return window.casperlabsHelper!.sign(messageBase16, publicKeyBase64);
};

export const forceConnection: () => void = () => {
    // @ts-ignore
    return window.signerTestingHelper!.forceConnection();
};

export const forceDisconnect: () => void = () => {
    // @ts-ignore
    return window.signerTestingHelper!.forceDisconnect();
};

export const hasCreatedVault: () => Promise<boolean> = () => {
    // @ts-ignore
    return window.signerTestingHelper!.hasCreatedVault();
};

export const resetExistingVault: () => Promise<void> = () => {
    // @ts-ignore
    return window.signerTestingHelper!.resetExistingVault();
};

export const createNewVault: (password: string) => Promise<void> = (
    password: string
) => {
    // @ts-ignore
    return window.signerTestingHelper!.createNewVault(password);
};

export const createTestAccount: (
    name: string,
    privateKey: string
) => Promise<void> = (name: string, privateKey: string) => {
    // @ts-ignore
    return window.signerTestingHelper!.createTestAccount(name, privateKey);
};

export const getToSignMessageID: () => Promise<number | null> = () => {
    // @ts-ignore
    return window.signerTestingHelper!.getToSignMessageID();
};

export const signTestDeploy: (msgId: number) => Promise<void> = (
    msgId: number
) => {
    // @ts-ignore
    return window.signerTestingHelper!.signTestDeploy(msgId);
};
