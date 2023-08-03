function(instance, properties, context) {

    if (instance.data.initialized !== true) return;

    instance.data.resetConnectStates();

    let constants = instance.data.constants;

    try {
        
        let {TezosToolkit} = window.taquito;
        let {BeaconWallet} = window.taquitoBeaconWallet;

        let {appName, appIcon, walletNetwork, walletNetworkDynamic} = properties;
        let walletNetwork_;
		
        instance.data.rpcUrl = 'https://testnet-tezos.giganode.io';
        instance.data.Tezos = new TezosToolkit('https://testnet-tezos.giganode.io');
        const options = { name: appName };
        const wallet = new BeaconWallet(options);
        instance.data.wallet = wallet;

        instance.data.wallet.requestPermissions({
            network: {
                type: walletNetwork,
            },
        }).then(result => {

            wallet.getPKH().then(result_ => {

                userAddress = result_;
                instance.data.userAddress = userAddress;
                instance.publishState(constants.states.userAddress.id, userAddress);

                instance.data.Tezos.setWalletProvider(instance.data.wallet)

            }).catch(e => {

                instance.data.publishError(e, constants.methods.connect.id)

            })
        }).catch(e => {

            instance.data.publishError(e, constants.methods.connect.id)
        });
        	
		
    } catch (e) {

        instance.data.publishError(e, constants.methods.connect.id)
    }


}