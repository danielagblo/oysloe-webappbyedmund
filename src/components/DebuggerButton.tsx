function DebuggerButton({ title, data }: { title?: string, data: unknown }) {
  return (
    <>
      {/* button for debugging. i'll remove when im done */}
      <button
        name="sexy button. most useful button."
        className="fixed z-50 top-10 left-10 bg-pink-200 p-3 cursor-pointer hidden"
        onClick={() => console.log(title, ": ", data)}
      >
        {title}
      </button>
    </>
  )
}

export default DebuggerButton
