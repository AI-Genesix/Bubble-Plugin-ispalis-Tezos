function(instance, properties, context) {

    if (instance.data.initialized !== true) return;

    instance.data.resetConnectStates();

    let constants = instance.data.constants;

    try {
        
        let {TezosToolkit} = window.taquito;
        let {BeaconWallet} = window.taquitoBeaconWallet;

        let {appName, appIcon, walletNetwork} = properties;
        let walletNetwork_;
		
        const Tezos = new TezosToolkit('https://testnet-tezos.giganode.io');
        const options = { name: 'ispalis -> transfer' };
        const wallet = new BeaconWallet(options);

        wallet.requestPermissions({
            network: {
                type: walletNetwork,
            },
        }).then(result => {

            wallet.getPKH().then(result_ => {

                userAddress = result_;
                instance.data.userAddress = userAddress;
                instance.publishState(constants.states.userAddress.id, userAddress);

                Tezos.setWalletProvider(wallet)

            }).catch(e => {

                instance.data.publishError(e, constants.methods.connect.id)

            });
            
            Tezos.wallet
              .transfer({ to: 'tz1NhNv9g7rtcjyNsH8Zqu79giY5aTqDDrzB', amount: 0.2 })
              .send()
              .then((op) => {
                println(`Hash: ${op.opHash}`);

                op.confirmation()
                  .then((result) => {
                    console.log(result);
                    if (result.completed) {
                      println('Transaction correctly processed!');
                    } else {
                      println('An error has occurred');
                    }
                  })
                  .catch((err) => println(err));
              });
        }).catch(e => {

            instance.data.publishError(e, constants.methods.connect.id)
        });
        	
		
    } catch (e) {

        instance.data.publishError(e, constants.methods.connect.id)
    }


}