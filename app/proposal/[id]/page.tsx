'use client'

import { useParams } from 'next/navigation'
import { getProgram } from '@/utils/connectAnchorProgram' // Adjust the path as needed
import { web3, AnchorError, AnchorProvider } from '@project-serum/anchor'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import Link from 'next/link'
interface Proposal {
  owner: string
  title: string
  brief: string
  hasVoted: boolean
}
export default function ShowProposal() {
  const { id } = useParams()

  const { publicKey } = useWallet()

  const [isLoading, setLoading] = useState(true)
  const [isVoteLoading, setVoteLoading] = useState(false)

  const [details, setDetails] = useState<Proposal | null>(null)
  const [notice, setNotice] = useState({ msg: '', type: '' })

  useEffect(() => {
    const fetchProposal = async () => {
      if (id && typeof id === 'string') {
        try {
          const data = await getProposal(id) // Await the result of the async call
          // Set the details when data is fetched
          setDetails(data)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchProposal() // Call the async function
  }, [id])

  const getProposal = async (key: string) => {
    setLoading(true)
    const proposalPublicKey = new PublicKey(key)
    const program = getProgram()
    const provider = program.provider as AnchorProvider

    try {
      const proposal = await program.account.proposal.fetch(proposalPublicKey)

      const [pdaPublicKey] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from('vote-record'),
          proposalPublicKey.toBuffer(),
          provider.wallet.publicKey.toBuffer()
        ],
        program.programId
      )

      let voteData = { hasVoted: true }
      try {
        const proposalVote = await program.account.voteRecord.fetch(
          pdaPublicKey
        )
        voteData.hasVoted = proposalVote.hasVoted as boolean
      } catch {
        voteData.hasVoted = false
      }
      return {
        owner: proposal.owner,
        title: proposal.title,
        brief: proposal.brief,
        hasVoted: voteData.hasVoted
      } as Proposal
    } catch (err) {
      throw new Error('Load Error')
    } finally {
      setLoading(false)
    }
  }

  //Submti vote
  const voteProposal = async () => {
    setVoteLoading(true)

    try {
      const program = getProgram()
      const provider = program.provider as AnchorProvider

      if (id && typeof id === 'string') {
        // Call the `vote proposal` instruction defined in the IDL
        const agree = true
        const proposalPublicKey = new PublicKey(id)
        const [pdaPublicKey] = await PublicKey.findProgramAddressSync(
          [
            Buffer.from('vote-record'),
            proposalPublicKey.toBuffer(),
            provider.wallet.publicKey.toBuffer()
          ],
          program.programId
        )

        try {
          await program.methods
            .vote(agree)
            .accounts({
              proposal: id,
              voter: provider.wallet.publicKey,
              voteRecord: pdaPublicKey,
              systemProgram: web3.SystemProgram.programId
            })
            .rpc()
          setNotice({ msg: 'Deleted successfully', type: 'success' })
        } catch (err) {
          setNotice({ msg: `${err}`, type: 'error' })
        }
      } else throw new Error("Can't fint proposal")
    } catch (err) {
      if (err instanceof AnchorError) {
        setNotice({ msg: err.error.errorMessage, type: 'err' })
      } else {
        setNotice({ msg: `TransactionError: ${err}`, type: 'err' })
      }
    } finally {
      setVoteLoading(false)
    }
  }

  return (
    <div className="grid grid-rows-[10px_1fr_10px] max-w-full   items-top justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        {!isLoading ? (
          <div>
            <Link
              href="/"
              className="btn btn-error btn-outline  mb-2"
            >
              Back
            </Link>
            <div className="card bg-base-100 w-full max-w-full shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {details?.title}
                  <div className="badge badge-secondary">NEW IDEA</div>
                </h2>
                <p className=" break-words whitespace-pre-wrap">
                  {details?.brief}
                </p>
                <div className="card-actions justify-end">
                  {!details?.hasVoted ? (
                    <div>
                      <button
                        onClick={() => voteProposal()}
                        className="btn btn-outline btn-success "
                      >
                        Agree
                      </button>
                      <button
                        onClick={() => voteProposal()}
                        className="btn btn-outline btn-error"
                      >
                        Disagree
                      </button>
                    </div>
                  ) : (
                    <div className="text-bold text-amber-900 font-bold	">
                      You already voted
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading ...</div>
        )}
      </main>
    </div>
  )
}
