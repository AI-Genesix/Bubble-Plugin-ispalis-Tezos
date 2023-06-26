function(instance, context) {

    instance.data.initialized = true;

    let constants = {
        methods: {
            connect: {
                id: 'connect'
            },
            transfer: {
                id: 'transfer',
                statuses: {
                    pending: {
                        id: 'pending'
                    },
                    completed: {
                        id: 'completed'
                    },
                    error: {
                        id: 'error'
                    }
                }
            },
            createContract: {
                id: 'createContract',
                messages: {
                    pending: () => {

                        return `Waiting for confirmation of origination...`
                    },
                    completed: (address) => {

                        return `Origination completed for ${address}.`
                    }
                },
                statuses: {
                    pending: {
                        id: 'pending'
                    },
                    completed: {
                        id: 'completed'
                    },
                    error: {
                        id: 'error'
                    }
                }
            }
        },
        states: {
            errorMessage: {
                id: 'errorMessage'
            },
            userAddress: {
                id: 'userAddress'
            },
            transferAddressTarget: {
                id: 'transferAddressTarget'
            },
            transferAddressSender: {
                id: 'transferAddressSender'
            },
            transferAmount: {
                id: 'transferAmount'
            },
            transferStatus: {
                id: 'transferStatus'
            },
            transferId: {
                id: 'transferId'
            },
            transferErrorMessage: {
                id: 'transferErrorMessage'
            },
            transferURL: {
                id: 'transferURL'
            },
            transferURLAPI: {
                id: 'transferURLAPI'
            },
            contractStatus: {
                id: 'contractStatus'
            },
            contractStatusMessage: {
                id: 'contractStatusMessage'
            },
            contractAddress: {
                id: 'contractAddress'
            },
            contractErrorMessage: {
                id: 'contractErrorMessage'
            },
            contractURL: {
                id: 'contractURL'
            },
            contractURLAPI: {
                id: 'contractURLAPI'
            },
        },
        currency: {
            tezos: {
                id: 'tezos',
                symbol: 'ꜩ'
            }
        },
        errorMessages: {
            noNetwork: {
                id: 'noNetwork',
                message: 'Empty network. Please provide your preferred RPC URL in the plugin settings.'
            },
            wrongNetwork: {
                id: 'noNetworkType',
                message: (walletNetwork, validNetworks) => {

                    return `Selected walletNetwork "${walletNetwork}" is not valid. Valid walletNetworks: ${validNetworks.join(', ')}.`
                }
            },
            noNetworkType: {
                id: 'noNetworkType',
                message: 'Please attach the "walletNetwork." It should be not empty.'
            },
            noWallet: {
                id: 'noWallet',
                message: 'The "wallet" is empty. Please connect your wallet first.'
            },
            unexpectedError: {
                id: 'unexpectedError',
                message: 'Unexpected Error. 🐛'
            },
            noAddress: {
                id: 'noAddress',
                message: 'Empty address.'
            },
            transferNoAddress: {
                id: 'transferNoAddress',
                message: 'The "address" should not be empty.'
            },
            transferNoAmount: {
                id: 'transferNoAmount',
                message: 'The "amount" should not be empty.'
            },
            transferLowAmount: {
                id: 'transferLowAmount',
                message: 'The "amount" should be greater than 0.'
            }
        },
        walletNetworks: {
            mainnet: {
                id: 'mainnet'
            },
            sandbox: {
                id: 'ghostnet'
            }
        },
        tzExplorerAPI: {
            types: {
                operations: {
                    id: 'operations'
                },
                contracts: {
                    id: 'contracts'
                }
            }
        },
        urls: {
            tzExplorer: {
                mainnet: {
                    browser: 'https://tzkt.io/',
                    api: 'https://api.tzkt.io/',
                },
                ghostnet: {
                    browser: 'https://ghostnet.tzkt.io/',
                    api: 'https://api.ghostnet.tzkt.io/',
                }
            },
            taquitoMin: {
                lookBy: 'taquito',
                url: '//meta-l.cdn.bubble.io/f1687506401200x140275660008050600/taquito.min.js',
                responseType: 'script'
            },
            taquitoBeaconWallet: {
                lookBy: 'taquitoBeaconWallet',
                url: '//meta-l.cdn.bubble.io/f1687506430948x932559954189046400/taquito-beacon-wallet.umd.js',
                responseType: 'script'
            }
        },
        justThings: {
            rpcUrl: 'rpcUrl',
            https: 'https://'
        }
    };
    
    instance.data.constants = constants;


    let publishError = (error, method) => {

        let errorMessage = error.message;

        if (typeof errorMessage !== 'string') errorMessage = JSON.stringify(errorMessage);
        if (typeof errorMessage === 'string') errorMessage = errorMessage.trim();

        if (!method) method = constants.methods.connect.id;

        let stateName, stateTwoName;
        let stateTwoValue;

        if (method === constants.methods.connect.id) {

            stateName = constants.states.errorMessage.id
        } else if (method === constants.methods.transfer.id) {

            stateName = constants.states.transferErrorMessage.id;
            stateTwoName = constants.states.transferStatus.id;
            stateTwoValue = constants.methods.transfer.statuses.error.id
        } else if (method === constants.methods.createContract.id) {

            stateName = constants.states.contractErrorMessage.id
        }

        instance.publishState(stateName, errorMessage);
        if (stateTwoName && stateTwoValue) instance.publishState(stateTwoName, stateTwoValue)
    };
    instance.data.publishError = publishError;


    let resetConnectStates = () => {

        instance.publishState(constants.states.errorMessage.id, null);
        instance.publishState(constants.states.userAddress.id, null);
    };
    instance.data.resetConnectStates = resetConnectStates;

    let resetTransferStates = () => {

        instance.publishState(constants.states.transferAddressSender.id, null);
        instance.publishState(constants.states.transferAddressTarget.id, null);
        instance.publishState(constants.states.transferAmount.id, null);
        instance.publishState(constants.states.transferStatus.id, null);
        instance.publishState(constants.states.transferId.id, null);
        instance.publishState(constants.states.transferErrorMessage.id, null);
        instance.publishState(constants.states.transferURL.id, null);
        instance.publishState(constants.states.transferURLAPI.id, null);
    };
    instance.data.resetTransferStates = resetTransferStates;

    let resetContractStates = () => {

        instance.publishState(constants.states.contractStatus.id, null);
        instance.publishState(constants.states.contractStatusMessage.id, null);
        instance.publishState(constants.states.contractErrorMessage.id, null);
        instance.publishState(constants.states.contractAddress.id, null);
    };
    instance.data.resetContractStates = resetContractStates;


    $.customLoadFile = (url, type, callback) => {

        $.ajax({
            url: url,
            dataType: type,
            success: callback,
            async: true,
            cache: true
        })
    };


    if (!window[constants.urls.taquitoMin.lookBy]) {

        $.customLoadFile(constants.urls.taquitoMin.url, constants.urls.taquitoMin.responseType, () => {
        });
    }
    

    if (!window[constants.urls.taquitoBeaconWallet.lookBy]) {

        $.customLoadFile(constants.urls.taquitoBeaconWallet.url, constants.urls.taquitoBeaconWallet.responseType, () => {
        });
    }


    let disconnectWallet = () => {

        if (instance.data.initialized !== true) return;

        if (!instance.data.wallet) return;

        try {

            instance.data.wallet.clearActiveAccount().then().catch();

            instance.data.resetConnectStates();
            instance.data.resetTransferStates();

            delete instance.data.wallet

        } catch (e) {

        }
    };
    instance.data.disconnectWallet = disconnectWallet;

    let handleProps = (props) => {

        let {rpcUrlMainnet, rpcUrlSandboxNetwork} = props;
        let rpcUrlMainnet_ = instance.data.rpcUrlMainnet;
        let rpcUrlSandboxNetwork_ = instance.data.rpcUrlSandboxNetwork;

        let requiresHardReset = false;

        if (rpcUrlMainnet_ || rpcUrlSandboxNetwork_) {

            requiresHardReset = true;
        }

        if (requiresHardReset) {

            //TODO: add code here :)
        }

        instance.data.rpcUrlMainnet = rpcUrlMainnet;
        instance.data.rpcUrlSandboxNetwork = rpcUrlSandboxNetwork
    };
    instance.data.handleProps = handleProps;

    let capitalizeString = (str) => {
        const lower = str.toLowerCase();
        return str.charAt(0).toUpperCase() + lower.slice(1)
    };
    instance.data.capitalizeString = capitalizeString;

    let generateId = (length) => {

        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;

        for (let i = 0; i < length; i++) {

            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }

        return result
    };
    instance.data.generateId = generateId;

    let walletRequired = () => {


        if (instance.data.initialized === true && instance.data.wallet) {

            return {
                error: false,
                errorMessage: null
            }
        } else {

            return {
                error: true,
                errorMessage: constants.errorMessages.noWallet.message
            }
        }
    };
    instance.data.walletRequired = walletRequired;

    let deleteWallet = () => {

        if (window.BeaconWalletInitialized) {

            if (typeof window.BeaconWalletInitialized.disconnect === 'function') {

                window.BeaconWalletInitialized.disconnect()
                    .then(() => {

                        delete window.BeaconWalletInitialized
                    })
                    .catch(() => {

                        delete window.BeaconWalletInitialized
                    })
            }
        }

        delete instance.data.wallet
    };

    let resetConnect = () => {

        resetConnectStates();
        delete instance.data.rpcUrl;
        delete instance.data.Tezos;

        deleteWallet();
        delete instance.data.walletNetwork;
        delete instance.data.userAddress
    };
    instance.data.resetConnect = resetConnect;

    let resetTransfer = () => {

        delete instance.data.transferRandomId;
        resetTransferStates()
    };
    instance.data.resetTransfer = resetTransfer;

    let resetContract = () => {

        delete instance.data.contractRandomId;
        resetContractStates()
    };
    instance.data.resetContract = resetContract;

    let resetFA2Transfer = () => {
    };
    instance.data.resetFA2Transfer = resetFA2Transfer;

    let fullReset = () => {

        resetConnect();
        resetTransfer();
        // resetContract();
        // resetFA2Transfer()
    };
    instance.data.fullReset = fullReset
}