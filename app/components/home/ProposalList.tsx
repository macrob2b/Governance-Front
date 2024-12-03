import {
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey
} from '@solana/web3.js'

export default function ProposalList() {
  return (
    <div>
      <div className="card bg-base-100 w-100 shadow-xl mb-1">
        <div className="card-body">
          <p>
            Propsal 1 ..................Propsal 1 ..................Propsal 1
            ..................Propsal 1 ..................
          </p>
        </div>
      </div>
      <div className="card bg-base-100 w-100 shadow-xl mb-1">
        <div className="card-body">
          <p>Propsal 2 ........................</p>
        </div>
      </div>
    </div>
  )
}
