
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-5">
        <div>
            <img className="sm:max-w-[200px]" src="mrc-logo.png" alt="logo mr crypto" />
        </div>

        <div className="ml-3">
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                Conectar cartera
            </button>
        </div>
    </nav>
  )
}

export default Navbar