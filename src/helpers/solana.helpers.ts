import {Keypair, Connection} from '@solana/web3.js'

export const createSolanaWallet = async () => {
const connection = new Connection('https://api.devnet.solana.com');
const walletKeypair = Keypair.generate();
console.log('Wallet created successfully!');
console.log(`Wallet Address: ${walletKeypair.publicKey.toBase58()}`);
console.log(`Wallet Secret Key: ${walletKeypair.secretKey.toString()}`)
const data = {
  public_key: walletKeypair.publicKey.toBase58(),
  private_key : walletKeypair.secretKey.toString()
}
return  data
}