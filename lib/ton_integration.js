export async function connectWallet() {
    try {
        if (typeof window.ton !== 'undefined') {
            await window.ton.send('ton_requestAccounts');
            const address = await window.ton.send('ton_requestAccounts');
            console.log('Wallet connected:', address);
            return address;
        } else {
            window.open('https://wallet.ton.org', '_blank');
        }
    } catch (error) {
        console.error('Failed to connect wallet:', error);
    }
}

export async function sendTransaction(to, amount) {
    try {
        const result = await window.ton.send('ton_sendTransaction', [{
            to: to,
            value: TonWeb.utils.toNano(amount),
            data: '',
            dataType: 'text'
        }]);
        console.log('Transaction sent:', result);
        return result;
    } catch (error) {
        console.error('Failed to send transaction:', error);
    }
}
