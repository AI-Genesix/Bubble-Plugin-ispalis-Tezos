function(instance, properties, context) {

    let {Tezos, constants} = instance.data;

    try {

        let walletRequired = instance.data.walletRequired();

        if (walletRequired.error) {

            throw new Error(walletRequired.errorMessage)
        }

        instance.data.resetTransferStates();

        let {address, amount} = properties;
        let transferStatuses = constants.methods.transfer.statuses;

        instance.data.transferRandomId = instance.data.generateId(10);

        instance.publishState(constants.states.transferStatus.id, transferStatuses.pending.id);
        instance.publishState(constants.states.transferAddressTarget.id, address);
        instance.publishState(constants.states.transferAddressSender.id, instance.data.userAddress);
        instance.publishState(constants.states.transferAmount.id, amount);


        if (!instance.data.wallet) {

            throw new Error(constants.errorMessages.noWallet.message)
        }

        if (typeof address === 'string') address = address.trim();
        if (!address || address === '') throw new Error(constants.errorMessages.transferNoAddress.message);

        if (isNaN(amount) || !amount) throw new Error(constants.errorMessages.transferNoAmount.message);
        if (amount <= 0) throw new Error(constants.errorMessages.transferLowAmount.message);


        let publishUrl = (hash, type) => {

            let urls = constants.urls.tzExplorer[instance.data.walletNetwork];
            if (type === 1) instance.publishState(constants.states.transferURL.id, `${urls.browser}${hash}`);
            if (type === 2) instance.publishState(constants.states.transferURLAPI.id, `${urls.api}${constants.tzExplorerAPI.types.operations.id}/${hash}`)
        };

        let transferRandomId_ = instance.data.transferRandomId;
        let checkIfRelevant = () => {

            return instance.data.transferRandomId === transferRandomId_
        };
        
        Tezos.wallet
          .at('KT1SHiNUNmqBFGNysX9pmh1DC2tQ5pGmRagC')
          .then((contract) =>
            contract.methods.addName('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', 'Alice').send()
          )
          .then((op) => {
            println(`Hash: ${op.opHash}`);
            return op.confirmation();
          })
          .then((result) => {
            console.log(result);
            if (result.completed) {
              println(`Transaction correctly processed!
              Block: ${result.block.header.level}
              Chain ID: ${result.block.chain_id}`);
            } else {
              println('An error has occurred');
            }
          }).catch((err) => console.log(err));

    } catch (e) {

        instance.data.publishError(e, constants.methods.transfer.id)
    }

}