export default function CreateProposal() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen p-8 pb-20">
      <div className="w-full max-w-lg">
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full mb-4"
        />
        <div>
          <textarea
            className="textarea textarea-bordered w-full mb-4"
            placeholder="Brief"
          ></textarea>
        </div>
        <div>
          <textarea
            className="textarea textarea-bordered w-full mb-4"
            rows={10}
            placeholder="Full Describe"
          ></textarea>
        </div>
        <button className="btn btn-primary w-full">Submit</button>
      </div>
    </div>
  )
}
