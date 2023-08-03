function(instance, properties, context) {

    if (typeof instance.data.disconnectWallet === 'function') instance.data.disconnectWallet()
    instance.data.userAddress = '';
    instance.publishState(constants.states.userAddress.id, '');

}