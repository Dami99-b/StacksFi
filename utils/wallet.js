import { generateWallet } from '@stacks/wallet-sdk';

export async function createNewWallet(password = 'stackfi_demo_password') {
  try {
    const wallet = await generateWallet({ secretKey: undefined, password });
    return {
      address: wallet.accounts[0].address,
      publicKey: wallet.accounts[0].stxPublicKey,
      secretKey: wallet.secretKey,
    };
  } catch (error) {
    console.error('Wallet generation error:', error);
    throw new Error('Wallet generation failed');
  }
}
