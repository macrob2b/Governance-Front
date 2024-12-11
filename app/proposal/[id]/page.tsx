'use client'
// import dynamic from 'next/dynamic'
// const Editor = dynamic(() => import('../components/Editor'), {
//   ssr: false
// })
import { useParams } from 'next/navigation'
import { getProgram } from '@/utils/connectAnchorProgram' // Adjust the path as needed
import { web3, AnchorError, AnchorProvider } from '@project-serum/anchor'
import { useEffect, useState } from 'react'
import { titleSchema, briefSchema } from '@/utils/validationSchemas'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { error } from 'console'

interface Proposal {
  owner: string
  title: string
  brief: string
}
export default function CreateProposal() {
  const { id } = useParams()

  const { publicKey } = useWallet()

  const [isLoading, setLoading] = useState(true)

  const [details, setDetails] = useState<Proposal | null>(null)
  // const [proposalType, setType] = useState('')
  // const [brief, setBreif] = useState('')
  // const [notice, setNotice] = useState({ msg: '', type: '' })

  // const submitProposal = async () => {
  //   // Validate the IP address using Zod schema
  //   const titleValidation = titleSchema.safeParse(title)
  //   const briefValidation = briefSchema.safeParse(brief)

  //   if (titleValidation.success) {
  //     // Clear error and proceed with the valid IP address
  //     setNotice({ msg: '', type: '' })
  //   } else {
  //     // Set error message if validation fails
  //     setNotice({
  //       msg: titleValidation.error.errors[0].message,
  //       type: 'err'
  //     })
  //     return
  //   }

  //   if (briefValidation.success) {
  //     // Clear error and proceed with the valid IP address
  //     setNotice({ msg: '', type: '' })
  //   } else {
  //     // Set error message if validation fails
  //     setNotice({
  //       msg: briefValidation.error.errors[0].message,
  //       type: 'err'
  //     })
  //     return
  //   }
  //   // return
  //   setIsLoading(true)

  //   try {
  //     const program = getProgram()
  //     const provider = program.provider as AnchorProvider

  //     // Generate a new keypair for the proposal
  //     const proposal = web3.Keypair.generate()

  //     // Call the `submit proposal` instruction defined in the IDL
  //     await program.methods
  //       .submitProposal(title, brief)
  //       .accounts({
  //         proposal: proposal.publicKey,
  //         user: provider.wallet.publicKey,
  //         systemProgram: web3.SystemProgram.programId
  //       })
  //       .signers([proposal])
  //       .rpc()

  //     setNotice({ msg: 'Proposal submited successfully', type: 'success' })
  //   } catch (err) {
  //     if (err instanceof AnchorError) {
  //       setNotice({ msg: err.error.errorMessage, type: 'err' })
  //     } else {
  //       setNotice({ msg: `TransactionError: ${err}`, type: 'err' })
  //     }
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  useEffect(() => {
    const fetchProposal = async () => {
      if (id && typeof id === 'string') {
        try {
          const data = await getProposal(id) // Await the result of the async call
          setDetails(data) // Set the details when data is fetched
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchProposal() // Call the async function
  }, [id])

  const getProposal = async (key: string) => {
    const proposalPublicKey = new PublicKey(key)
    const program = getProgram()

    try {
      const proposal = await program.account.proposal.fetch(proposalPublicKey)

      return {
        owner: proposal.owner,
        title: proposal.title,
        brief: proposal.brief
      } as Proposal
    } catch {
      throw new Error('Load Error')
    }
  }

  return (
    <div className="grid grid-rows-[10px_1fr_10px] max-w-full   items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        <div className="card bg-base-100 w-full max-w-full shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {details?.title}
              <div className="badge badge-secondary">NEW IDEA</div>
            </h2>
            <p className=" break-words whitespace-pre-wrap">{details?.brief}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline badge-success">Agree</div>
              <div className="badge badge-outline badge-error">Disagree</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
