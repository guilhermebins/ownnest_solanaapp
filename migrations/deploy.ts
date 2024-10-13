const anchor = require("@coral-xyz/anchor");

module.exports = async function (provider) {
  // Configura o cliente para usar o provider fornecido.
  anchor.setProvider(provider);

  // Pega o ID do programa (Program ID) e o IDL do programa.
  const programId = new anchor.web3.PublicKey("FJw28pVHzWdnuuQ8LPm97D4NT3aKxdbm2nj15uHh46jx_ID_HERE"); // Substitua pelo seu Program ID
  const idl = await anchor.Program.fetchIdl(programId, provider);

  // Cria uma instância do programa usando o IDL e o provider.
  const program = new anchor.Program(idl, programId, provider);

  // Chave secreta do usuário (wallet) para assinatura das transações.
  const secret = Uint8Array.from([/* ... seu array de chave privada ... */]);
  const wallet = anchor.web3.Keypair.fromSecretKey(secret);

  // Exemplo de transação que cria uma conta e executa uma instrução no programa.
  try {
    // Gera um Keypair para a conta que será criada.
    const designAccount = anchor.web3.Keypair.generate();

    // Tamanho do espaço que a conta precisará (exemplo: 1024 bytes).
    const space = 8 + 1024; // Ajuste conforme necessário.

    // Lamports necessários para criar a conta (use o método rentExemption).
    const lamports = await provider.connection.getMinimumBalanceForRentExemption(space);

    // Criação da transação de inicialização da conta (SystemProgram.createAccount).
    const tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: designAccount.publicKey,
        space: space,
        lamports: lamports,
        programId: program.programId,
      })
    );

    // Assina e envia a transação.
    const signature = await provider.sendAndConfirm(tx, [wallet, designAccount]);

    console.log("Conta criada com sucesso! Transaction Signature:", signature);
    console.log("Endereço da conta de design:", designAccount.publicKey.toString());

  } catch (error) {
    console.error("Erro ao executar deploy ou criar conta:", error);
  }
};
