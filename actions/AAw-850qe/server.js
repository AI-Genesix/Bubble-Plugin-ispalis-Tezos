function(properties, context) {
	
	const { TezosToolkit } = require('@taquito/taquito');
    const { BeaconWallet } = require('@taquito/beacon-wallet');
 	const options = { name: 'exampleWallet' };
	const wallet = new BeaconWallet(options);
    const Tezos = new TezosToolkit('https://testnet-tezos.giganode.io');

	wallet
  	.requestPermissions({ network: { type: 'ghostnet' } })
  	.then((_) => wallet.getPKH())
  	.then((address) => println(`Your address: ${address}`));

	Tezos.setWalletProvider(wallet);
}