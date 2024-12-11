'use client'
import { getProgram } from '@/utils/connectAnchorProgram' // Adjust the path as needed
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils'
import { ProgramAccount } from '@project-serum/anchor'
import Link from 'next/link'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState, useCallback, useRef } from 'react'
interface Proposal {
  id: PublicKey
  owner: PublicKey
  title: string
  brief: string
}

export default function ProposalList() {
  const [proposals, setProposals] = useState<Array<Proposal>>([])
  const [listLoading, setListLoading] = useState(true)

  useEffect(() => {
    getProposalList()
  }, [])

  const getProposalList = async () => {
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
          id: proposal.publicKey,
          owner: proposal.account.owner, // Convert the owner publicKey to base58
          title: proposal.account.title,
          brief: proposal.account.brief
        })
      )

      setProposals(proposalArray)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      setListLoading(false)
    }
  }

  return (
    <div>
      {!listLoading ? (
        <div>
          {proposals.length ? (
            <div>
              <table className="w-full lg:w-1/2 table-auto mx-auto mb-14">
                <thead>
                  <tr>
                    <th className="text-left min-w-[180px]">Title</th>
                    <th className="text-left min-w-[120px]">Type</th>
                    <th className="text-left min-w-[120px]">Expiry Date</th>
                    <th className="text-left min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((proposal, index) => (
                    <tr key={index}>
                      <td className="py-1">{proposal.title}</td>
                      <td className="py-2">Unknown</td>
                      <td className="py-2">Unknown</td>
                      <td className="py-2">
                        <Link
                          href={`/proposal/${proposal.id}`}
                          className="btn btn-outline btn-xs btn-success mr-1"
                        >
                          Show
                        </Link>
                        {/* <button className="btn btn-outline btn-xs btn-error ">
                          Delete
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Opps! not found any proposal</div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <span className="loading loading-ball loading-sm " />
          <span className="loading loading-ball loading-sm" />
          <span className="loading loading-ball loading-md" />
          <span className="loading loading-ball loading-lg" />
        </div>
      )}
    </div>
  )
}
