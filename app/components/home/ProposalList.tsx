'use client'
import { getProgram } from '@/utils/connectAnchorProgram' // Adjust the path as needed
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils'
import { ProgramAccount } from '@project-serum/anchor'

import {
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey
} from '@solana/web3.js'
import { useEffect, useState, useCallback, useRef } from 'react'
interface Proposal {
  owner: PublicKey
  title: string
  brief: string
}

export default function ProposalList() {
  const [proposals, setProposals] = useState<Array<Proposal>>([])

  useEffect(() => {
    getPlansByUser()
  }, [])

  const getPlansByUser = async () => {
    const program = getProgram()

    try {
      // Fetch all accounts for the program where the owner is the user's public key
      const proposals = await program.account.proposal
        .all
        // [
        // {
        //   memcmp: {
        //     offset: 8, // Adjust based on where the owner field is in the Plan struct
        //     bytes: userPublicKey.toBase58()
        //   }
        // }
        // ]
        ()

      const proposalArray: Proposal[] = proposals.map(
        (proposal: ProgramAccount<any>) => ({
          owner: proposal.account.owner, // Convert the owner publicKey to base58
          title: proposal.account.title,
          brief: proposal.account.brief
        })
      )

      setProposals(proposalArray)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      // setListIsLoading(false)
    }
  }

  return (
    <div>
      {proposals.map((proposal, index) => (
        <div
          key={index}
          className="card bg-base-100 w-100 shadow-xl mb-1"
        >
          <div className="card-body">
            <h3>{proposal.title}</h3>
            <p>{proposal.brief}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
